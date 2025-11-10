import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UpgradeModalProvider } from '@/contexts/UpgradeModalContext';
import { openUpgradeModal } from '@/lib/openUpgradeModal';

// Mock translation hook
vi.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock components
vi.mock('@/components/PremiumPricingCard', () => ({
  PremiumPricingCard: ({ plan }: any) => (
    <div data-testid={`plan-${plan.id}`}>{plan.id}</div>
  ),
}));

describe('UpgradeModal', () => {
  beforeEach(() => {
    // Clear any previous modal state
    vi.clearAllMocks();
  });

  it('should open modal when openUpgradeModal is called', async () => {
    render(
      <UpgradeModalProvider>
        <div>Test Content</div>
      </UpgradeModalProvider>
    );

    // Modal should not be visible initially
    expect(screen.queryByText('Out of AI Credits')).not.toBeInTheDocument();

    // Open the modal
    openUpgradeModal({
      source: 'upload_zero_credits',
      illustration: 'credits',
      title: 'Out of AI Credits',
      message: 'Test message',
    });

    // Modal should now be visible
    await waitFor(() => {
      expect(screen.getByText('Out of AI Credits')).toBeInTheDocument();
    });
  });

  it('should display pricing cards when modal opens', async () => {
    render(
      <UpgradeModalProvider>
        <div>Test Content</div>
      </UpgradeModalProvider>
    );

    openUpgradeModal({
      source: 'feature_lock',
      requiredPlan: 'pro',
    });

    await waitFor(() => {
      expect(screen.getByTestId('plan-basic')).toBeInTheDocument();
      expect(screen.getByTestId('plan-pro')).toBeInTheDocument();
      expect(screen.getByTestId('plan-elite')).toBeInTheDocument();
    });
  });

  it('should fire analytics event on modal view', async () => {
    const mockGtag = vi.fn();
    (window as any).gtag = mockGtag;

    render(
      <UpgradeModalProvider>
        <div>Test Content</div>
      </UpgradeModalProvider>
    );

    openUpgradeModal({
      source: 'upload_zero_credits',
      requiredPlan: 'pro',
    });

    await waitFor(() => {
      expect(mockGtag).toHaveBeenCalledWith('event', 'upgrade_modal_view', {
        source: 'upload_zero_credits',
        required_plan: 'pro',
        timestamp: expect.any(String),
      });
    });
  });

  it('should fire analytics event on modal dismiss', async () => {
    const mockGtag = vi.fn();
    (window as any).gtag = mockGtag;
    const user = userEvent.setup();

    render(
      <UpgradeModalProvider>
        <div>Test Content</div>
      </UpgradeModalProvider>
    );

    openUpgradeModal({
      source: 'feature_lock',
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Find and click the close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(mockGtag).toHaveBeenCalledWith('event', 'upgrade_modal_dismiss', {
        source: 'feature_lock',
        timestamp: expect.any(String),
      });
    });
  });

  it('should use default title and message when not provided', async () => {
    render(
      <UpgradeModalProvider>
        <div>Test Content</div>
      </UpgradeModalProvider>
    );

    openUpgradeModal({
      source: 'upload_zero_credits',
    });

    await waitFor(() => {
      expect(screen.getByText('Out of AI Credits')).toBeInTheDocument();
      expect(
        screen.getByText(
          /You've used your monthly AI budget/i
        )
      ).toBeInTheDocument();
    });
  });

  it('should allow toggling between monthly and annual billing', async () => {
    const user = userEvent.setup();

    render(
      <UpgradeModalProvider>
        <div>Test Content</div>
      </UpgradeModalProvider>
    );

    openUpgradeModal({
      source: 'manual',
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const annualButton = screen.getByRole('button', { name: /annual/i });
    await user.click(annualButton);

    // Verify annual billing is selected (implementation-specific assertion)
    expect(annualButton).toHaveClass(/bg-background/);
  });
});
