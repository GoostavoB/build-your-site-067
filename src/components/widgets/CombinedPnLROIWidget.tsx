import { memo } from 'react';
import { WidgetWrapper } from './WidgetWrapper';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { BlurredCurrency } from '@/components/ui/BlurredValue';

interface CombinedPnLROIWidgetProps {
  id: string;
  isEditMode?: boolean;
  onRemove?: () => void;
  avgPnLPerTrade: number;
  avgROIPerTrade: number;
}

export const CombinedPnLROIWidget = memo(({
  id,
  isEditMode,
  onRemove,
  avgPnLPerTrade,
  avgROIPerTrade,
}: CombinedPnLROIWidgetProps) => {
  const { t } = useTranslation();
  const isPnLPositive = avgPnLPerTrade >= 0;
  const isROIPositive = avgROIPerTrade >= 0;

  return (
    <WidgetWrapper
      id={id}
      title={t('widgets.avgMetrics.title')}
      isEditMode={isEditMode}
      onRemove={onRemove}
    >
      <div className="space-y-4">
        {/* Avg P&L Per Trade */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">{t('widgets.avgPnLPerTrade.title')}</p>
          <div className="flex items-center gap-2">
            <div className={`text-2xl font-bold ${isPnLPositive ? 'text-profit' : 'text-loss'}`}>
              {isPnLPositive ? '' : '-'}
              <BlurredCurrency amount={Math.abs(avgPnLPerTrade)} className="inline" />
            </div>
            {isPnLPositive ? (
              <TrendingUp className="h-4 w-4 text-profit" />
            ) : (
              <TrendingDown className="h-4 w-4 text-loss" />
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Avg ROI Per Trade */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">{t('widgets.avgROIPerTrade.title')}</p>
          <div className="flex items-center gap-2">
            <div className={`text-2xl font-bold ${isROIPositive ? 'text-profit' : 'text-loss'}`}>
              {isROIPositive ? '' : '-'}
              {Math.abs(avgROIPerTrade).toFixed(2)}%
            </div>
            {isROIPositive ? (
              <TrendingUp className="h-4 w-4 text-profit" />
            ) : (
              <TrendingDown className="h-4 w-4 text-loss" />
            )}
          </div>
        </div>
      </div>
    </WidgetWrapper>
  );
});

CombinedPnLROIWidget.displayName = 'CombinedPnLROIWidget';
