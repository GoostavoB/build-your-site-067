import { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLeaderboard, LeaderboardTimeframe } from '@/hooks/useLeaderboard';
import { staggerContainer, fadeInUp } from '@/utils/animations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />;
    case 3:
      return <Award className="w-5 h-5 text-orange-600" />;
    default:
      return null;
  }
};

export const LeaderboardCard = memo(() => {
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>('all_time');
  const { leaderboard, currentUserRank, isLoading } = useLeaderboard(timeframe, 50);

  return (
    <Card className="p-6 glass-strong">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Leaderboard</h2>
        </div>
        {currentUserRank && (
          <Badge variant="secondary">
            Your Rank: #{currentUserRank}
          </Badge>
        )}
      </div>

      <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as LeaderboardTimeframe)}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all_time">All Time</TabsTrigger>
          <TabsTrigger value="monthly">This Month</TabsTrigger>
          <TabsTrigger value="weekly">This Week</TabsTrigger>
        </TabsList>

        <TabsContent value={timeframe}>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-2 max-h-[500px] overflow-y-auto"
            >
              {leaderboard.map((entry) => (
                <motion.div
                  key={entry.user_id}
                  variants={fadeInUp}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    entry.is_current_user
                      ? 'bg-primary/10 border border-primary/30'
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-[3rem]">
                    {getRankIcon(entry.rank)}
                    <span className="font-bold text-lg">{entry.rank}</span>
                  </div>

                  <Avatar className="w-10 h-10">
                    <AvatarImage src={entry.avatar_url} />
                    <AvatarFallback>{entry.username[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{entry.username}</p>
                    <p className="text-sm text-muted-foreground">
                      Tier {entry.current_tier}
                    </p>
                  </div>

                  <Badge variant="outline" className="ml-auto">
                    {entry.total_xp.toLocaleString()} XP
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
});

LeaderboardCard.displayName = 'LeaderboardCard';
