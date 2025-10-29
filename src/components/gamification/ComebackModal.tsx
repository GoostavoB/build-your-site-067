import { memo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { PartyPopper, Gift } from 'lucide-react';
import { springIn } from '@/utils/animations';

interface ComebackModalProps {
  open: boolean;
  onClose: () => void;
  xpReward: number;
  daysAway: number;
}

export const ComebackModal = memo(({ open, onClose, xpReward, daysAway }: ComebackModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <motion.div variants={springIn} initial="initial" animate="animate">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                <PartyPopper className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              Welcome Back!
            </DialogTitle>
            <DialogDescription className="text-center space-y-4">
              <p className="text-base">
                We missed you! You've been away for <strong>{daysAway} days</strong>.
              </p>
              <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="w-5 h-5 text-primary" />
                  <span className="text-lg font-bold">Comeback Reward</span>
                </div>
                <p className="text-3xl font-bold text-primary">
                  +{xpReward} XP
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Keep your streak going to earn even more rewards!
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6">
            <Button onClick={onClose} className="w-full" size="lg">
              Let's Go!
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
});

ComebackModal.displayName = 'ComebackModal';
