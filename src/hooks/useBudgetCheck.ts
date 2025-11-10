import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

interface BudgetStatus {
  hasCredits: boolean;
  isAdmin: boolean;
  spendCents: number;
  budgetCents: number;
  percentUsed: number;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to check user's AI budget status client-side
 * Used to prevent uploads when credits are exhausted
 */
export const useBudgetCheck = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus>({
    hasCredits: true,
    isAdmin: false,
    spendCents: 0,
    budgetCents: 75, // Default starter budget
    percentUsed: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) {
      setBudgetStatus({
        hasCredits: false,
        isAdmin: false,
        spendCents: 0,
        budgetCents: 0,
        percentUsed: 0,
        loading: false,
        error: 'Not authenticated',
      });
      return;
    }

    // Admins always have credits
    if (isAdmin) {
      setBudgetStatus({
        hasCredits: true,
        isAdmin: true,
        spendCents: 0,
        budgetCents: 999999,
        percentUsed: 0,
        loading: false,
        error: null,
      });
      return;
    }

    fetchBudget();
  }, [user, isAdmin]);

  const fetchBudget = async () => {
    if (!user) return;

    try {
      const monthStart = new Date().toISOString().slice(0, 7) + '-01';

      const { data, error } = await supabase
        .from('user_ai_budget')
        .select('spend_cents, budget_cents')
        .eq('user_id', user.id)
        .eq('month_start', monthStart)
        .single();

      if (error) {
        // No budget row exists, use default starter budget
        setBudgetStatus({
          hasCredits: true,
          isAdmin: false,
          spendCents: 0,
          budgetCents: 75,
          percentUsed: 0,
          loading: false,
          error: null,
        });
        return;
      }

      const percentUsed = (data.spend_cents / data.budget_cents) * 100;
      const hasCredits = percentUsed < 100;

      setBudgetStatus({
        hasCredits,
        isAdmin: false,
        spendCents: data.spend_cents,
        budgetCents: data.budget_cents,
        percentUsed,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error('Error fetching budget:', err);
      setBudgetStatus((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch budget',
      }));
    }
  };

  const refetch = () => {
    setBudgetStatus((prev) => ({ ...prev, loading: true }));
    fetchBudget();
  };

  return {
    ...budgetStatus,
    refetch,
  };
};
