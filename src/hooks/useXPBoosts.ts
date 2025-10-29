import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface XPBoost {
  id: string;
  user_id: string;
  multiplier: number;
  duration_minutes: number;
  activated_at: string;
  expires_at: string;
  is_active: boolean;
}

export const useXPBoosts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: activeBoosts, isLoading } = useQuery({
    queryKey: ['xp-boosts', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('xp_boosts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString());

      if (error) throw error;
      return data as XPBoost[];
    },
    enabled: !!user,
    refetchInterval: 60000, // Check every minute
  });

  const activateBoost = useMutation({
    mutationFn: async ({ multiplier, duration }: { multiplier: number; duration: number }) => {
      if (!user) throw new Error('User not authenticated');

      const now = new Date();
      const expiresAt = new Date(now.getTime() + duration * 60000);

      const { data, error } = await supabase
        .from('xp_boosts')
        .insert({
          user_id: user.id,
          multiplier,
          duration_minutes: duration,
          activated_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['xp-boosts'] });
      toast.success('XP Boost activated!', {
        description: 'You\'re earning bonus XP now!',
      });
    },
    onError: (error) => {
      toast.error('Failed to activate boost', {
        description: error.message,
      });
    },
  });

  const totalMultiplier = activeBoosts?.reduce((sum, boost) => sum + boost.multiplier, 1) || 1;
  const hasActiveBoost = (activeBoosts?.length || 0) > 0;

  return {
    activeBoosts: activeBoosts || [],
    totalMultiplier,
    hasActiveBoost,
    isLoading,
    activateBoost: activateBoost.mutate,
    isActivating: activateBoost.isPending,
  };
};
