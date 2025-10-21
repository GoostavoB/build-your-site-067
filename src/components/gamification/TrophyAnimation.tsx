import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TrophyAnimationProps {
  show: boolean;
  size?: 'small' | 'medium' | 'large';
  onComplete?: () => void;
}

export const TrophyAnimation = ({ show, size = 'medium', onComplete }: TrophyAnimationProps) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  const sizeMap = {
    small: 'text-4xl',
    medium: 'text-6xl',
    large: 'text-8xl',
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`${sizeMap[size]} filter drop-shadow-[0_0_30px_rgba(234,179,8,0.8)]`}
        initial={{ scale: 0, rotate: -180, y: 100 }}
        animate={{ 
          scale: [0, 1.3, 0.9, 1.1, 1],
          rotate: [0, 10, -10, 5, 0],
          y: [100, -20, 0, -10, 0]
        }}
        transition={{ 
          duration: 1.5,
          times: [0, 0.3, 0.5, 0.7, 1],
          ease: "easeOut"
        }}
      >
        <motion.span
          animate={{ 
            filter: [
              'drop-shadow(0 0 20px rgba(234,179,8,0.8))',
              'drop-shadow(0 0 40px rgba(234,179,8,1))',
              'drop-shadow(0 0 20px rgba(234,179,8,0.8))',
            ]
          }}
          transition={{ 
            duration: 0.8,
            repeat: 2,
            ease: "easeInOut"
          }}
        >
          🏆
        </motion.span>
      </motion.div>
    </motion.div>
  );
};
