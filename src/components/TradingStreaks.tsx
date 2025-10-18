import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, TrendingUp, TrendingDown } from 'lucide-react';
import type { Trade } from '@/types/trade';

interface TradingStreaksProps {
  trades: Trade[];
}

export const TradingStreaks = ({ trades }: TradingStreaksProps) => {
  if (trades.length === 0) return null;

  // Sort trades by date
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime()
  );

  // Calculate current streak
  let currentStreak = 0;
  let currentStreakType: 'win' | 'loss' | null = null;
  
  for (let i = sortedTrades.length - 1; i >= 0; i--) {
    const trade = sortedTrades[i];
    const isWin = (trade.pnl || 0) > 0;
    
    if (currentStreakType === null) {
      currentStreakType = isWin ? 'win' : 'loss';
      currentStreak = 1;
    } else if ((currentStreakType === 'win' && isWin) || (currentStreakType === 'loss' && !isWin)) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streaks
  let longestWinStreak = 0;
  let currentWinStreak = 0;
  let longestLossStreak = 0;
  let currentLossStreak = 0;

  sortedTrades.forEach(trade => {
    const isWin = (trade.pnl || 0) > 0;
    
    if (isWin) {
      currentWinStreak++;
      currentLossStreak = 0;
      longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
    } else {
      currentLossStreak++;
      currentWinStreak = 0;
      longestLossStreak = Math.max(longestLossStreak, currentLossStreak);
    }
  });

  // Find consecutive trading days
  const tradingDays = new Set(sortedTrades.map(t => 
    new Date(t.trade_date).toDateString()
  ));
  
  const sortedDays = Array.from(tradingDays).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  let consecutiveDays = 1;
  let maxConsecutiveDays = 1;
  
  for (let i = 1; i < sortedDays.length; i++) {
    const prevDate = new Date(sortedDays[i - 1]);
    const currDate = new Date(sortedDays[i]);
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      consecutiveDays++;
      maxConsecutiveDays = Math.max(maxConsecutiveDays, consecutiveDays);
    } else {
      consecutiveDays = 1;
    }
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Flame className="w-5 h-5 text-primary" />
          Trading Streaks
        </h3>
        <p className="text-sm text-muted-foreground">
          Track your winning and losing patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Streak */}
        <Card className={`p-4 ${
          currentStreakType === 'win' 
            ? 'bg-neon-green/10 border-neon-green/30' 
            : 'bg-neon-red/10 border-neon-red/30'
        } border-2`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Current Streak</p>
            {currentStreakType === 'win' ? (
              <TrendingUp className="w-4 h-4 text-neon-green" />
            ) : (
              <TrendingDown className="w-4 h-4 text-neon-red" />
            )}
          </div>
          <div className="flex items-end gap-2">
            <p className={`text-3xl font-bold ${
              currentStreakType === 'win' ? 'text-neon-green' : 'text-neon-red'
            }`}>
              {currentStreak}
            </p>
            <Badge 
              variant="secondary" 
              className={`mb-1 ${
                currentStreakType === 'win' ? 'text-neon-green' : 'text-neon-red'
              }`}
            >
              {currentStreakType === 'win' ? 'Wins' : 'Losses'}
            </Badge>
          </div>
          {currentStreak >= 3 && (
            <p className="text-xs text-muted-foreground mt-2">
              {currentStreakType === 'win' 
                ? '🔥 On fire! Keep the momentum!' 
                : '⚠️ Take a break and review your strategy'}
            </p>
          )}
        </Card>

        {/* Longest Win Streak */}
        <Card className="p-4 bg-gradient-to-br from-neon-green/5 to-transparent border-neon-green/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Best Win Streak</p>
            <TrendingUp className="w-4 h-4 text-neon-green" />
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-neon-green">{longestWinStreak}</p>
            <Badge variant="secondary" className="mb-1 text-neon-green">Wins</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Your best winning streak
          </p>
        </Card>

        {/* Longest Loss Streak */}
        <Card className="p-4 bg-gradient-to-br from-neon-red/5 to-transparent border-neon-red/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Longest Drawdown</p>
            <TrendingDown className="w-4 h-4 text-neon-red" />
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-neon-red">{longestLossStreak}</p>
            <Badge variant="secondary" className="mb-1 text-neon-red">Losses</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Learn from these patterns
          </p>
        </Card>

        {/* Consecutive Trading Days */}
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Consecutive Days</p>
            <Flame className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-primary">{maxConsecutiveDays}</p>
            <Badge variant="secondary" className="mb-1">Days</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Longest active trading streak
          </p>
        </Card>
      </div>
    </Card>
  );
};
