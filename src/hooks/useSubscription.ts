import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type PlanType = 'basic' | 'pro' | 'elite';
type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trial';

interface Subscription {
  id: string;
  plan_type: PlanType;
  status: SubscriptionStatus;
  billing_cycle: 'monthly' | 'annual' | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

interface UseSubscriptionReturn {
  subscription: Subscription | null;
  isLoading: boolean;
  isActive: boolean;
  refetch: () => Promise<void>;
}

export const useSubscription = (): UseSubscriptionReturn => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = async () => {
    // Temporary: Grant elite subscription to all users
    setSubscription({
      id: 'temp-elite',
      plan_type: 'elite',
      status: 'active',
      billing_cycle: 'annual',
      current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      cancel_at_period_end: false,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  const isActive = subscription 
    ? subscription.status === 'active' || 
      (subscription.status === 'trial' && 
       subscription.current_period_end && 
       new Date(subscription.current_period_end) > new Date())
    : false;

  return {
    subscription,
    isLoading,
    isActive,
    refetch: fetchSubscription
  };
};
