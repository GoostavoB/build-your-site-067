import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ThemeUnlockBadgeProps {
  count: number;
  className?: string;
}

export const ThemeUnlockBadge = ({ count, className }: ThemeUnlockBadgeProps) => {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    if (count > 0) {
      setPulse(true);
    } else {
      setPulse(false);
    }
  }, [count]);

  if (count === 0) return null;

  return (
    <Badge 
      variant="destructive" 
      className={cn(
        "absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold",
        pulse && "animate-pulse",
        className
      )}
    >
      {count}
    </Badge>
  );
};
