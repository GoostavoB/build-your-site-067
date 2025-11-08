import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const COMEBACK_THRESHOLD_DAYS = 7;

export const useComebackRewards = () => {
  const { user } = useAuth();
  const [showComebackModal, setShowComebackModal] = useState(false);
  const [comebackReward, setComebackReward] = useState<{
    xp: number;
    daysAway: number;
  } | null>(null);

  useEffect(() => {
    if (!user) return;

    const checkComebackEligibility = async () => {
      try {
        const { data: settings } = await supabase
          .from('user_settings')
          .select('last_visit_date')
          .eq('user_id', user.id)
          .single();

        if (!settings?.last_visit_date) return;

        const lastVisit = new Date(settings.last_visit_date);
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff >= COMEBACK_THRESHOLD_DAYS) {
          // Calculate comeback reward (50 XP per day away, max 500)
          const xpReward = Math.min(daysDiff * 50, 500);

          // Award XP
          await supabase.rpc('add_xp', {
            user_uuid: user.id,
            xp_amount: xpReward,
          });

          setComebackReward({
            xp: xpReward,
            daysAway: daysDiff,
          });
          setShowComebackModal(true);

          toast.success('Welcome back', {
            description: `You earned ${xpReward} points for returning`,
          });
        }
      } catch (error) {
        console.error('Error checking comeback eligibility:', error);
      }
    };

    checkComebackEligibility();
  }, [user]);

  return {
    showComebackModal,
    setShowComebackModal,
    comebackReward,
  };
};
