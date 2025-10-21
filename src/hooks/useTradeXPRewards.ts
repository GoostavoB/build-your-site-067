import { useEffect, useRef } from 'react';
import { useXPSystem } from './useXPSystem';
import type { Trade } from '@/types/trade';
import { addXPNotification } from '@/components/gamification/FloatingXP';

export const useTradeXPRewards = (trades: Trade[]) => {
  const { addXP } = useXPSystem();
  const processedTradesRef = useRef(new Set<string>());
  const lastTradeCountRef = useRef(0);

  useEffect(() => {
    if (!trades || trades.length === 0) return;

    // Only process when new trades are added
    if (trades.length <= lastTradeCountRef.current) {
      lastTradeCountRef.current = trades.length;
      return;
    }

    // Get only the newest trades
    const newTradesCount = trades.length - lastTradeCountRef.current;
    const newTrades = trades.slice(-newTradesCount).filter(
      trade => trade.id && !processedTradesRef.current.has(trade.id)
    );

    if (newTrades.length === 0) {
      lastTradeCountRef.current = trades.length;
      return;
    }

    // Award XP for each new trade
    newTrades.forEach(trade => {
      if (!trade.id) return;
      
      processedTradesRef.current.add(trade.id);
      
      // Base XP for completing a trade (10 XP)
      addXP(10, 'trade_completed', `Traded ${trade.symbol}`);
      addXPNotification(10, `Traded ${trade.symbol}`);

      // Bonus XP for winning trades
      const pnl = trade.pnl || 0;
      if (pnl > 0) {
        // Award XP based on profit (1 XP per $10 profit, max 50 XP)
        const winXP = Math.min(Math.floor(pnl / 10), 50);
        if (winXP > 0) {
          addXP(winXP, 'winning_trade', `Profit: $${pnl.toFixed(2)}`);
          addXPNotification(winXP, `Winning trade: $${pnl.toFixed(2)}`);
        }
      }

      // Bonus XP for excellent ROI (>5%)
      const roi = trade.roi || 0;
      if (roi > 5) {
        addXP(20, 'excellent_roi', `ROI: ${roi.toFixed(1)}%`);
        addXPNotification(20, `Excellent ROI: ${roi.toFixed(1)}%`);
      } else if (roi > 3) {
        addXP(10, 'good_roi', `ROI: ${roi.toFixed(1)}%`);
        addXPNotification(10, `Good ROI: ${roi.toFixed(1)}%`);
      }

      // Bonus for adding detailed notes (5 XP)
      if (trade.notes && trade.notes.length > 50) {
        addXP(5, 'detailed_notes', 'Added detailed trade notes');
      }

      // Bonus for adding screenshot (5 XP)
      if (trade.screenshot_url || trade.image_url) {
        addXP(5, 'trade_screenshot', 'Added trade screenshot');
      }

      // Bonus for proper setup tagging (5 XP)
      if (trade.setup && trade.setup.trim().length > 0) {
        addXP(5, 'setup_tagged', `Setup: ${trade.setup}`);
      }
    });

    lastTradeCountRef.current = trades.length;
  }, [trades, addXP]);
};
