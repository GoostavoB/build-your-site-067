import { useState } from 'react';
import { X, Zap, TrendingUp, Heart, BookOpen, Trophy, Award, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useEngagementReminders } from '@/hooks/useEngagementReminders';
import { motion, AnimatePresence } from 'framer-motion';

const ACTIVITY_CONFIG = {
  trades: {
    icon: TrendingUp,
    label: 'Trades',
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-blue-600/10',
    route: '/trades/new',
  },
  emotional_logs: {
    icon: Heart,
    label: 'Emotional Check-ins',
    color: 'text-pink-400',
    gradient: 'from-pink-500/20 to-pink-600/10',
    route: '/psychology',
  },
  journal: {
    icon: BookOpen,
    label: 'Journal Entries',
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-purple-600/10',
    route: '/journal',
  },
  challenges: {
    icon: Trophy,
    label: 'Daily Challenges',
    color: 'text-amber-400',
    gradient: 'from-amber-500/20 to-amber-600/10',
    route: '/challenges',
  },
};

interface ProgressPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProgressPanel({ isOpen, onClose }: ProgressPanelProps) {
  const navigate = useNavigate();
  const { activityData, trackWidgetInteraction } = useEngagementReminders();

  // Show empty state if no data
  const activities = activityData ? [
    {
      type: 'trades' as const,
      current: activityData.trades_uploaded,
      target: 5,
      xpPerAction: 40,
    },
    {
      type: 'emotional_logs' as const,
      current: activityData.emotional_logs_created,
      target: 3,
      xpPerAction: 18,
    },
    {
      type: 'journal' as const,
      current: activityData.journal_entries_created,
      target: 2,
      xpPerAction: 55,
    },
    {
      type: 'challenges' as const,
      current: activityData.challenges_completed,
      target: 3,
      xpPerAction: 100,
    },
  ] : [
    { type: 'trades' as const, current: 0, target: 5, xpPerAction: 40 },
    { type: 'emotional_logs' as const, current: 0, target: 3, xpPerAction: 18 },
    { type: 'journal' as const, current: 0, target: 2, xpPerAction: 55 },
    { type: 'challenges' as const, current: 0, target: 3, xpPerAction: 100 },
  ];

  const totalEarned = activities.reduce((sum, a) => {
    const earned = Math.min(a.current, a.target) * a.xpPerAction;
    return sum + earned;
  }, 0);

  const totalPossible = activities.reduce((sum, a) => sum + (a.target * a.xpPerAction), 0);
  const progressPercent = (totalEarned / totalPossible) * 100;
  const completedCount = activities.filter(a => a.current >= a.target).length;

  const handleActivityClick = (type: string, route: string) => {
    trackWidgetInteraction(type);
    navigate(route);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-80 bg-background border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10">
                    <Zap className="h-5 w-5 text-amber-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">Progress</h2>
                    <p className="text-xs text-muted-foreground">Daily Activity Tracker</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                  aria-label="Close progress panel"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Goals</span>
                  </div>
                  <p className="text-2xl font-bold tracking-tight">{completedCount}/{activities.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="h-4 w-4 text-emerald-400" strokeWidth={1.5} />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">XP</span>
                  </div>
                  <p className="text-2xl font-bold tracking-tight">{totalEarned}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Daily Goals */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Daily Goals</h3>
                <div className="space-y-3">
                  {activities.map((activity) => {
                    const config = ACTIVITY_CONFIG[activity.type as keyof typeof ACTIVITY_CONFIG];
                    const Icon = config.icon;
                    const earnedXP = Math.min(activity.current, activity.target) * activity.xpPerAction;
                    const maxXP = activity.target * activity.xpPerAction;
                    const isComplete = activity.current >= activity.target;
                    const progress = Math.min((activity.current / activity.target) * 100, 100);

                    return (
                      <button
                        key={activity.type}
                        onClick={() => handleActivityClick(activity.type, config.route)}
                        className={cn(
                          "w-full text-left p-4 rounded-lg transition-all duration-200",
                          "hover:scale-[1.02] border border-border/50 backdrop-blur-sm",
                          "bg-gradient-to-br",
                          config.gradient,
                          isComplete && "border-emerald-500/30"
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg bg-background/50")}>
                              <Icon className={cn("h-4 w-4", config.color)} strokeWidth={1.5} />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{config.label}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {activity.current}/{activity.target} completed
                              </p>
                            </div>
                          </div>
                          {isComplete && (
                            <div className="bg-emerald-500/20 p-1.5 rounded-full">
                              <Trophy className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} />
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Progress 
                            value={progress} 
                            className="h-1.5"
                            indicatorClassName={isComplete ? "bg-emerald-500" : "bg-primary"}
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {progress.toFixed(0)}% complete
                            </span>
                            <span className={cn(
                              "text-xs font-mono font-medium",
                              isComplete ? "text-emerald-400" : config.color
                            )}>
                              {earnedXP} / {maxXP} XP
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Total Progress */}
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Total Progress</h3>
                  <span className="text-lg font-bold font-mono">{progressPercent.toFixed(0)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2 mb-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{totalEarned} XP earned</span>
                  <span>{totalPossible - totalEarned} XP remaining</span>
                </div>
              </div>

              {/* Motivation Message */}
              {completedCount === activities.length ? (
                <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-emerald-500/20">
                      <Trophy className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-emerald-400 mb-1">All Goals Complete!</p>
                      <p className="text-xs text-muted-foreground">
                        Outstanding work! You've maximized your daily XP.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-xs text-muted-foreground text-center">
                    Complete all goals to maximize your daily XP and unlock achievements.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
