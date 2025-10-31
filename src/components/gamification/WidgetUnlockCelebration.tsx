import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
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

  useEffect(() => {
    if (isVisible && widget) {
      // Golden confetti for widget unlocks
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { 
        startVelocity: 30, 
        spread: 360, 
        ticks: 60, 
        zIndex: 100,
        colors: ['#FFD700', '#FFA500', '#FF6B35', '#FFED4E']
      };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      // Show details after initial animation
      setTimeout(() => setShowDetails(true), 600);

      return () => clearInterval(interval);
    }
  }, [isVisible, widget]);

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
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-orange-500/10 animate-pulse" />
              
              {/* Content */}
              <div className="relative z-10 space-y-6">
                {/* Icon with animated glow */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative mx-auto w-24 h-24"
                >
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-yellow-500/30 via-orange-500/30 to-primary/30 flex items-center justify-center relative shadow-xl">
                    <Icon className="w-12 h-12 text-yellow-500 drop-shadow-lg" strokeWidth={2} />
                    
                    {/* Rotating glow effect */}
                    <motion.div
                      animate={{ 
                        rotate: 360,
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background: 'linear-gradient(45deg, transparent, rgba(255, 215, 0, 0.3), transparent)',
                      }}
                    />
                  </div>
                  
                  {/* Pulsing outer glow */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.6, 0.2, 0.6]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500/40 to-orange-500/40 blur-2xl -z-10"
                  />
                </motion.div>

                {/* Unlock announcement */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <div className="text-4xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
                    🎉 Widget Unlocked!
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground">
                    {widget.title}
                  </h3>
                  
                  {/* XP Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 text-sm font-bold"
                  >
                    {xpAwarded} XP Milestone Reached
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
