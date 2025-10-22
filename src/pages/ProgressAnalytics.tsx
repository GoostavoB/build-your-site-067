import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, Trophy, Target, Flame, Star } from 'lucide-react';
import { useXPSystem } from '@/hooks/useXPSystem';
import { useDailyChallenges } from '@/hooks/useDailyChallenges';
import { XPProgressBar } from '@/components/gamification/XPProgressBar';
import { AchievementBadges } from '@/components/AchievementBadges';
import { TradingStreaks } from '@/components/TradingStreaks';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ProgressAnalytics = () => {
  const { xpData, getXPForNextLevel } = useXPSystem();
  const { challenges } = useDailyChallenges();

  const { data: trades = [] } = useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_time', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const completedChallenges = challenges.filter(c => c.isCompleted).length;
  const totalChallenges = challenges.length;
  const challengeProgress = totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Progress & XP</h1>
          <p className="text-muted-foreground">
            Track your trading journey, earn rewards, and level up
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Level</p>
                <p className="text-2xl font-bold">{xpData.currentLevel}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total XP</p>
                <p className="text-2xl font-bold">{xpData.totalXPEarned.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Challenges</p>
                <p className="text-2xl font-bold">{completedChallenges}/{totalChallenges}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">{trades.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Level Progress</h2>
          <XPProgressBar
            currentXP={xpData.currentXP}
            currentLevel={xpData.currentLevel}
            xpForNextLevel={getXPForNextLevel()}
            showDetails={true}
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Today's Challenges</h2>
          <div className="space-y-4">
            {challenges.map((challenge) => {
              const progress = (challenge.progress / challenge.target) * 100;
              return (
                <div key={challenge.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{challenge.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {challenge.progress} / {challenge.target}
                      </p>
                    </div>
                    <Badge variant={challenge.isCompleted ? "default" : "secondary"}>
                      +{challenge.xpReward} XP
                    </Badge>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Trading Streaks</h2>
            <TradingStreaks trades={trades as any[]} />
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Achievement Badges</h2>
            <AchievementBadges trades={trades as any[]} />
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProgressAnalytics;
