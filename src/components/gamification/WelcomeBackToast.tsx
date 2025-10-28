import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useEngagementReminders } from '@/hooks/useEngagementReminders';
import { analytics } from '@/utils/analytics';

export const WelcomeBackToast = () => {
  const navigate = useNavigate();
  const [hasShownToday, setHasShownToday] = useState(false);
  const {
    isFirstLoginToday,
    activityData,
    incompleteActivities,
    reminderIntensity,
    currentStreak,
    userTimezone,
    getToastMessage,
    markReminderShown,
    trackReminderClick,
  } = useEngagementReminders();

  useEffect(() => {
    const checkAndShowReminder = async () => {
      // Don't show if already shown today
      if (hasShownToday) return;

      // Don't show if user preference is minimal
      if (reminderIntensity === 'minimal') return;

      // Don't show if no activity data yet
      if (!activityData) return;

      // Don't show if all activities complete
      if (incompleteActivities.length === 0) return;

      // Check if this is first login today
      const firstLogin = isFirstLoginToday();
      if (!firstLogin) return;

      // Check if reminder was already shown today via database
      if (activityData.last_reminder_shown_at) {
        const lastShown = new Date(activityData.last_reminder_shown_at);
        const today = new Date();
        const isSameDay = lastShown.toLocaleDateString('en-CA') === today.toLocaleDateString('en-CA');
        
        if (isSameDay) {
          setHasShownToday(true);
          return;
        }
      }

      // Get dynamic message
      const message = getToastMessage();
      if (!message) return;

      // Track in analytics
      analytics.track('daily_reminder_shown', {
        activities_incomplete: incompleteActivities.map(a => a.type),
        potential_xp: incompleteActivities.reduce((sum, a) => sum + a.xp, 0),
        reminder_type: 'login_toast',
        user_timezone: userTimezone,
        current_streak: currentStreak,
      });

      // Show toast
      const topActivity = incompleteActivities[0];
      
      toast(message.title, {
        description: message.body,
        action: {
          label: "Let's Go! 🚀",
          onClick: () => {
            trackReminderClick(topActivity.type);
            navigate(topActivity.route);
          },
        },
        duration: 8000,
        className: 'glass',
      });

      // Mark as shown
      setHasShownToday(true);
      await markReminderShown();
    };

    // Small delay to ensure all data is loaded
    const timer = setTimeout(checkAndShowReminder, 1500);

    return () => clearTimeout(timer);
  }, [
    hasShownToday,
    activityData,
    incompleteActivities,
    reminderIntensity,
    currentStreak,
    userTimezone,
    isFirstLoginToday,
    getToastMessage,
    markReminderShown,
    trackReminderClick,
    navigate,
  ]);

  return null;
};
