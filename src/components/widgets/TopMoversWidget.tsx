import { memo } from 'react';
import { TopMoversCard } from '@/components/TopMoversCard';
import { WidgetWrapper } from './WidgetWrapper';
import { WidgetProps } from '@/types/widget';
import { Trade } from '@/types/trade';
import { PinButton } from '@/components/widgets/PinButton';
import { usePinnedWidgets } from '@/contexts/PinnedWidgetsContext';

interface TopMoversWidgetProps extends WidgetProps {
  trades: Trade[];
}

export const TopMoversWidget = memo(({
  id,
  isEditMode,
  onRemove,
  trades,
}: TopMoversWidgetProps) => {
  const { isPinned, togglePin } = usePinnedWidgets();
  const pinnedId = 'topMovers' as const;

  return (
    <WidgetWrapper
      id={id}
      isEditMode={isEditMode}
      onRemove={onRemove}
      className="h-full p-0"
      headerActions={
        !isEditMode && (
          <PinButton
            isPinned={isPinned(pinnedId)}
            onToggle={() => togglePin(pinnedId)}
          />
        )
      }
    >
      <TopMoversCard trades={trades} className="border-0 bg-transparent" />
    </WidgetWrapper>
  );
});

TopMoversWidget.displayName = 'TopMoversWidget';
