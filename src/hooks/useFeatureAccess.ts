import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type PlanType = 'basic' | 'pro' | 'elite';

interface FeatureAccess {
  hasFeeAnalysis: boolean;
  connectedAccountsLimit: number;
  currentAccountsCount: number;
  canAddAccount: boolean;
  customMetricsLimit: number;
  customMetricsUsed: number;
  canCreateCustomMetric: boolean;
  planType: PlanType;
  isLoading: boolean;
}

export const useFeatureAccess = () => {
  const { user } = useAuth();
  const [access, setAccess] = useState<FeatureAccess>({
    hasFeeAnalysis: false,
    connectedAccountsLimit: 1,
    currentAccountsCount: 0,
    canAddAccount: true,
    customMetricsLimit: 0,
    customMetricsUsed: 0,
    canCreateCustomMetric: false,
    planType: 'basic',
    isLoading: true,
  });

  const fetchAccess = async () => {
    // Temporary: Grant elite-level access to all users
    let currentCount = 0;
    if (user) {
      try {
        const { count: accountsCount } = await supabase
          .from('connected_accounts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_active', true);
        currentCount = accountsCount || 0;
      } catch (error) {
        console.error('Error fetching accounts count:', error);
      }
    }

    setAccess({
      hasFeeAnalysis: true,
      connectedAccountsLimit: 999,
      currentAccountsCount: currentCount,
      canAddAccount: true,
      customMetricsLimit: 999,
      customMetricsUsed: 0,
      canCreateCustomMetric: true,
      planType: 'elite',
      isLoading: false,
    });
  };

  useEffect(() => {
    fetchAccess();

    // Subscribe to subscription changes
    const channel = supabase
      .channel('subscription-feature-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchAccess();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    ...access,
    refetch: fetchAccess,
  };
};
