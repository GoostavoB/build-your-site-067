import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Star, Gift, Zap, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DailyReward } from "@/hooks/useDailyRewards";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

interface DailyRewardModalProps {
  open: boolean;
  onClose: () => void;
  reward: DailyReward;
  onClaim: () => Promise<boolean>;
}

export function DailyRewardModal({ open, onClose, reward, onClaim }: DailyRewardModalProps) {
  const { vibrate } = useHapticFeedback();
  const [isClaiming, setIsClaiming] = useState(false);
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (!isOpen) {
      setIsClaiming(false);
    }
  }, [isOpen]);

  // Don't render if reward is null
  if (!reward) {
    return null;
  }

  const handleClaim = async () => {
    if (isClaiming) return;
    
    console.info('[DailyRewardModal] Claim button clicked');
    setIsClaiming(true);
    vibrate('medium');
    
    const success = await onClaim();
    
    if (success) {
      setTimeout(() => {
        setIsOpen(false);
        onClose();
      }, 500);
    } else {
      setIsClaiming(false);
    }
  };
  
  const handleClose = () => {
    if (!isClaiming) {
      setIsOpen(false);
      onClose();
    }
  };

  const getTierInfo = (tier: number) => {
    switch (tier) {
      case 4:
        return { icon: Trophy, label: "Monthly Milestone", color: "text-yellow-500" };
      case 3:
        return { icon: Star, label: "Bi-Weekly Bonus", color: "text-blue-500" };
      case 2:
        return { icon: Gift, label: "Weekly Reward", color: "text-purple-500" };
      default:
        return { icon: Zap, label: "Daily Reward", color: "text-primary" };
    }
  };

  const tierInfo = getTierInfo(reward.rewardTier);
  const TierIcon = tierInfo.icon;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Daily Login Reward</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Streak Counter */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center gap-2 p-4 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10"
          >
            <Flame className="h-6 w-6 text-orange-500" />
            <span className="text-3xl font-bold">{reward.consecutiveDays}</span>
            <span className="text-xl text-muted-foreground">day streak</span>
          </motion.div>

          {/* Reward Display */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-3">
              <TierIcon className={`h-12 w-12 ${tierInfo.color}`} />
              <div>
                <div className="text-4xl font-bold text-primary">{reward.xpReward} XP</div>
                <Badge variant="secondary" className="mt-2">
                  {tierInfo.label}
                </Badge>
              </div>
            </div>

            {reward.bonusMultiplier > 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  {reward.bonusMultiplier}x Bonus Multiplier
                </Badge>
              </motion.div>
            )}
          </motion.div>

          {/* Milestone Preview */}
          {reward.consecutiveDays < 30 && (
            <div className="space-y-2 text-center text-sm text-muted-foreground">
              <p>Next milestones:</p>
              <div className="flex justify-center gap-2 flex-wrap">
                {reward.consecutiveDays < 7 && (
                  <Badge variant="outline">Day 7: 200 XP</Badge>
                )}
                {reward.consecutiveDays < 14 && (
                  <Badge variant="outline">Day 14: 300 XP</Badge>
                )}
                {reward.consecutiveDays < 30 && (
                  <Badge variant="outline">Day 30: 500 XP</Badge>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <AnimatePresence mode="wait">
            {reward.canClaim ? (
              <motion.div
                key="claim"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  onClick={handleClaim}
                  disabled={isClaiming}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                >
                  {isClaiming ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Claiming...
                    </>
                  ) : (
                    <>
                      <Trophy className="mr-2 h-5 w-5" />
                      Claim Reward
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <Button 
                onClick={handleClose} 
                variant="outline" 
                className="w-full h-14" 
                type="button"
                disabled={isClaiming}
              >
                Close
              </Button>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
