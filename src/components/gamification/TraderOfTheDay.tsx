import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Crown, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface TraderOfDayData {
  user_id: string;
  roi: number;
  win_rate: number;
  performance_score: number;
  profile: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export const TraderOfTheDay = () => {
  const [trader, setTrader] = useState<TraderOfDayData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTraderOfDay = async () => {
      try {
        const { data, error } = await supabase
          .from('leaderboard_entries')
          .select(`
            user_id,
            roi,
            win_rate,
            performance_score,
            profiles:user_id (
              username,
              full_name,
              avatar_url
            )
          `)
          .order('performance_score', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;

        if (data) {
          setTrader({
            user_id: data.user_id,
            roi: data.roi,
            win_rate: data.win_rate,
            performance_score: data.performance_score,
            profile: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles,
          });
        }
      } catch (error) {
        console.error('Error fetching trader of the day:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTraderOfDay();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!trader) return null;

  const displayName = trader.profile?.username || trader.profile?.full_name || 'Anonymous';
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <Card className="border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Trader of the Day
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-yellow-500">
            <AvatarImage src={trader.profile?.avatar_url || undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-lg">{displayName}</p>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {trader.roi.toFixed(2)}% ROI
              </Badge>
              <Badge variant="outline">
                {trader.win_rate.toFixed(1)}% Win Rate
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
