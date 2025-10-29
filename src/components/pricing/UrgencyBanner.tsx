import { Clock, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePromoStatus } from "@/hooks/usePromoStatus";
import { useState, useEffect } from "react";
import { posthog } from "@/lib/posthog";

const UrgencyBanner = () => {
  const promoStatus = usePromoStatus();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('urgency-banner-dismissed');
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('urgency-banner-dismissed', 'true');
    posthog.capture('urgency_banner_dismissed', {
      days_remaining: promoStatus.daysRemaining,
      hours_remaining: promoStatus.hoursRemaining,
    });
  };

  if (dismissed || promoStatus.isLoading || !promoStatus.isActive) return null;

  const formatCountdown = () => {
    if (promoStatus.daysRemaining > 0) {
      const hours = promoStatus.hoursRemaining % 24;
      return `${promoStatus.daysRemaining}d ${hours}h`;
    }
    return `${promoStatus.hoursRemaining}h`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="mb-8 p-4 rounded-xl bg-gradient-to-r from-orange-600/20 via-red-600/20 to-orange-600/20 border-2 border-orange-500/40 relative overflow-hidden shadow-lg"
      >
        {/* Animated background pulse */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-lg hover:bg-orange-500/30 transition-colors z-10"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4 text-orange-400" />
        </button>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-3 text-center pr-8">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Zap className="w-6 h-6 text-orange-400 fill-orange-400" />
            </motion.div>
          </div>
          
          <div>
            <p className="text-sm md:text-base font-bold">
              <span className="text-orange-400">Early Access Ends Soon</span>
              <span className="text-foreground mx-2">•</span>
              <span className="text-green-400">Save up to 20% with annual billing</span>
            </p>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm mt-1">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="font-mono font-bold text-orange-400 text-base">
                {formatCountdown()}
              </span>
              <span className="text-muted-foreground">remaining at launch pricing</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UrgencyBanner;
