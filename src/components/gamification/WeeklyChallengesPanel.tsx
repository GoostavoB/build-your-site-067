import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useWeeklyChallenges } from '@/hooks/useWeeklyChallenges';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from 'lucide-react';

export const WeeklyChallengesPanel = () => {
  const { challenges, loading } = useWeeklyChallenges();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const completedCount = challenges.filter(c => c.is_completed).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Challenges
            </CardTitle>
            <CardDescription>
              Complete these challenges by Sunday for bonus XP
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {completedCount}/{challenges.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenges.map(challenge => {
          const Icon = challenge.icon;
          const progress = Math.min((challenge.current_progress / challenge.target_value) * 100, 100);

          return (
            <div key={challenge.id} className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{challenge.title}</p>
                      {challenge.is_completed && (
                        <Badge variant="default" className="text-xs">✓</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {challenge.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {challenge.current_progress}/{challenge.target_value}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="ml-2 shrink-0">
                  +{challenge.xp_reward} XP
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
