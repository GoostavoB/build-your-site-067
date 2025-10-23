import { motion } from 'framer-motion';

interface PremiumBillingToggleProps {
  billingCycle: 'monthly' | 'annual';
  onToggle: (cycle: 'monthly' | 'annual') => void;
}

export const PremiumBillingToggle = ({ billingCycle, onToggle }: PremiumBillingToggleProps) => {
  return (
    <div className="flex flex-col items-center gap-3 relative">
      {/* Hand-drawn arrow pointing from 20% to Yearly */}
      <motion.svg
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ 
          opacity: billingCycle === 'annual' ? 0.8 : 0,
          pathLength: billingCycle === 'annual' ? 1 : 0 
        }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute -right-16 top-8 w-20 h-24 pointer-events-none"
        viewBox="0 0 80 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Curved arrow path with hand-drawn style */}
        <motion.path
          d="M 8 88 Q 15 70, 25 55 T 45 30 Q 50 22, 58 18"
          stroke="hsl(var(--primary))"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{
            filter: 'url(#roughen)',
          }}
        />
        {/* Arrow head */}
        <motion.path
          d="M 58 18 L 52 14 M 58 18 L 54 24"
          stroke="hsl(var(--primary))"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: billingCycle === 'annual' ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        />
        {/* SVG filter for hand-drawn effect */}
        <defs>
          <filter id="roughen">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </motion.svg>

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
