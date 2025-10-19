import { useMemo } from 'react';
import type { Trade } from '@/types/trade';

/**
 * Optimized hook to calculate dashboard statistics with memoization
 * Prevents unnecessary recalculations on re-renders
 */
export const useDashboardStats = (trades: Trade[]) => {
  const stats = useMemo(() => {
    if (!trades || trades.length === 0) {
      return {
        totalTrades: 0,
        totalPnL: 0,
        winningTrades: [],
        losingTrades: [],
        winRate: 0,
        avgWin: 0,
        avgLoss: 0,
        profitFactor: 0,
        bestTrade: null,
        worstTrade: null,
        avgRoi: 0,
      };
    }

    const winningTrades = trades.filter(t => (t.pnl || 0) > 0);
    const losingTrades = trades.filter(t => (t.pnl || 0) <= 0);
    
    const totalPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    
    const avgWin = winningTrades.length > 0
      ? winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / winningTrades.length
      : 0;
    
    const avgLoss = losingTrades.length > 0
      ? Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / losingTrades.length)
      : 0;
    
    const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;
    const winRate = (winningTrades.length / trades.length) * 100;
    
    const avgRoi = trades.reduce((sum, t) => sum + (t.roi || 0), 0) / trades.length;
    
    const bestTrade = trades.reduce((best, t) => 
      (t.pnl || 0) > (best.pnl || 0) ? t : best
    , trades[0]);
    
    const worstTrade = trades.reduce((worst, t) => 
      (t.pnl || 0) < (worst.pnl || 0) ? t : worst
    , trades[0]);

    return {
      totalTrades: trades.length,
      totalPnL,
      winningTrades,
      losingTrades,
      winRate,
      avgWin,
      avgLoss,
      profitFactor,
      bestTrade,
      worstTrade,
      avgRoi,
    };
  }, [trades]);

  return stats;
};
