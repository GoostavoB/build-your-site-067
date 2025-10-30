import { memo, useState, useMemo } from 'react';
import { WidgetWrapper } from './WidgetWrapper';
import { TrendingUp, TrendingDown, Shield, AlertTriangle, Zap } from 'lucide-react';
import { PinButton } from '@/components/widgets/PinButton';
import { usePinnedWidgets } from '@/contexts/PinnedWidgetsContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

  const [entryPrice, setEntryPrice] = useState('50000');
  const [stopPercent, setStopPercent] = useState('1.0');
  const [side, setSide] = useState<'long' | 'short'>('long');

  const result = useMemo(() => {
    const entry = parseFloat(entryPrice) || 0;
    const stopPct = parseFloat(stopPercent) || 0;
    
    if (entry <= 0 || stopPct <= 0) {
      return { maxLeverage: 0, riskLevel: 'Low', liquidationPrice: 0 };
    }

    const bufferB = 0.5;
    const maxLeverage = Math.floor((100 - bufferB) / stopPct);
    const cappedLeverage = Math.min(maxLeverage, 100);
    
    const liquidationPrice = side === 'long' 
      ? entry * (1 - 100 / cappedLeverage / 100)
      : entry * (1 + 100 / cappedLeverage / 100);

    const stopPrice = side === 'long'
      ? entry * (1 - stopPct / 100)
      : entry * (1 + stopPct / 100);
    
    const marginPct = Math.abs(((stopPrice - liquidationPrice) / entry) * 100);
    
    let riskLevel: 'Low' | 'Medium' | 'High';
    if (marginPct > 1.0) riskLevel = 'Low';
    else if (marginPct > 0.5) riskLevel = 'Medium';
    else riskLevel = 'High';

    return {
      maxLeverage: cappedLeverage,
      riskLevel,
      liquidationPrice: liquidationPrice.toFixed(2),
      marginPct: marginPct.toFixed(2)
    };
  }, [entryPrice, stopPercent, side]);

  const getRiskColor = () => {
    switch (result.riskLevel) {
      case 'Low': return 'from-profit/20 to-profit/5 border-profit/30';
      case 'Medium': return 'from-warning/20 to-warning/5 border-warning/30';
      case 'High': return 'from-loss/20 to-loss/5 border-loss/30';
    }
  };

  const getRiskTextColor = () => {
    switch (result.riskLevel) {
      case 'Low': return 'text-profit';
      case 'Medium': return 'text-warning';
      case 'High': return 'text-loss';
    }
  };

  return (
    <WidgetWrapper
      id={id}
      title="Quick Leverage"
      isEditMode={isEditMode}
      onRemove={onRemove}
      headerActions={
        !isEditMode && (
          <PinButton
            isPinned={isPinned(pinnedId)}
            onToggle={() => togglePin(pinnedId)}
          />
        )
      }
    >
      <div className="space-y-4">
        {/* Compact Side Toggle */}
        <div className="flex gap-1.5 p-1 bg-muted/50 rounded-lg">
          <button
            onClick={() => setSide('long')}
            className={cn(
              "flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
              side === 'long' 
                ? "bg-background shadow-sm text-profit" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <TrendingUp className="inline h-3 w-3 mr-1" />
            Long
          </button>
          <button
            onClick={() => setSide('short')}
            className={cn(
              "flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
              side === 'short' 
                ? "bg-background shadow-sm text-loss" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <TrendingDown className="inline h-3 w-3 mr-1" />
            Short
          </button>
        </div>

        {/* Compact Inputs - Side by Side */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="entry" className="text-xs text-muted-foreground">Entry Price</Label>
            <Input
              id="entry"
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              placeholder="50000"
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="stop" className="text-xs text-muted-foreground">Stop Loss %</Label>
            <Input
              id="stop"
              type="number"
              value={stopPercent}
              onChange={(e) => setStopPercent(e.target.value)}
              placeholder="1.0"
              step="0.1"
              className="h-9 text-sm"
            />
          </div>
        </div>

        {/* Compact Result Display */}
        {result.maxLeverage > 0 && (
          <div className={cn(
            "relative overflow-hidden rounded-lg border bg-gradient-to-br p-4 transition-all duration-300 hover:scale-[1.02] animate-fade-in",
            getRiskColor()
          )}>
            {/* Decorative Glow Effect */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            
            <div className="relative space-y-3">
              {/* Max Leverage - Compact Display */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className={cn("h-4 w-4", getRiskTextColor())} />
                  <span className="text-xs font-medium text-muted-foreground">Max Safe Leverage</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={cn("text-3xl font-bold", getRiskTextColor())}>
                    {result.maxLeverage}
                  </span>
                  <span className={cn("text-sm font-semibold", getRiskTextColor())}>x</span>
                </div>
              </div>

              {/* Risk & Details - Inline */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  {result.riskLevel === 'Low' && <Shield className="h-3 w-3 text-profit" />}
                  {result.riskLevel !== 'Low' && <AlertTriangle className="h-3 w-3" />}
                  <span className={cn("font-medium", getRiskTextColor())}>
                    {result.riskLevel} Risk
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {result.marginPct}% margin
                  </span>
                </div>
                <div className="text-muted-foreground">
                  Liq: ${Number(result.liquidationPrice).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </WidgetWrapper>
  );
});

LeverageCalculatorWidget.displayName = 'LeverageCalculatorWidget';
