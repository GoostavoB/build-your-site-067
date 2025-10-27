import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'admin' | 'user';

export interface UserSubscription {
  tier: 'free' | 'basic' | 'pro' | 'elite';
  status: 'active' | 'inactive' | 'trial' | 'cancelled';
  trialEndDate?: string;
}

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Temporary: Grant elite subscription to all users
    if (!user) {
      setRole(null);
      setSubscription(null);
      setLoading(false);
      return;
    }

    setRole('user');
    setSubscription({
      tier: 'elite',
      status: 'active',
      trialEndDate: undefined
    });
    setLoading(false);
  }, [user]);

  const isAdmin = role === 'admin';
  const hasActiveSubscription = subscription?.status === 'active' || 
                                 (subscription?.status === 'trial' && subscription?.trialEndDate);
  const hasAccess = isAdmin || hasActiveSubscription;

  return {
    role,
    subscription,
    loading,
    isAdmin,
    hasActiveSubscription,
    hasAccess
  };
};
