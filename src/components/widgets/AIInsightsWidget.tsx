import { memo } from 'react';
import { AIInsightCard } from '@/components/AIInsightCard';
import { WidgetProps } from '@/types/widget';
import { Trade } from '@/types/trade';

interface AIInsightsWidgetProps extends WidgetProps {
  trades: Trade[];
}

export const AIInsightsWidget = memo(({
  id,
  isEditMode,
  onRemove,
  trades,
}: AIInsightsWidgetProps) => {
  return (
    <div className="h-full">
      <AIInsightCard trades={trades} />
    </div>
  );
});

AIInsightsWidget.displayName = 'AIInsightsWidget';
