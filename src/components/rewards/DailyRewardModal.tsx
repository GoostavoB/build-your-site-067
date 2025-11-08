import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Gift, Award, Flame, Star, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { modalContent, springIn, staggerContainer, fadeInUp } from '@/utils/animations';
import { DailyReward } from '@/hooks/useDailyRewards';

interface DailyRewardModalProps {
  open: boolean;
  onClose: () => void;
  reward: DailyReward | null;
  onClaim: () => void;
}

export const DailyRewardModal = ({ open, onClose, reward, onClaim }: DailyRewardModalProps) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const { success, warning } = useHapticFeedback();
  
  // Safety mechanism: Reset claiming state if modal closes
  useEffect(() => {
    if (!open) {
      setIsClaiming(false);
    }
  }, [open]);
  
  if (!reward) return null;

  const handleClaim = async () => {
    // Prevent double clicks
    if (isClaiming) return;
    
    try {
      setIsClaiming(true);
      success();
      
      await onClaim();
      success();
    } catch (error) {
      console.error('Error in handleClaim:', error);
      warning();
      // Error toast is already shown by useDailyRewards
    } finally {
      // Always reset claiming state, even on error
      setIsClaiming(false);
    }
  };

  const getTierInfo = (tier: number) => {
    switch (tier) {
      case 4:
        return { icon: TrendingUp, label: 'Premium', color: 'text-primary', bgColor: 'bg-primary/10' };
      case 3:
        return { icon: Star, label: 'Advanced', color: 'text-primary', bgColor: 'bg-primary/10' };
      case 2:
        return { icon: Award, label: 'Standard', color: 'text-primary', bgColor: 'bg-primary/10' };
      default:
        return { icon: Gift, label: 'Basic', color: 'text-primary', bgColor: 'bg-primary/10' };
    }
  };

  const tierInfo = getTierInfo(reward.rewardTier);
  const TierIcon = tierInfo.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[95vw]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl sm:text-2xl font-semibold text-foreground">
            Daily Login Reward
          </DialogTitle>
          <DialogDescription className="sr-only">
            Claim your daily reward for logging in consecutively
          </DialogDescription>
        </DialogHeader>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4 sm:space-y-6 py-4"
        >
          {/* Streak Counter */}
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2">
            <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-primary" aria-hidden="true" />
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-foreground">
                {reward.consecutiveDays}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Day Streak</p>
            </div>
          </motion.div>

          {/* Reward Display */}
          <motion.div
            variants={springIn}
            className={`relative p-4 sm:p-6 rounded-xl ${tierInfo.bgColor} border-2 border-primary/20`}
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className={`${tierInfo.color} bg-primary/10 border-primary/20 px-3 py-1 text-xs sm:text-sm`}>
                {tierInfo.label} Tier
              </Badge>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 mt-2">
              <TierIcon className="w-10 h-10 sm:w-12 sm:h-12 text-primary" aria-hidden="true" />
              
              <div className="text-center">
                <p className="text-4xl sm:text-5xl font-bold text-primary">
                  +{reward.xpReward}
                </p>
                <p className="text-base sm:text-lg font-semibold text-foreground">XP</p>
              </div>

              {reward.bonusMultiplier > 1 && (
                <Badge variant="secondary" className="mt-2">
                  {reward.bonusMultiplier}x Bonus
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Milestone Info */}
          {reward.consecutiveDays % 7 === 0 && (
            <motion.div
              variants={fadeInUp}
              className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10"
            >
              <p className="text-xs sm:text-sm font-semibold text-primary">
                {reward.consecutiveDays === 7 ? 'Weekly' : reward.consecutiveDays === 14 ? 'Bi-weekly' : 'Monthly'} Milestone Bonus
              </p>
            </motion.div>
          )}

          {/* Next Milestone Preview */}
          <motion.div variants={fadeInUp} className="text-center text-xs sm:text-sm text-muted-foreground space-y-1">
            <p>Keep your streak going</p>
            {reward.consecutiveDays < 7 && (
              <p className="font-semibold text-foreground">
                Next milestone: Day 7 (200 points bonus)
              </p>
            )}
            {reward.consecutiveDays >= 7 && reward.consecutiveDays < 14 && (
              <p className="font-semibold text-foreground">
                Next milestone: Day 14 (300 points bonus)
              </p>
            )}
            {reward.consecutiveDays >= 14 && reward.consecutiveDays < 30 && (
              <p className="font-semibold text-foreground">
                Next milestone: Day 30 (500 points bonus)
              </p>
            )}
          </motion.div>

          {/* Claim Button */}
          <AnimatePresence>
            {reward.canClaim && (
              <motion.div variants={fadeInUp}>
                <Button
                  onClick={handleClaim}
                  disabled={isClaiming}
                  className="w-full min-h-[48px] h-12 text-base sm:text-lg font-semibold"
                  size="lg"
                  aria-label="Claim your daily reward"
                >
                  <Gift className="w-5 h-5 mr-2" />
                  {isClaiming ? 'Claiming...' : 'Claim Reward'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {reward.alreadyClaimed && (
            <motion.div variants={fadeInUp} className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Already claimed today. Come back tomorrow for more rewards.
              </p>
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full min-h-[48px]"
              >
                Close
              </Button>
            </motion.div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
