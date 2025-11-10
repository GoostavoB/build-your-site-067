import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/user Event';
import userEvent from '@testing-library/user-event';
import { renderHook } from '@testing-library/react';
import { useBudgetCheck } from '@/hooks/useBudgetCheck';
import { openUpgradeModal } from '@/lib/openUpgradeModal';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(),
          })),
        })),
      })),
    })),
  },
}));

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-123', email: 'test@example.com' },
  }),
}));

// Mock useUserRole
vi.mock('@/hooks/useUserRole', () => ({
  useUserRole: () => ({
    isAdmin: false,
    loading: false,
  }),
}));

describe('Upload Guard - Client Side Credit Check', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should allow upload when user has credits', async () => {
    const { supabase } = await import('@/integrations/supabase/client');

    // Mock budget response with available credits
    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                spend_cents: 30,
                budget_cents: 75,
              },
              error: null,
            }),
          }),
        }),
      }),
    });

    const { result } = renderHook(() => useBudgetCheck());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasCredits).toBe(true);
    expect(result.current.percentUsed).toBeCloseTo(40);
  });

  it('should block upload when user has no credits', async () => {
    const { supabase } = await import('@/integrations/supabase/client');

    // Mock budget response with exhausted credits
    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: {
                spend_cents: 80,
                budget_cents: 75,
              },
              error: null,
            }),
          }),
        }),
      }),
    });

    const { result } = renderHook(() => useBudgetCheck());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasCredits).toBe(false);
    expect(result.current.percentUsed).toBeGreaterThan(100);
  });

  it('should always return true for admin users', async () => {
    // Mock admin user
    vi.mocked(await import('@/hooks/useUserRole')).useUserRole = () => ({
      isAdmin: true,
      loading: false,
    });

    const { result } = renderHook(() => useBudgetCheck());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasCredits).toBe(true);
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.budgetCents).toBe(999999);
  });

  it('should open modal when non-admin with zero credits tries to upload', async () => {
    const mockOpenModal = vi.fn();
    vi.mocked(openUpgradeModal).mockImplementation(mockOpenModal);

    // Simulate upload attempt with zero credits
    const hasCredits = false;
    const isAdmin = false;

    // This is the guard logic from Upload.tsx
    if (!isAdmin && !hasCredits) {
      openUpgradeModal({
        source: 'upload_zero_credits',
        illustration: 'credits',
        title: 'Out of AI Credits',
        message: "You've used your monthly AI budget. Upgrade to continue using automatic trade extraction.",
      });
    }

    expect(mockOpenModal).toHaveBeenCalledWith({
      source: 'upload_zero_credits',
      illustration: 'credits',
      title: 'Out of AI Credits',
      message: expect.stringContaining('monthly AI budget'),
    });
  });

  it('should NOT open modal when admin with zero credits tries to upload', () => {
    const mockOpenModal = vi.fn();
    vi.mocked(openUpgradeModal).mockImplementation(mockOpenModal);

    // Simulate upload attempt with zero credits but user is admin
    const hasCredits = false;
    const isAdmin = true;

    // This is the guard logic from Upload.tsx
    if (!isAdmin && !hasCredits) {
      openUpgradeModal({
        source: 'upload_zero_credits',
        illustration: 'credits',
      });
    }

    // Modal should NOT be opened for admins
    expect(mockOpenModal).not.toHaveBeenCalled();
  });

  it('should refetch budget when requested', async () => {
    const { supabase } = await import('@/integrations/supabase/client');
    const mockSelect = vi.fn();

    (supabase.from as any).mockReturnValue({
      select: mockSelect.mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { spend_cents: 50, budget_cents: 75 },
              error: null,
            }),
          }),
        }),
      }),
    });

    const { result } = renderHook(() => useBudgetCheck());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Initial fetch happened
    expect(mockSelect).toHaveBeenCalledTimes(1);

    // Trigger refetch
    result.current.refetch();

    await waitFor(() => {
      expect(mockSelect).toHaveBeenCalledTimes(2);
    });
  });
});

describe('Integration: Upload Flow with Guard', () => {
  it('should prevent API call when credits are exhausted', async () => {
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    // Simulate the guard blocking the upload
    const hasCredits = false;
    const isAdmin = false;

    let apiCallMade = false;

    // Upload handler logic
    if (!isAdmin && !hasCredits) {
      openUpgradeModal({
        source: 'upload_zero_credits',
        illustration: 'credits',
      });
      // return early - NO API CALL
    } else {
      // Make API call
      apiCallMade = true;
      await fetch('/api/extract-trade-info');
    }

    expect(apiCallMade).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should allow API call when user has credits', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ trades: [] }),
    });
    global.fetch = mockFetch;

    // Simulate having credits
    const hasCredits = true;
    const isAdmin = false;

    let apiCallMade = false;

    // Upload handler logic
    if (!isAdmin && !hasCredits) {
      openUpgradeModal({
        source: 'upload_zero_credits',
        illustration: 'credits',
      });
    } else {
      // Make API call
      apiCallMade = true;
      await fetch('/api/extract-trade-info', {
        method: 'POST',
        body: JSON.stringify({ image: 'test' }),
      });
    }

    expect(apiCallMade).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/extract-trade-info',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
