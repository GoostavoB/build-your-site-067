import { memo, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, TrendingUp, TrendingDown, Target } from 'lucide-react';
import type { Trade } from '@/types/trade';
import { formatCurrency, formatPercent } from '@/utils/formatNumber';

interface AIInsightCardProps {
  trades: Trade[];
}

export const AIInsightCard = memo(({ trades }: AIInsightCardProps) => {
  const insight = useMemo(() => {
    if (!trades.length) {
      return {
        title: "Start Trading",
        message: "Upload your first trade to receive personalized AI insights about your trading performance.",
        icon: Target,
        color: "text-primary",
        bg: "bg-primary/5"
      };
    }

    const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const winningTrades = trades.filter(t => (t.pnl || 0) > 0);
    const winRate = (winningTrades.length / trades.length) * 100;
    
    const avgWin = winningTrades.length > 0
      ? winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / winningTrades.length
      : 0;
    
    const losingTrades = trades.filter(t => (t.pnl || 0) <= 0);
    const avgLoss = losingTrades.length > 0
      ? Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / losingTrades.length)
      : 0;

    // Recent trades (last 10)
    const recentTrades = trades.slice(-10);
    const recentPnl = recentTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const recentWins = recentTrades.filter(t => (t.pnl || 0) > 0).length;

    // Generate dynamic insight
    if (totalPnl > 0 && winRate >= 60) {
      return {
        title: "Excellent Performance! 🎯",
        message: `You're up ${formatCurrency(totalPnl)} with a ${formatPercent(winRate)} win rate. Your consistency is paying off—keep following your strategy!`,
        icon: TrendingUp,
        color: "text-neon-green",
        bg: "bg-neon-green/5"
      };
    }
    
    if (recentPnl > 0 && recentWins >= 7) {
      return {
        title: "Hot Streak Detected! 🔥",
        message: `You've won ${recentWins} of your last 10 trades with ${formatCurrency(recentPnl)} profit. Momentum is strong—stay disciplined!`,
        icon: Sparkles,
        color: "text-primary",
        bg: "bg-primary/5"
      };
    }
    
    if (avgWin > avgLoss * 2 && winRate >= 40) {
      return {
        title: "Great Risk Management",
        message: `Your average win (${formatCurrency(avgWin)}) is ${(avgWin / avgLoss).toFixed(1)}x your average loss. You're cutting losses early!`,
        icon: Target,
        color: "text-primary",
        bg: "bg-primary/5"
      };
    }
    
    if (recentPnl < 0) {
      return {
        title: "Take a Break",
        message: `Recent trades are down ${formatCurrency(Math.abs(recentPnl))}. Consider reviewing your strategy and reducing position size temporarily.`,
        icon: TrendingDown,
        color: "text-yellow-500",
        bg: "bg-yellow-500/5"
      };
    }
    
    if (totalPnl < 0) {
      return {
        title: "Review Your Strategy",
        message: `Overall down ${formatCurrency(Math.abs(totalPnl))}. Focus on risk management and consider paper trading your next setup before committing.`,
        icon: TrendingDown,
        color: "text-neon-red",
        bg: "bg-neon-red/5"
      };
    }

    return {
      title: "Keep Building",
      message: `${trades.length} trades logged with ${formatPercent(winRate)} win rate. Consistency matters more than perfection—stay the course!`,
      icon: Target,
      color: "text-primary",
      bg: "bg-primary/5"
    };
  }, [trades]);

  const Icon = insight.icon;

  return (
    <Card className={`p-6 ${insight.bg} border-border/50 hover-lift transition-all duration-300`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex-shrink-0`}>
          <Icon className={`h-6 w-6 ${insight.color}`} />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wide">AI Insight</span>
          </div>
          <h3 className="font-semibold text-base">{insight.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {insight.message}
          </p>
        </div>
      </div>
    </Card>
  );
});

AIInsightCard.displayName = 'AIInsightCard';
