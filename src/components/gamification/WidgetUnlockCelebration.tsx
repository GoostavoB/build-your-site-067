import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { WIDGET_CATALOG } from '@/config/widgetCatalog';
import { LucideIcon } from 'lucide-react';

interface WidgetUnlockCelebrationProps {
  widgetId: string;
  xpAwarded: number;
  isVisible: boolean;
  onComplete: () => void;
  onTryWidget?: () => void;
}

export function WidgetUnlockCelebration({ 
  widgetId, 
  xpAwarded, 
  isVisible, 
  onComplete,
  onTryWidget 
}: WidgetUnlockCelebrationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const widget = WIDGET_CATALOG[widgetId];

  // Simplified effect without confetti
  useState(() => {
    if (isVisible && widget) {
      setTimeout(() => setShowDetails(true), 400);
    }
  });

  if (!widget) return null;

  const Icon: LucideIcon = widget.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", duration: 0.7 }}
            className="relative max-w-lg mx-4 w-full"
          >
            {/* Main card */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/50 rounded-3xl p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
              
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
              
              {/* Content */}
              <div className="relative z-10 space-y-6">
                {/* Icon with animated glow */}
                <div className="relative mx-auto w-20 h-20">
                  <div className="w-20 h-20 mx-auto rounded-xl bg-primary/10 border-2 border-primary flex items-center justify-center">
                    <Icon className="w-10 h-10 text-primary" strokeWidth={2} />
                  </div>
                </div>

                {/* Unlock announcement */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <div className="text-xl font-semibold text-foreground">
                    Feature Unlocked
                  </div>
                  
                  <h3 className="text-2xl font-bold text-primary">
                    {widget.title}
                  </h3>
                  
                  {/* XP Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="inline-block px-4 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-semibold"
                  >
                    {xpAwarded} Points Milestone
                  </motion.div>
                </motion.div>

                {/* Widget details */}
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4 space-y-2 border border-primary/20">
                        <p className="text-muted-foreground">
                          {widget.description}
                        </p>
                        {widget.educationalPurpose && (
                          <div className="pt-2 border-t border-border/50">
                            <p className="text-sm text-primary font-medium">
                              💡 {widget.educationalPurpose}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={onComplete}
                          variant="outline"
                          className="flex-1"
                        >
                          Continue
                        </Button>
                        {onTryWidget && (
                          <Button
                            onClick={onTryWidget}
                            className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                          >
                            Try It Now →
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Floating particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{ 
                    x: Math.cos(i * 45 * Math.PI / 180) * 120,
                    y: Math.sin(i * 45 * Math.PI / 180) * 120,
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.15
                  }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-500/60 rounded-full blur-sm"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
