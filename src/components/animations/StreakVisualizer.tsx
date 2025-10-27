import { motion } from 'framer-motion';
import { Flame, TrendingUp, LogIn, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getXPMultiplierDescription } from '@/utils/xpEngine';

interface StreakVisualizerProps {
  streakDays: number;
  isAtRisk?: boolean;
  className?: string;
  type?: 'login' | 'trade' | 'combined';
  loginStreak?: number;
  tradeStreak?: number;
  showMultiplier?: boolean;
}

export const StreakVisualizer = ({ 
  streakDays, 
  isAtRisk = false,
  className = '',
  type = 'combined',
  loginStreak = 0,
  tradeStreak = 0,
  showMultiplier = false
}: StreakVisualizerProps) => {
  // Progressive visual design based on streak length
  const getVisualStyle = (days: number) => {
    if (days >= 100) {
      return {
        icon: Zap,
        gradient: 'from-purple-600 via-pink-500 to-purple-600',
        glow: 'shadow-2xl shadow-purple-500/50',
        animation: 'scale-[1.15]',
        label: 'Legendary',
        border: 'border-2 border-purple-500/30'
      };
    }
    if (days >= 30) {
      return {
        icon: Flame,
        gradient: 'from-purple-500 via-blue-500 to-purple-500',
        glow: 'shadow-xl shadow-purple-400/40',
        animation: 'scale-[1.12]',
        label: 'Epic',
        border: 'border-2 border-purple-400/20'
      };
    }
    if (days >= 14) {
      return {
        icon: Flame,
        gradient: 'from-yellow-400 via-orange-400 to-yellow-400',
        glow: 'shadow-lg shadow-yellow-400/30',
        animation: 'scale-[1.08]',
        label: 'Strong',
        border: 'border border-yellow-400/20'
      };
    }
    if (days >= 7) {
      return {
        icon: Flame,
        gradient: 'from-orange-400 via-red-400 to-orange-400',
        glow: 'shadow-md shadow-orange-400/20',
        animation: 'scale-[1.05]',
        label: 'Building',
        border: ''
      };
    }
    return {
      icon: Flame,
      gradient: 'from-red-500 to-orange-500',
      glow: 'shadow-sm shadow-red-400/10',
      animation: 'scale-[1.02]',
      label: 'Starting',
      border: ''
    };
  };

  const style = getVisualStyle(streakDays);
  const Icon = style.icon;

  if (type === 'combined' && loginStreak > 0 && tradeStreak > 0) {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        {/* Login Streak */}
        <div className={cn('flex items-center gap-2 p-3 rounded-lg bg-card/50', getVisualStyle(loginStreak).border)}>
          <motion.div
            animate={{ scale: [1, 1.08, 1], rotate: [-2, 2, -2] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className={getVisualStyle(loginStreak).glow}
          >
            <div className={cn('w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center', getVisualStyle(loginStreak).gradient)}>
              <LogIn className="w-4 h-4 text-white" />
            </div>
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xl font-bold">{loginStreak}</span>
            <span className="text-[10px] text-muted-foreground">Login Days</span>
          </div>
        </div>

        {/* Trade Streak */}
        <div className={cn('flex items-center gap-2 p-3 rounded-lg bg-card/50', getVisualStyle(tradeStreak).border)}>
          <motion.div
            animate={{ scale: [1, 1.08, 1], rotate: [-2, 2, -2] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className={getVisualStyle(tradeStreak).glow}
          >
            <div className={cn('w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center', getVisualStyle(tradeStreak).gradient)}>
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
          </motion.div>
          <div className="flex flex-col">
            <span className="text-xl font-bold">{tradeStreak}</span>
            <span className="text-[10px] text-muted-foreground">Trade Days</span>
          </div>
        </div>

        {/* Combo Badge */}
        {loginStreak >= 7 && tradeStreak >= 7 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold"
          >
            <Zap className="w-3 h-3" />
            Combo
          </motion.div>
        )}

        {/* Multiplier Display */}
        {showMultiplier && (
          <div className="text-xs text-muted-foreground">
            {getXPMultiplierDescription(loginStreak, tradeStreak)}
          </div>
        )}
      </div>
    );
  }

  // Single streak display
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <motion.div
        animate={{
          scale: [1, parseFloat(style.animation.match(/\d+\.\d+/)?.[0] || '1.05'), 1],
          rotate: [-3, 3, -3],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={cn('relative', style.glow)}
      >
        <div className={cn('w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center', style.gradient, style.border)}>
          <Icon className="w-6 h-6 text-white" fill="currentColor" />
        </div>
      </motion.div>

      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <motion.span
            className="text-3xl font-bold"
            animate={isAtRisk ? { 
              color: ['hsl(var(--primary))', 'hsl(var(--destructive))', 'hsl(var(--primary))'] 
            } : {}}
            transition={{ duration: 1, repeat: isAtRisk ? Infinity : 0 }}
          >
            {streakDays}
          </motion.span>
          {streakDays >= 7 && (
            <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', 
              `bg-gradient-to-r ${style.gradient} text-white`
            )}>
              {style.label}
            </span>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {isAtRisk ? 'At Risk!' : 'Day Streak'}
        </span>
      </div>

      {isAtRisk && (
        <motion.div
          className="text-xs font-medium text-destructive"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Log in today!
        </motion.div>
      )}
    </div>
  );
};
