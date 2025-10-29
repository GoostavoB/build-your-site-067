import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url?: string;
  total_xp: number;
  current_tier: number;
  rank: number;
  is_current_user: boolean;
}

export type LeaderboardTimeframe = 'all_time' | 'monthly' | 'weekly';

export const useLeaderboard = (timeframe: LeaderboardTimeframe = 'all_time', limit: number = 100) => {
  const { user } = useAuth();

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', timeframe, limit],
    queryFn: async () => {
      // Fetch top users based on XP
      const { data: topUsers, error } = await supabase
        .from('user_xp_levels')
        .select('user_id, total_xp_earned, current_level')
        .order('total_xp_earned', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Fetch user profiles for the top users
      const userIds = topUsers.map(u => u.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);

      // Combine data
      const leaderboardData: LeaderboardEntry[] = topUsers.map((entry, index) => {
        const profile = profiles?.find(p => p.id === entry.user_id);
        return {
          user_id: entry.user_id,
          username: profile?.username || 'Anonymous',
          avatar_url: profile?.avatar_url,
          total_xp: entry.total_xp_earned,
          current_tier: entry.current_level,
          rank: index + 1,
          is_current_user: entry.user_id === user?.id,
        };
      });

      return leaderboardData;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const currentUserRank = leaderboard?.find(entry => entry.is_current_user)?.rank;

  return {
    leaderboard: leaderboard || [],
    currentUserRank,
    isLoading,
  };
};
