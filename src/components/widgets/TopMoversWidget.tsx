import { memo } from 'react';
import { TopMoversCard } from '@/components/TopMoversCard';
import { WidgetProps } from '@/types/widget';
import { Trade } from '@/types/trade';

interface TopMoversWidgetProps extends WidgetProps {
  trades: Trade[];
}

export const TopMoversWidget = memo(({
  id,
  isEditMode,
  onRemove,
  trades,
}: TopMoversWidgetProps) => {
  return (
    <div className="h-full">
      <TopMoversCard trades={trades} />
    </div>
  );
});

TopMoversWidget.displayName = 'TopMoversWidget';
