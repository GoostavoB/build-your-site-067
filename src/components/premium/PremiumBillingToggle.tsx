import { motion } from 'framer-motion';

interface PremiumBillingToggleProps {
  billingCycle: 'monthly' | 'annual';
  onToggle: (cycle: 'monthly' | 'annual') => void;
}

export const PremiumBillingToggle = ({ billingCycle, onToggle }: PremiumBillingToggleProps) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative inline-flex items-center rounded-full bg-card/40 backdrop-blur-sm border border-border/50 p-1.5">
        {/* Sliding indicator */}
        <motion.div
          className="absolute top-1.5 h-[calc(100%-12px)] rounded-full bg-primary"
          initial={false}
          animate={{
            left: billingCycle === 'monthly' ? '6px' : 'calc(50%)',
            width: billingCycle === 'monthly' ? 'calc(50% - 6px)' : 'calc(50% - 6px)',
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
        />

        {/* Monthly button */}
        <button
          onClick={() => onToggle('monthly')}
          className={`relative z-10 px-6 py-2.5 text-sm font-medium rounded-full transition-colors ${
            billingCycle === 'monthly'
              ? 'text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Monthly
        </button>

        {/* Annual button */}
        <button
          onClick={() => onToggle('annual')}
          className={`relative z-10 px-6 py-2.5 text-sm font-medium rounded-full transition-colors ${
            billingCycle === 'annual'
              ? 'text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Yearly
        </button>
      </div>

      {/* Save badge */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: billingCycle === 'annual' ? 1 : 0.4, y: 0 }}
        transition={{ duration: 0.2 }}
        className="text-xs font-medium text-primary"
      >
        SAVE 20%
      </motion.div>
    </div>
  );
};
