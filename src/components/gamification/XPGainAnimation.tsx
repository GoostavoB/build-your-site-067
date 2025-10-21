import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Plus } from 'lucide-react';

interface XPGain {
  id: string;
  amount: number;
  reason: string;
}

interface XPGainAnimationProps {
  xpGains: XPGain[];
}

export const XPGainAnimation = ({ xpGains }: XPGainAnimationProps) => {
  const [visible, setVisible] = useState<XPGain[]>([]);

  useEffect(() => {
    if (xpGains.length === 0) return;

    setVisible(xpGains);
    const timer = setTimeout(() => {
      setVisible([]);
    }, 3000);

    return () => clearTimeout(timer);
  }, [xpGains]);

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {visible.map((gain) => (
          <motion.div
            key={gain.id}
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="glass-strong border border-primary/30 rounded-xl p-3 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 0.5 }}
                className="p-2 rounded-lg bg-primary/20"
              >
                <Zap className="w-5 h-5 text-primary" />
              </motion.div>
              <div>
                <div className="flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-primary" />
                  <span className="text-xl font-bold text-primary">
                    {gain.amount} XP
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{gain.reason}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
