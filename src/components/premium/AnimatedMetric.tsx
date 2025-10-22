import { useEffect, useRef } from 'react';
import CountUp from 'react-countup';

interface AnimatedMetricProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  inView: boolean;
}

export const AnimatedMetric = ({
  value,
  suffix = '',
  prefix = '',
  decimals = 1,
  inView,
}: AnimatedMetricProps) => {
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (inView && !hasAnimated.current) {
      hasAnimated.current = true;
    }
  }, [inView]);

  return (
    <div className="text-5xl md:text-6xl font-bold text-foreground/95 font-mono tabular-nums">
      {inView && (
        <CountUp
          start={0}
          end={value}
          duration={2.5}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
          separator=","
          useEasing={true}
        />
      )}
    </div>
  );
};
