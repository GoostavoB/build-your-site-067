import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronDown, ChevronUp, TrendingUp, Heart, BookOpen, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEngagementReminders } from '@/hooks/useEngagementReminders';

const ACTIVITY_CONFIG = {
  trades: {
    icon: TrendingUp,
    label: 'Trades',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  emotional_logs: {
    icon: Heart,
    label: 'Emotional Check-ins',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  journal: {
    icon: BookOpen,
    label: 'Journal Entries',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  challenges: {
    icon: Trophy,
    label: 'Daily Challenges',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
};

export const DailyGoalsWidget = memo(() => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const { activityData, incompleteActivities, trackWidgetInteraction } = useEngagementReminders();

  if (!activityData) return null;

  const activities = [
    {
      type: 'trades',
      current: activityData.trades_uploaded,
      target: 5,
      xpPerAction: 40,
      route: '/trades/new',
    },
    {
      type: 'emotional_logs',
      current: activityData.emotional_logs_created,
      target: 3,
      xpPerAction: 18,
      route: '/psychology',
    },
    {
      type: 'journal',
      current: activityData.journal_entries_created,
      target: 2,
      xpPerAction: 55,
      route: '/journal',
    },
    {
      type: 'challenges',
      current: activityData.challenges_completed,
      target: 3,
      xpPerAction: 100,
      route: '/challenges',
    },
  ];

  const totalEarned = activities.reduce((sum, a) => {
    const earned = Math.min(a.current, a.target) * a.xpPerAction;
    return sum + earned;
  }, 0);

  const totalPossible = activities.reduce((sum, a) => sum + (a.target * a.xpPerAction), 0);
  const progressPercent = (totalEarned / totalPossible) * 100;

  const handleActivityClick = (type: string, route: string) => {
    trackWidgetInteraction(type);
    navigate(route);
  };

  const getStatusIcon = (current: number, target: number) => {
    if (current >= target) return '✅';
    if (current > 0) return '⚠️';
    return '❌';
  };

  return (
    <Card className="glass border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Daily Goals
          </CardTitle>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isExpanded ? 'Collapse goals' : 'Expand goals'}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-3">
          {activities.map((activity) => {
            const config = ACTIVITY_CONFIG[activity.type as keyof typeof ACTIVITY_CONFIG];
            const Icon = config.icon;
            const earnedXP = Math.min(activity.current, activity.target) * activity.xpPerAction;
            const maxXP = activity.target * activity.xpPerAction;
            const isComplete = activity.current >= activity.target;

            return (
              <button
                key={activity.type}
                onClick={() => handleActivityClick(activity.type, activity.route)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all",
                  "hover:bg-accent/50 hover:scale-[1.02]",
                  "border border-transparent hover:border-primary/20",
                  config.bgColor
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("text-2xl", config.color)}>
                    {getStatusIcon(activity.current, activity.target)}
                  </div>
                  <Icon className={cn("h-5 w-5", config.color)} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{config.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {activity.current}/{activity.target}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn("h-full transition-all", config.color.replace('text-', 'bg-'))}
                          style={{ width: `${Math.min((activity.current / activity.target) * 100, 100)}%` }}
                        />
                      </div>
                      <span className={cn(
                        "text-xs font-mono",
                        isComplete ? 'text-green-500' : config.color
                      )}>
                        {earnedXP}/{maxXP} XP
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          <div className="pt-3 mt-3 border-t border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Total Progress</span>
              <span className="text-sm font-mono">
                {totalEarned}/{totalPossible} XP
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <p className="text-xs text-muted-foreground text-center mt-2">
              {progressPercent.toFixed(0)}% complete
            </p>
          </div>

          {incompleteActivities.length > 0 && (
            <div className="text-xs text-muted-foreground text-center pt-2">
              💡 Complete all goals to maximize your daily XP!
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
});

DailyGoalsWidget.displayName = 'DailyGoalsWidget';
