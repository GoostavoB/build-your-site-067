import { useEffect } from 'react';
import { toast } from 'sonner';
import { useGamificationHaptics } from '@/hooks/useGamificationHaptics';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Award, Zap } from 'lucide-react';

interface XPRewardAnimationProps {
  xpAmount: number;
  message: string;
  isVisible: boolean;
  onComplete: () => void;
  type?: 'normal' | 'milestone' | 'unlock' | 'first_upload';
}

export function XPRewardAnimation({ 
  xpAmount, 
  message, 
  isVisible, 
  onComplete,
  type = 'normal'
}: XPRewardAnimationProps) {
  const { onXPGain, onFirstUpload } = useGamificationHaptics();

  useEffect(() => {
    if (isVisible) {
      // First upload celebration
      if (type === 'first_upload') {
        onFirstUpload();
        
        // Show non-blocking toast
        toast.success('First upload complete', {
          description: 'Want to see your stats?',
          action: {
            label: 'View Dashboard',
            onClick: () => window.location.href = '/dashboard'
          },
          duration: 4000,
        });
        
        setTimeout(onComplete, 2000);
        return;
      }

      // Regular XP gains
      onXPGain(xpAmount);

      // Auto-close after delay
      const timer = setTimeout(onComplete, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, type, onComplete, xpAmount, onXPGain, onFirstUpload]);

  const getIcon = () => {
    switch (type) {
      case 'unlock':
        return <Award className="w-10 h-10 text-primary" />;
      case 'milestone':
        return <Zap className="w-10 h-10 text-primary" />;
      default:
        return <Sparkles className="w-10 h-10 text-primary" />;
    }
  };

  // First upload uses toast, so don't render overlay
  if (type === 'first_upload') {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={onComplete}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative max-w-md mx-4"
          >
            {/* Main card */}
            <div className="bg-card border border-primary/20 rounded-xl p-6 shadow-lg text-center space-y-3">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                {getIcon()}
              </div>

              {/* XP Amount */}
              <div className="space-y-1">
                <div className="text-3xl font-bold text-primary">
                  +{xpAmount} Points
                </div>
                
                {/* Earned badge */}
                <div className="inline-block px-3 py-1 rounded-md bg-primary/5 text-primary text-xs font-medium">
                  Points Earned
                </div>
              </div>

              {/* Message */}
              <p className="text-sm text-foreground font-medium">
                {message}
              </p>

              {/* Tap to continue hint */}
              <p className="text-xs text-muted-foreground pt-2">
                Tap anywhere to continue
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
