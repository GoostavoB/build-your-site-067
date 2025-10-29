import { memo } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock } from 'lucide-react';
import { useXPBoosts } from '@/hooks/useXPBoosts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

export const XPBoostIndicator = memo(() => {
  const { activeBoosts, totalMultiplier, hasActiveBoost } = useXPBoosts();
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (!hasActiveBoost || !activeBoosts[0]) return;

    const updateTimer = () => {
      const expiresAt = new Date(activeBoosts[0].expires_at);
      const now = new Date();
      const diff = expiresAt.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Expired');
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [hasActiveBoost, activeBoosts]);

  if (!hasActiveBoost) return null;

  const boost = activeBoosts[0];
  const activatedAt = new Date(boost.activated_at);
  const expiresAt = new Date(boost.expires_at);
  const totalDuration = expiresAt.getTime() - activatedAt.getTime();
  const elapsed = Date.now() - activatedAt.getTime();
  const progress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-20 right-4 z-50"
    >
      <Badge
        variant="default"
        className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Zap className="w-4 h-4" />
          </motion.div>
          <span className="font-bold">{totalMultiplier}x XP</span>
          <div className="flex items-center gap-1 text-xs">
            <Clock className="w-3 h-3" />
            {timeRemaining}
          </div>
        </div>
        <Progress value={100 - progress} className="h-1 mt-1" />
      </Badge>
    </motion.div>
  );
});

XPBoostIndicator.displayName = 'XPBoostIndicator';
