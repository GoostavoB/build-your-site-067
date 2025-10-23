import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type PlanType = 'basic' | 'pro' | 'elite';

interface PremiumFeaturesHook {
  currentPlan: PlanType;
  canAccessFeature: (requiredPlan: PlanType) => boolean;
  isFeatureLocked: (requiredPlan: PlanType) => boolean;
  isLoading: boolean;
}

/**
 * Hook to check premium feature access based on user's subscription
 */
export const usePremiumFeatures = (): PremiumFeaturesHook => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<PlanType>('basic');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setCurrentPlan('basic');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('plan_type, status, current_period_end')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching subscription:', error);
          setCurrentPlan('basic');
        } else if (data) {
          // Check if subscription is active
          const isActive = data.status === 'active' || 
            (data.status === 'trial' && data.current_period_end && new Date(data.current_period_end) > new Date());
          
          setCurrentPlan(isActive ? (data.plan_type as PlanType) : 'basic');
        } else {
          setCurrentPlan('basic');
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setCurrentPlan('basic');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  const planHierarchy: Record<PlanType, number> = {
    basic: 1,
    pro: 2,
    elite: 3
  };

  const canAccessFeature = (requiredPlan: PlanType): boolean => {
    return planHierarchy[currentPlan] >= planHierarchy[requiredPlan];
  };

  const isFeatureLocked = (requiredPlan: PlanType): boolean => {
    return !canAccessFeature(requiredPlan);
  };

  return {
    currentPlan,
    canAccessFeature,
    isFeatureLocked,
    isLoading
  };
};
