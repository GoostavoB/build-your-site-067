import { motion } from 'framer-motion';

interface PremiumBillingToggleProps {
  billingCycle: 'monthly' | 'annual';
  onToggle: (cycle: 'monthly' | 'annual') => void;
}

export const PremiumBillingToggle = ({ billingCycle, onToggle }: PremiumBillingToggleProps) => {
  return (
    <div className="flex flex-col items-center gap-3 relative">
      {/* Elegant animated glow connecting badge to Yearly button */}
      <motion.div
        className="absolute -right-8 top-1/2 w-16 h-0.5 pointer-events-none"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ 
          opacity: billingCycle === 'annual' ? 0.6 : 0,
          scaleX: billingCycle === 'annual' ? 1 : 0
        }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{
          background: 'linear-gradient(90deg, hsl(var(--primary) / 0.8), hsl(var(--primary) / 0.2))',
          boxShadow: '0 0 8px hsl(var(--primary) / 0.5), 0 0 16px hsl(var(--primary) / 0.3)',
          transformOrigin: 'left center',
        }}
      />

      {/* Pulsing particles */}
      {billingCycle === 'annual' && (
        <>
          <motion.div
            className="absolute -right-12 top-1/2 w-1.5 h-1.5 rounded-full bg-primary pointer-events-none"
            animate={{
              x: [0, 20, 40],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              boxShadow: '0 0 8px hsl(var(--primary))',
            }}
          />
          <motion.div
            className="absolute -right-12 top-1/2 w-1 h-1 rounded-full bg-primary pointer-events-none"
            animate={{
              x: [0, 20, 40],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            style={{
              boxShadow: '0 0 6px hsl(var(--primary))',
            }}
          />
        </>
      )}

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
          className={`relative z-10 px-6 py-2.5 text-sm font-medium rounded-full transition-all ${
            billingCycle === 'annual'
              ? 'text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <motion.span
            animate={{
              textShadow: billingCycle === 'annual' 
                ? ['0 0 0px transparent', '0 0 8px hsl(var(--primary))', '0 0 0px transparent']
                : '0 0 0px transparent'
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Yearly
          </motion.span>
        </button>
      </div>

      {/* Save badge with glow */}
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ 
          opacity: billingCycle === 'annual' ? 1 : 0.4, 
          y: 0,
        }}
        transition={{ duration: 0.2 }}
        className="relative text-xs font-semibold text-primary"
      >
        <motion.span
          animate={{
            textShadow: billingCycle === 'annual'
              ? ['0 0 0px transparent', '0 0 12px hsl(var(--primary) / 0.6)', '0 0 0px transparent']
              : '0 0 0px transparent'
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          SAVE 20%
        </motion.span>
      </motion.div>
    </div>
  );
};
