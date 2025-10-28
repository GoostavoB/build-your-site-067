import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { analytics } from '@/utils/analytics';

interface DailyActivity {
  trades_uploaded: number;
  emotional_logs_created: number;
  journal_entries_created: number;
  challenges_completed: number;
  last_reminder_shown_at: string | null;
  reminder_clicked_count: number;
  widget_interaction_count: number;
  xp_earned_today: number;
}

interface IncompleteActivity {
  type: string;
  name: string;
  current: number;
  target: number;
  xp: number;
  route: string;
}

const ACTIVITY_TARGETS = {
  trades: { target: 5, xpPerAction: 40, route: '/trades/new' },
  emotional_logs: { target: 3, xpPerAction: 18, route: '/psychology' },
  journal: { target: 2, xpPerAction: 55, route: '/journal' },
  challenges: { target: 3, xpPerAction: 100, route: '/challenges' },
};

export const useEngagementReminders = () => {
  const { user } = useAuth();
  const [userTimezone] = useState(() => 
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // Check if first login today (timezone-aware)
  const isFirstLoginToday = (): boolean => {
    const lastLogin = localStorage.getItem('last_login_date');
    const todayLocal = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    
    if (lastLogin !== todayLocal) {
      localStorage.setItem('last_login_date', todayLocal);
      return true;
    }
    return false;
  };

  // Cache control - check sessionStorage first
  const getCachedActivity = () => {
    const cached = sessionStorage.getItem('daily_activity_cache');
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      // Cache valid for 5 minutes
      if (now - timestamp < 5 * 60 * 1000) {
        return data;
      }
    }
    return null;
  };

  // Fetch reminder intensity preference
  const { data: preferences } = useQuery({
    queryKey: ['user-reminder-preferences', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('user_xp_tiers')
        .select('reminder_intensity')
        .eq('user_id', user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch current streak for dynamic messaging
  const { data: streakData } = useQuery({
    queryKey: ['user-streak', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('user_settings')
        .select('current_visit_streak')
        .eq('user_id', user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch daily activity with cache
  const { data: activityData, refetch: refetchActivity } = useQuery<DailyActivity | null>({
    queryKey: ['daily-activity', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const cached = getCachedActivity();
      if (cached) return cached;

      const todayLocal = new Date().toLocaleDateString('en-CA');
      const { data, error } = await supabase
        .from('user_daily_activity')
        .select('*')
        .eq('user_id', user.id)
        .eq('activity_date', todayLocal)
        .maybeSingle();

      if (error) {
        console.error('Error fetching daily activity:', error);
        return null;
      }

      // If no record exists for today, create one
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from('user_daily_activity')
          .insert({
            user_id: user.id,
            activity_date: todayLocal,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating daily activity:', insertError);
          return null;
        }

        // Cache the result
        sessionStorage.setItem('daily_activity_cache', JSON.stringify({
          data: newData,
          timestamp: Date.now()
        }));

        return newData;
      }

      // Cache the result
      sessionStorage.setItem('daily_activity_cache', JSON.stringify({
        data,
        timestamp: Date.now()
      }));

      return data;
    },
    enabled: !!user?.id,
  });

  // Calculate incomplete activities
  const incompleteActivities = useMemo((): IncompleteActivity[] => {
    if (!activityData) return [];

    const activities: IncompleteActivity[] = [];

    if (activityData.trades_uploaded < ACTIVITY_TARGETS.trades.target) {
      activities.push({
        type: 'trades',
        name: 'Upload trades',
        current: activityData.trades_uploaded,
        target: ACTIVITY_TARGETS.trades.target,
        xp: (ACTIVITY_TARGETS.trades.target - activityData.trades_uploaded) * ACTIVITY_TARGETS.trades.xpPerAction,
        route: ACTIVITY_TARGETS.trades.route,
      });
    }

    if (activityData.emotional_logs_created < ACTIVITY_TARGETS.emotional_logs.target) {
      activities.push({
        type: 'emotional_logs',
        name: 'Log emotional state',
        current: activityData.emotional_logs_created,
        target: ACTIVITY_TARGETS.emotional_logs.target,
        xp: (ACTIVITY_TARGETS.emotional_logs.target - activityData.emotional_logs_created) * ACTIVITY_TARGETS.emotional_logs.xpPerAction,
        route: ACTIVITY_TARGETS.emotional_logs.route,
      });
    }

    if (activityData.journal_entries_created < ACTIVITY_TARGETS.journal.target) {
      activities.push({
        type: 'journal',
        name: 'Write journal entry',
        current: activityData.journal_entries_created,
        target: ACTIVITY_TARGETS.journal.target,
        xp: (ACTIVITY_TARGETS.journal.target - activityData.journal_entries_created) * ACTIVITY_TARGETS.journal.xpPerAction,
        route: ACTIVITY_TARGETS.journal.route,
      });
    }

    // Sort by XP potential (highest first)
    return activities.sort((a, b) => b.xp - a.xp);
  }, [activityData]);

  // Get dynamic toast message with streak reference
  const getToastMessage = () => {
    const currentStreak = streakData?.current_visit_streak || 0;
    
    if (currentStreak >= 7 && incompleteActivities.length > 0) {
      return {
        title: `🔥 ${currentStreak}-day streak going strong!`,
        body: `Keep it alive with ${incompleteActivities[0].name.toLowerCase()} (+${incompleteActivities[0].xp} XP)`,
      };
    }

    if (incompleteActivities.length > 0) {
      const totalPotentialXP = incompleteActivities.reduce((sum, a) => sum + a.xp, 0);
      const topTwo = incompleteActivities.slice(0, 2);
      
      return {
        title: '🌟 Welcome back!',
        body: `You're ${totalPotentialXP} XP away from your daily goal!\n\nQuick wins:\n• ${topTwo[0].name} (+${topTwo[0].xp} XP)${topTwo[1] ? `\n• ${topTwo[1].name} (+${topTwo[1].xp} XP)` : ''}`,
      };
    }

    return null;
  };

  // Update last reminder shown timestamp
  const markReminderShown = async () => {
    if (!user?.id || !activityData) return;

    await supabase
      .from('user_daily_activity')
      .update({ 
        last_reminder_shown_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('activity_date', new Date().toLocaleDateString('en-CA'));

    // Clear cache to force refetch
    sessionStorage.removeItem('daily_activity_cache');
    refetchActivity();
  };

  // Track reminder click
  const trackReminderClick = async (activityType: string) => {
    if (!user?.id) return;

    analytics.track('daily_reminder_clicked', {
      target_activity: activityType,
      potential_xp: incompleteActivities.find(a => a.type === activityType)?.xp || 0,
      current_streak: streakData?.current_visit_streak || 0,
    });

    await supabase
      .from('user_daily_activity')
      .update({ 
        reminder_clicked_count: (activityData?.reminder_clicked_count || 0) + 1,
      })
      .eq('user_id', user.id)
      .eq('activity_date', new Date().toLocaleDateString('en-CA'));

    // Clear cache
    sessionStorage.removeItem('daily_activity_cache');
    refetchActivity();
  };

  // Track widget interaction
  const trackWidgetInteraction = async (activityType: string) => {
    if (!user?.id) return;

    const activity = incompleteActivities.find(a => a.type === activityType);

    analytics.track('daily_goal_widget_interacted', {
      activity: activityType,
      current_progress: activity?.current || 0,
      target_progress: activity?.target || 0,
      potential_xp: activity?.xp || 0,
    });

    await supabase
      .from('user_daily_activity')
      .update({ 
        widget_interaction_count: (activityData?.widget_interaction_count || 0) + 1,
      })
      .eq('user_id', user.id)
      .eq('activity_date', new Date().toLocaleDateString('en-CA'));

    // Clear cache
    sessionStorage.removeItem('daily_activity_cache');
  };

  // Clear cache at midnight
  useEffect(() => {
    const checkMidnight = () => {
      const lastCheck = localStorage.getItem('last_midnight_check');
      const today = new Date().toLocaleDateString('en-CA');
      
      if (lastCheck !== today) {
        sessionStorage.removeItem('daily_activity_cache');
        localStorage.setItem('last_midnight_check', today);
      }
    };

    checkMidnight();
    const interval = setInterval(checkMidnight, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return {
    isFirstLoginToday,
    activityData,
    incompleteActivities,
    reminderIntensity: preferences?.reminder_intensity || 'normal',
    currentStreak: streakData?.current_visit_streak || 0,
    userTimezone,
    getToastMessage,
    markReminderShown,
    trackReminderClick,
    trackWidgetInteraction,
    refetchActivity,
  };
};
