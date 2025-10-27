import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Flame, RefreshCw } from 'lucide-react';
import { getWelcomeBackMessage } from '@/utils/streakMessages';

interface WelcomeBackModalProps {
  open: boolean;
  onClose: () => void;
  daysMissed: number;
  streakSaved: boolean;
  currentStreak: number;
  xpAwarded: number;
}

export const WelcomeBackModal = ({
  open,
  onClose,
  daysMissed,
  streakSaved,
  currentStreak,
  xpAwarded
}: WelcomeBackModalProps) => {
  const message = getWelcomeBackMessage(daysMissed, streakSaved, currentStreak);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col items-center gap-6 py-4 text-center"
        >
          {/* Icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: streakSaved ? [0, 5, -5, 0] : [0, 180, 360]
            }}
            transition={{ 
              duration: streakSaved ? 1.5 : 2, 
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {streakSaved ? (
              <Flame className="w-20 h-20 text-orange-500" fill="currentColor" />
            ) : (
              <RefreshCw className="w-20 h-20 text-primary" />
            )}
          </motion.div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">{message.title}</h2>
            <p className="text-lg text-muted-foreground">
              {message.body}
            </p>
          </div>

          {/* XP Display */}
          {xpAwarded > 0 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="w-full p-5 rounded-lg bg-primary/10 border border-primary/20"
            >
              <div className="text-4xl font-bold text-primary mb-1">
                +{xpAwarded} XP
              </div>
              <div className="text-sm text-muted-foreground">
                {streakSaved ? 'Consistency Bonus' : 'Fresh Start Bonus'}
              </div>
            </motion.div>
          )}

          {/* Current Streak Info */}
          {streakSaved && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Your {currentStreak}-day streak is protected</span>
            </div>
          )}

          {/* Action Button */}
          <Button 
            onClick={onClose}
            size="lg"
            className="w-full"
          >
            {streakSaved ? 'Continue Trading' : 'Start Fresh'}
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
