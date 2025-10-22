import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useCursorProximity } from '@/hooks/useCursorProximity';
import { useRef, useState, ReactNode } from 'react';
import { AnimatedMetric } from './AnimatedMetric';

interface OutcomeCardProps {
  headline: string;
  subhead: string;
  metric: string;
  metricValue?: number;
  proofPoint: string;
  visual: ReactNode;
  index: number;
}

export const OutcomeCard = ({
  headline,
  subhead,
  metric,
  metricValue,
  proofPoint,
  visual,
  index,
}: OutcomeCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { ref: inViewRef, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const cursorPos = useCursorProximity(cardRef, 120);

  const isEven = index % 2 === 0;
  const angle = isEven ? 4 : -4;
  const parallaxDepth = (index % 3) * 20;

  const setRefs = (element: HTMLDivElement) => {
    cardRef.current = element;
    inViewRef(element);
  };

  return (
    <motion.div
      ref={setRefs}
      initial={{ opacity: 0, y: 60, rotateX: 10 }}
      animate={{
        opacity: inView ? 1 : 0,
        y: inView ? 0 : 60,
        rotateX: inView ? 0 : 10,
      }}
      transition={{
        duration: 0.8,
        delay: 0.15 * (index % 3),
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        transform: inView ? `translateZ(${parallaxDepth}px) rotate(${angle}deg)` : undefined,
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Cursor proximity glow */}
      {cursorPos.isNear && (
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${cursorPos.x * 100}% ${cursorPos.y * 100}%, rgba(255,255,255,0.08), transparent 60%)`,
          }}
          animate={{ opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <motion.div
        className="outcome-card relative p-12 rounded-3xl overflow-hidden"
        animate={{
          rotateY: isHovered ? (isEven ? 2 : -2) : 0,
          rotateX: isHovered ? (isEven ? -1 : 1) : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Layout: 60/40 split */}
        <div className={`flex ${isEven ? 'flex-row' : 'flex-row-reverse'} items-center gap-12`}>
          {/* Text side */}
          <div className="flex-[0.6] space-y-6">
            <motion.h3
              className="gradient-text text-5xl md:text-6xl font-display font-bold leading-[0.95] tracking-[-0.02em]"
              initial={{ opacity: 0, x: isEven ? -20 : 20 }}
              animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : (isEven ? -20 : 20) }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
            >
              {headline}
            </motion.h3>

            <motion.p
              className="text-sm text-muted-foreground leading-relaxed tracking-wide max-w-[48ch]"
              initial={{ opacity: 0 }}
              animate={{ opacity: inView ? 1 : 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
            >
              {subhead}
            </motion.p>

            {/* Metric */}
            <motion.div
              className="pt-6 border-t border-white/[0.06]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
            >
              {metricValue !== undefined ? (
                <AnimatedMetric value={metricValue} suffix={metric.split(' ').pop() || ''} inView={inView} />
              ) : (
                <div className="text-4xl font-bold text-foreground/90 font-mono tabular-nums">
                  {metric}
                </div>
              )}
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest mt-3">
                {proofPoint}
              </p>
            </motion.div>
          </div>

          {/* Visual side */}
          <motion.div
            className="flex-[0.4]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: inView ? 1 : 0,
              scale: inView ? 1 : 0.9,
            }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
          >
            <motion.div
              animate={{
                y: isHovered ? -8 : 0,
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="relative"
              style={{
                transform: `translateZ(${parallaxDepth + 20}px)`,
              }}
            >
              {visual}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
