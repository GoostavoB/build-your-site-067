import { motion, AnimatePresence } from 'framer-motion';
import { Award, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LevelUpModalProps {
  show: boolean;
  level: number;
  onClose: () => void;
}

export const LevelUpModal = ({ show, level, onClose }: LevelUpModalProps) => {
  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="level-up-title"
            aria-describedby="level-up-description"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative glass-strong rounded-2xl p-8 max-w-md w-full text-center border border-primary/20"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
                onClick={onClose}
                aria-label="Close level up notification"
              >
                <X className="w-4 h-4" />
              </Button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
                className="mx-auto w-20 h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-6"
                role="img"
                aria-label="Achievement icon"
              >
                <Award className="w-10 h-10 text-primary" />
              </motion.div>

              <motion.h2
                id="level-up-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-semibold mb-2 text-foreground"
              >
                Tier {level} Achieved
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
                aria-label={`New tier: ${level}`}
              >
                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-lg bg-primary/5 border border-primary/10">
                  <span className="text-3xl font-bold text-primary">{level}</span>
                </div>
              </motion.div>

              <motion.p
                id="level-up-description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-6 text-sm"
              >
                You've advanced to tier {level}. Continue your progress to unlock additional features.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={onClose}
                  className="w-full"
                  size="lg"
                >
                  Continue Trading
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
