import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Zap, Crown } from 'lucide-react';
import { getMilestoneMessage } from '@/utils/streakMessages';
import { cn } from '@/lib/utils';

interface MilestoneCelebrationProps {
  open: boolean;
  onClose: () => void;
  milestone: number;
  xpAwarded: number;
}

export const MilestoneCelebration = ({
  open,
  onClose,
  milestone,
  xpAwarded
}: MilestoneCelebrationProps) => {
  const message = getMilestoneMessage(milestone);
  
  const getIcon = () => {
    if (milestone >= 100) return Crown;
    if (milestone >= 30) return Trophy;
    if (milestone >= 14) return Star;
    return Zap;
  };
  
  const getGradient = () => {
    if (milestone >= 100) return 'from-purple-600 via-pink-500 to-purple-600';
    if (milestone >= 30) return 'from-yellow-500 via-amber-400 to-yellow-500';
    if (milestone >= 14) return 'from-blue-500 via-cyan-400 to-blue-500';
    return 'from-orange-500 via-red-400 to-orange-500';
  };
  
  const Icon = getIcon();
  const gradient = getGradient();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-0 bg-gradient-to-br from-card/95 to-background/95 backdrop-blur">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center gap-6 py-6 text-center"
        >
          {/* Animated Icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="relative"
          >
            <div className={cn(
              'w-24 h-24 rounded-full flex items-center justify-center',
              'bg-gradient-to-br shadow-2xl',
              gradient
            )}>
              <Icon className="w-12 h-12 text-white" />
            </div>
            
            {/* Glow effect */}
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={cn(
                'absolute inset-0 rounded-full blur-xl',
                'bg-gradient-to-br',
                gradient
              )}
            />
          </motion.div>

          {/* Title */}
          <div className="space-y-2">
            <motion.h2 
              className="text-4xl font-bold"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {message.title}
            </motion.h2>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={cn(
                'inline-block px-4 py-1 rounded-full text-sm font-medium',
                'bg-gradient-to-r text-white',
                gradient
              )}
            >
              Day {milestone} Streak
            </motion.div>
          </div>

          {/* Quote */}
          <motion.p 
            className="text-lg text-muted-foreground max-w-sm italic"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            "{message.body}"
          </motion.p>

          {/* XP Display */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="w-full p-6 rounded-xl bg-primary/10 border border-primary/20"
          >
            <div className="text-5xl font-bold text-primary mb-2">
              +{xpAwarded} XP
            </div>
            <div className="text-sm text-muted-foreground">
              Milestone Bonus Earned
            </div>
          </motion.div>

          {/* Continue Button */}
          <Button 
            onClick={onClose}
            size="lg"
            className={cn(
              'w-full font-semibold text-white',
              'bg-gradient-to-r hover:opacity-90 transition-opacity',
              gradient
            )}
          >
            Continue Trading
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
