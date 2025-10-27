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
    // Temporary: Grant elite plan to all users
    setCurrentPlan('elite');
    setIsLoading(false);
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
