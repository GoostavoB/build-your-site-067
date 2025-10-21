import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';

interface XPNotification {
  id: string;
  amount: number;
  reason: string;
  timestamp: number;
}

let notificationQueue: XPNotification[] = [];
let notifyCallback: ((notification: XPNotification) => void) | null = null;

export const addXPNotification = (amount: number, reason: string) => {
  const notification: XPNotification = {
    id: `${Date.now()}-${Math.random()}`,
    amount,
    reason,
    timestamp: Date.now()
  };
  
  notificationQueue.push(notification);
  if (notifyCallback) {
    notifyCallback(notification);
  }
};

export const FloatingXP = () => {
  const [notifications, setNotifications] = useState<XPNotification[]>([]);

  useEffect(() => {
    notifyCallback = (notification) => {
      setNotifications(prev => [...prev, notification]);
      
      // Remove after 3 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 3000);
    };

    // Process any queued notifications
    notificationQueue.forEach(n => notifyCallback?.(n));
    notificationQueue = [];

    return () => {
      notifyCallback = null;
    };
  }, []);

  return (
    <div className="fixed top-20 right-4 z-[100] space-y-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.8 }}
            className="glass-strong border border-primary/30 rounded-xl p-4 shadow-xl backdrop-blur-lg min-w-[250px]"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -15, 15, -15, 0] }}
                transition={{ duration: 0.5 }}
                className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5"
              >
                <Zap className="w-6 h-6 text-primary" fill="currentColor" />
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="text-xl font-bold text-primary"
                  >
                    +{notification.amount}
                  </motion.span>
                  <span className="text-sm font-semibold text-primary">XP</span>
                  <TrendingUp className="w-4 h-4 text-primary ml-auto" />
                </div>
                <p className="text-xs text-muted-foreground leading-tight">
                  {notification.reason}
                </p>
              </div>
            </div>
            
            {/* Progress bar animation */}
            <motion.div
              className="mt-2 h-1 bg-primary/20 rounded-full overflow-hidden"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary-dark"
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 3, ease: 'linear' }}
              />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
