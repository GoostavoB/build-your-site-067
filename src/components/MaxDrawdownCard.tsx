import { memo } from 'react';
import { GlassCard } from "@/components/ui/glass-card";
import { TrendingDown } from "lucide-react";
import { formatPercent, formatCurrency } from "@/utils/formatNumber";
import { ExplainMetricButton } from "@/components/ExplainMetricButton";
import { useAIAssistant } from '@/contexts/AIAssistantContext';

interface MaxDrawdownCardProps {
  value: number;
  percentage: number;
  className?: string;
}

const MaxDrawdownCardComponent = ({ value, percentage, className }: MaxDrawdownCardProps) => {
  const { openWithPrompt } = useAIAssistant();
  
  return (
    <GlassCard 
      hover 
      className={className}
      role="article"
      aria-labelledby="max-drawdown-title"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 id="max-drawdown-title" className="text-sm font-medium text-muted-foreground">
            Max Drawdown
          </h3>
          <div className="flex items-center gap-2">
            <ExplainMetricButton 
              metricName="Max Drawdown"
              metricValue={formatCurrency(value)}
              context={`Percentage of peak: ${formatPercent(percentage)}`}
              onExplain={openWithPrompt}
            />
            <div className="p-2 rounded-xl bg-secondary/10" aria-hidden="true">
              <TrendingDown className="h-4 w-4 text-secondary" />
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <p 
            className="text-3xl font-bold tracking-tight text-secondary"
            aria-label={`Max drawdown value: ${formatCurrency(value)}`}
          >
            {formatCurrency(value)}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatPercent(percentage)} of peak
          </p>
        </div>
      </div>
    </GlassCard>
  );
};

export const MaxDrawdownCard = memo(MaxDrawdownCardComponent);
