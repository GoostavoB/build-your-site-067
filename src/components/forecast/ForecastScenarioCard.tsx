import { Card } from '@/components/ui/card';
import { TrendingDown, Activity, TrendingUp, LucideIcon } from 'lucide-react';

interface ForecastScenarioCardProps {
  scenario: 'conservative' | 'base' | 'optimistic';
  dailyGrowth: number;
  monthlyGrowth: number;
  yearlyGrowth: number;
  fiveYearGrowth: number;
}

const scenarioConfig: Record<
  'conservative' | 'base' | 'optimistic',
  {
    title: string;
    description: string;
    icon: LucideIcon;
    borderColor: string;
    iconColor: string;
    bgColor: string;
  }
> = {
  conservative: {
    title: 'Conservative Scenario',
    description: 'Accounts for higher volatility and potential drawdowns based on your trading history',
    icon: TrendingDown,
    borderColor: 'border-neon-red/50',
    iconColor: 'text-neon-red',
    bgColor: 'bg-neon-red/5',
  },
  base: {
    title: 'Base Scenario',
    description: 'Reflects your current average performance and consistency',
    icon: Activity,
    borderColor: 'border-blue-500/50',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-500/5',
  },
  optimistic: {
    title: 'Optimistic Scenario',
    description: 'Projects growth with improved consistency and reduced losses',
    icon: TrendingUp,
    borderColor: 'border-neon-green/50',
    iconColor: 'text-neon-green',
    bgColor: 'bg-neon-green/5',
  },
};

export const ForecastScenarioCard = ({
  scenario,
  dailyGrowth,
  monthlyGrowth,
  yearlyGrowth,
  fiveYearGrowth,
}: ForecastScenarioCardProps) => {
  const config = scenarioConfig[scenario];
  const Icon = config.icon;

  const formatGrowth = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    const absValue = Math.abs(value);
    
    // Format large numbers with k, M, B suffixes
    let formattedValue: string;
    if (absValue >= 1000000000) {
      formattedValue = (value / 1000000000).toFixed(2) + 'B';
    } else if (absValue >= 1000000) {
      formattedValue = (value / 1000000).toFixed(2) + 'M';
    } else if (absValue >= 1000) {
      formattedValue = (value / 1000).toFixed(2) + 'k';
    } else {
      formattedValue = value.toFixed(2);
    }
    
    return `${sign}${formattedValue}%`;
  };

  const getGrowthColor = (value: number) => {
    if (value > 0) return 'text-neon-green';
    if (value < 0) return 'text-neon-red';
    return 'text-foreground';
  };

  return (
    <Card className={`p-5 border-2 ${config.borderColor} ${config.bgColor} glass`}>
      <div className="flex items-start gap-3 mb-4">
        <div className={`p-2 rounded-xl bg-background/50`}>
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold mb-1">{config.title}</h3>
          <p className="text-xs text-muted-foreground leading-tight">{config.description}</p>
        </div>
      </div>

      <div className="space-y-2.5 mt-5">
        <div className="flex justify-between items-center gap-3">
          <span className="text-xs text-muted-foreground">Daily Growth</span>
          <span className={`text-base font-bold ${getGrowthColor(dailyGrowth)} break-all text-right`}>
            {formatGrowth(dailyGrowth)}
          </span>
        </div>
        <div className="flex justify-between items-center gap-3">
          <span className="text-xs text-muted-foreground">Monthly Growth</span>
          <span className={`text-base font-bold ${getGrowthColor(monthlyGrowth)} break-all text-right`}>
            {formatGrowth(monthlyGrowth)}
          </span>
        </div>
        <div className="flex justify-between items-center gap-3">
          <span className="text-xs text-muted-foreground">Annual Growth</span>
          <span className={`text-base font-bold ${getGrowthColor(yearlyGrowth)} break-all text-right`}>
            {formatGrowth(yearlyGrowth)}
          </span>
        </div>
        <div className="flex justify-between items-center gap-3 pt-2 border-t border-border/50">
          <span className="text-xs font-medium">5-Year Projection</span>
          <span className={`text-lg font-bold ${getGrowthColor(fiveYearGrowth)} break-all text-right`}>
            {formatGrowth(fiveYearGrowth)}
          </span>
        </div>
      </div>
    </Card>
  );
};
