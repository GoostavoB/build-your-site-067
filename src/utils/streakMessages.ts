/**
 * Dynamic messaging system for streak reminders
 * Provides context-aware, motivational messages based on streak status
 */

export interface StreakMessage {
  title: string;
  body: string;
  variant?: 'urgency' | 'reflection' | 'default';
}

/**
 * Get reminder message based on day number and current streak
 */
export const getStreakReminderMessage = (
  dayNumber: number,
  currentStreak: number
): StreakMessage => {
  // Personalize based on streak length
  const streakContext = currentStreak >= 30 
    ? `your impressive ${currentStreak}-day streak`
    : currentStreak >= 14
    ? `your ${currentStreak}-day streak`
    : currentStreak >= 7
    ? `your week-long streak`
    : `your ${currentStreak}-day progress`;
  
  const messages: StreakMessage[] = [
    {
      title: "Streak at Risk",
      body: `You're close to breaking ${streakContext}. Log in now and keep your progress alive.`,
      variant: 'urgency'
    },
    {
      title: "Momentum Matters",
      body: "A quick check-in today keeps your streak moving forward.",
      variant: 'default'
    },
    {
      title: "Consistency Counts",
      body: "You've built consistency. Don't let a small break slow you down.",
      variant: 'reflection'
    },
    {
      title: "Four Days Strong",
      body: "Stay focused — consistency compounds.",
      variant: 'default'
    },
    {
      title: "Building Discipline",
      body: "You're building habits most people quit on. One step today keeps you ahead.",
      variant: 'reflection'
    },
    {
      title: "Almost There",
      body: `${streakContext} shows discipline. Keep it going and earn your next XP bonus.`,
      variant: 'urgency'
    },
    {
      title: "Final Reminder",
      body: "We'll pause reminders for now. Your progress is waiting whenever you're ready to continue.",
      variant: 'reflection'
    }
  ];
  
  // Add special messaging for high-streak users
  if (currentStreak >= 30 && dayNumber <= 3) {
    return {
      title: "30+ Day Streak",
      body: `${currentStreak} days of consistency — that's real discipline. Take 10 seconds today to keep it going.`,
      variant: 'reflection'
    };
  }
  
  const index = Math.min(dayNumber - 1, messages.length - 1);
  return messages[index];
};

/**
 * Get welcome back message when user returns
 */
export const getWelcomeBackMessage = (
  daysMissed: number,
  streakSaved: boolean,
  currentStreak: number
): StreakMessage => {
  if (streakSaved && daysMissed === 1) {
    return {
      title: "Welcome Back",
      body: `Your ${currentStreak}-day streak is safe. +100 XP for staying consistent.`,
      variant: 'default'
    };
  }
  
  if (!streakSaved && daysMissed > 1) {
    return {
      title: "Fresh Start",
      body: `Your previous ${currentStreak}-day streak was impressive. Ready to build an even better one?`,
      variant: 'reflection'
    };
  }
  
  return {
    title: "You're Back",
    body: "Consistency is a practice. Let's keep building.",
    variant: 'default'
  };
};

/**
 * Get re-engagement message after cooldown period
 */
export const getReengagementMessage = (lastStreak: number): StreakMessage => {
  if (lastStreak >= 30) {
    return {
      title: "Your History Speaks",
      body: `You maintained a ${lastStreak}-day streak. That discipline is still in you. Ready to rebuild?`,
      variant: 'reflection'
    };
  }
  
  if (lastStreak >= 7) {
    return {
      title: "Progress Saved",
      body: "Your trading streak history is still here. Ready to start fresh?",
      variant: 'default'
    };
  }
  
  return {
    title: "Let's Build Consistency",
    body: "One login, one trade. Start building your streak today.",
    variant: 'default'
  };
};

/**
 * Get milestone celebration message
 */
export const getMilestoneMessage = (milestone: number): StreakMessage => {
  const messages: Record<number, StreakMessage> = {
    7: {
      title: "Week Warrior",
      body: "Seven days of consistency. You're building real habits.",
      variant: 'default'
    },
    14: {
      title: "Two Week Champion",
      body: "Fourteen days strong. Momentum is on your side.",
      variant: 'default'
    },
    30: {
      title: "Monthly Master",
      body: "Consistency compounds. You're building excellence.",
      variant: 'reflection'
    },
    100: {
      title: "Century Legend",
      body: "100 days of discipline. You've mastered the fundamentals of consistency.",
      variant: 'reflection'
    }
  };
  
  return messages[milestone] || {
    title: "Milestone Reached",
    body: `${milestone} days of dedication. Keep going.`,
    variant: 'default'
  };
};

/**
 * Get combo bonus message
 */
export const getComboBonusMessage = (
  loginStreak: number,
  tradeStreak: number
): StreakMessage => {
  return {
    title: "Combo Streak Bonus!",
    body: `${loginStreak} login days + ${tradeStreak} trade days. You're all in. +500 XP earned.`,
    variant: 'default'
  };
};
