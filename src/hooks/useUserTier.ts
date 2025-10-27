import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type UserTier = 'free' | 'basic' | 'pro' | 'elite';

export const useUserTier = () => {
  const { user } = useAuth();
  const [tier, setTier] = useState<UserTier>('free');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Temporary: Grant elite tier to all users
    setTier('elite');
    setIsLoading(false);
  }, [user]);

  const isPro = tier === 'pro' || tier === 'elite';
  const isElite = tier === 'elite';
  const canCustomizeDashboard = isPro || isElite;

  return {
    tier,
    isLoading,
    isPro,
    isElite,
    canCustomizeDashboard,
  };
};
