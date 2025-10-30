import { memo } from 'react';
import { WidgetWrapper } from './WidgetWrapper';
import { Calculator } from 'lucide-react';
import { PinButton } from '@/components/widgets/PinButton';
import { usePinnedWidgets } from '@/contexts/PinnedWidgetsContext';
import { LeverageStopWidget } from '@/components/leverage-stop/LeverageStopWidget';

interface LeverageCalculatorWidgetProps {
  id: string;
  isEditMode?: boolean;
  onRemove?: () => void;
}

export const LeverageCalculatorWidget = memo(({
  id,
  isEditMode,
  onRemove,
}: LeverageCalculatorWidgetProps) => {
  const { isPinned, togglePin } = usePinnedWidgets();
  const pinnedId = 'leverageCalculator' as const;

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
      <div className="p-4">
        <LeverageStopWidget />
      </div>
    </WidgetWrapper>
  );
});

LeverageCalculatorWidget.displayName = 'LeverageCalculatorWidget';
