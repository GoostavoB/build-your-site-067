import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        // Show onboarding if not completed
        setShowOnboarding(!data.onboarding_completed);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkOnboarding();
  }, [user]);

  const completeOnboarding = () => {
    setShowOnboarding(false);
  };

  return { showOnboarding, completeOnboarding, loading };
};
