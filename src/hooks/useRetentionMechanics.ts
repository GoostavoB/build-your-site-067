import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useXPSystem } from './useXPSystem';
import { toast } from 'sonner';
import { calculateLoginXP, calculateTradeXP, shouldAwardComboBonus, calculateMilestoneXP } from '@/utils/xpEngine';
import { trackStreakEvents } from '@/utils/analyticsEvents';
import { getWelcomeBackMessage } from '@/utils/streakMessages';

interface StreakData {
  loginStreak: number;
  tradeStreak: number;
  dailyStreak: number; // Legacy compatibility
  weeklyStreak: number;
  lastActiveDate: string;
  lastLoginDate: string;
  lastTradeDate: string | null;
  freezeTokens: number;
  comboBonusAwardedAt: string | null;
}

export const useRetentionMechanics = () => {
  const { user } = useAuth();
  const { addXP } = useXPSystem();
  const [streakData, setStreakData] = useState<StreakData>({
    loginStreak: 0,
    tradeStreak: 0,
    dailyStreak: 0,
    weeklyStreak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    lastLoginDate: new Date().toISOString().split('T')[0],
    lastTradeDate: null,
    freezeTokens: 0,
    comboBonusAwardedAt: null,
  });
  const [showStreakWarning, setShowStreakWarning] = useState(false);
  const [daysInactive, setDaysInactive] = useState(0);

  useEffect(() => {
    if (!user) return;

    const checkStreakStatus = async () => {
      // Fetch progression data
      const { data: progression } = await supabase
        .from('user_progression')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Fetch freeze tokens
      const { data: freezeInventory } = await supabase
        .from('streak_freeze_inventory')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (progression) {
        const lastActive = new Date(progression.last_active_date);
        const lastLogin = new Date(progression.last_login_date || progression.last_active_date);
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        const loginDaysDiff = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));

        setStreakData({
          loginStreak: progression.login_streak || 0,
          tradeStreak: progression.trade_streak || 0,
          dailyStreak: progression.daily_streak || 0,
          weeklyStreak: progression.weekly_streak || 0,
          lastActiveDate: progression.last_active_date,
          lastLoginDate: progression.last_login_date || progression.last_active_date,
          lastTradeDate: progression.last_trade_date,
          freezeTokens: freezeInventory?.freeze_tokens || 0,
          comboBonusAwardedAt: progression.combo_bonus_awarded_at,
        });

        setDaysInactive(daysDiff);

        // Show warning if streak is at risk
        if (loginDaysDiff === 1 && progression.login_streak > 0) {
          setShowStreakWarning(true);
        }

        // Award comeback bonus and show welcome back message
        if (daysDiff >= 2) {
          const loginXP = calculateLoginXP(1); // Fresh start XP
          await addXP(loginXP, 'comeback_login', 'Welcome back! Fresh start bonus');
          
          const message = getWelcomeBackMessage(daysDiff, daysDiff === 1, progression.login_streak || 0);
          toast.success(message.body, { 
            icon: '🎯',
            duration: 5000 
          });
          
          await trackStreakEvents.loginDay(1); // New streak starts
        }

        // Update login tracking
        if (loginDaysDiff > 0) {
          const newLoginStreak = loginDaysDiff === 1 ? (progression.login_streak || 0) + 1 : 1;
          
          await supabase
            .from('user_progression')
            .update({ 
              last_active_date: today.toISOString().split('T')[0],
              last_login_date: today.toISOString().split('T')[0],
              login_streak: newLoginStreak
            })
            .eq('user_id', user.id);
          
          // Award login XP
          const loginXP = calculateLoginXP(newLoginStreak);
          await addXP(loginXP, 'daily_login', `Day ${newLoginStreak} login`);
          await trackStreakEvents.loginDay(newLoginStreak);
          
          // Check for login milestones
          const milestoneXP = calculateMilestoneXP(newLoginStreak);
          if (milestoneXP > 0) {
            await addXP(milestoneXP, 'streak_milestone', `${newLoginStreak}-day login streak!`);
            await trackStreakEvents.milestoneReached(newLoginStreak, 'login');
            toast.success(`🔥 ${newLoginStreak}-Day Login Streak! +${milestoneXP} XP`, { duration: 4000 });
          }
        }

        // Reset reminder flow on login
        await supabase
          .from('streak_reminder_log')
          .upsert({
            user_id: user.id,
            reminder_count: 0,
            notification_paused: false,
            last_login_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
      } else {
        // Initialize progression for new user
        await supabase
          .from('user_progression')
          .insert({
            user_id: user.id,
            xp: 0,
            level: 1,
            rank: 'rookie_trader',
            daily_streak: 0,
            weekly_streak: 0,
            last_active_date: new Date().toISOString().split('T')[0],
          });
      }
    };

    checkStreakStatus();
  }, [user, addXP]);

  const useFreezeToken = useCallback(async () => {
    if (!user || streakData.freezeTokens <= 0) return;

    const { error } = await supabase
      .from('streak_freeze_inventory')
      .update({
        freeze_tokens: streakData.freezeTokens - 1,
        last_used_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (!error) {
      toast.success('Streak freeze activated! Your streak is safe for 24 hours', { icon: '🛡️' });
      setShowStreakWarning(false);
      setStreakData(prev => ({ ...prev, freezeTokens: prev.freezeTokens - 1 }));
      await trackStreakEvents.freezeTokenUsed(Math.max(streakData.loginStreak, streakData.tradeStreak));
    }
  }, [user, streakData]);

  const updateTradeStreak = useCallback(async () => {
    if (!user) return;

    const { data: progression } = await supabase
      .from('user_progression')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!progression) return;

    const lastTrade = progression.last_trade_date ? new Date(progression.last_trade_date) : null;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Don't update if already tracked a trade today
    if (lastTrade && lastTrade.toISOString().split('T')[0] === todayStr) return;

    const daysDiff = lastTrade 
      ? Math.floor((today.getTime() - lastTrade.getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    const oldStreak = progression.trade_streak || 0;
    let newTradeStreak = daysDiff === 1 ? oldStreak + 1 : 1;

    // Track streak break
    if (oldStreak > 0 && daysDiff > 1) {
      await trackStreakEvents.streakBroken(oldStreak, 'trade');
    }

    await supabase
      .from('user_progression')
      .update({
        trade_streak: newTradeStreak,
        last_trade_date: todayStr,
        last_active_date: todayStr,
      })
      .eq('user_id', user.id);

    // Award trade XP
    const tradeXP = calculateTradeXP(newTradeStreak);
    await addXP(tradeXP, 'trade_logged', `Day ${newTradeStreak} trade logged`);
    await trackStreakEvents.tradeDay(newTradeStreak);

    // Check for trade milestones
    const milestoneXP = calculateMilestoneXP(newTradeStreak);
    if (milestoneXP > 0) {
      await addXP(milestoneXP, 'streak_milestone', `${newTradeStreak}-day trade streak!`);
      await trackStreakEvents.milestoneReached(newTradeStreak, 'trade');
      toast.success(`📈 ${newTradeStreak}-Day Trade Streak! +${milestoneXP} XP`, { duration: 4000 });
    }

    // Check for combo bonus
    const loginStreak = progression.login_streak || 0;
    if (shouldAwardComboBonus(loginStreak, newTradeStreak, progression.combo_bonus_awarded_at)) {
      await addXP(500, 'combo_bonus', `Maintained both login and trade streaks for 7+ days!`);
      await supabase
        .from('user_progression')
        .update({ combo_bonus_awarded_at: new Date().toISOString() })
        .eq('user_id', user.id);
      
      await trackStreakEvents.comboBonusAwarded(loginStreak, newTradeStreak);
      toast.success('🎯 Combo Streak Bonus! +500 XP', { duration: 5000 });
    }

    setStreakData(prev => ({
      ...prev,
      tradeStreak: newTradeStreak,
      lastTradeDate: todayStr,
    }));
  }, [user, addXP]);

  // Legacy compatibility - keep updateDailyStreak as alias
  const updateDailyStreak = updateTradeStreak;

  return {
    streakData,
    daysInactive,
    showStreakWarning,
    setShowStreakWarning,
    useFreezeToken,
    updateDailyStreak,
    updateTradeStreak, // Export the new function
  };
};
