/**
 * Analytics tracking utilities using PostHog
 */

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, any>) => void;
      identify: (userId: string, properties?: Record<string, any>) => void;
      reset: () => void;
    };
  }
}

export const analytics = {
  trackPageView: (pageName: string, properties?: Record<string, any>) => {
    if (window.posthog) {
      window.posthog.capture('$pageview', {
        page_name: pageName,
        ...properties,
      });
    }
  },

  track: (event: string, properties?: Record<string, any>) => {
    if (window.posthog) {
      window.posthog.capture(event, properties);
    }
  },

  trackCheckoutStarted: (plan: string, interval: string, price: number) => {
    if (window.posthog) {
      window.posthog.capture('checkout_started', {
        plan,
        interval,
        price,
        timestamp: new Date().toISOString(),
      });
    }
  },

  trackCheckoutCompleted: (plan: string, interval: string, price: number, sessionId?: string) => {
    if (window.posthog) {
      window.posthog.capture('checkout_completed', {
        plan,
        interval,
        price,
        session_id: sessionId,
        timestamp: new Date().toISOString(),
      });
    }
  },

  trackCheckoutCancelled: (plan: string, interval: string) => {
    if (window.posthog) {
      window.posthog.capture('checkout_cancelled', {
        plan,
        interval,
        timestamp: new Date().toISOString(),
      });
    }
  },

  trackTradeUploaded: (count: number, method: string) => {
    if (window.posthog) {
      window.posthog.capture('trade_uploaded', {
        count,
        method,
        timestamp: new Date().toISOString(),
      });
    }
  },

  trackFeatureUsed: (featureName: string, properties?: Record<string, any>) => {
    if (window.posthog) {
      window.posthog.capture('feature_used', {
        feature_name: featureName,
        ...properties,
        timestamp: new Date().toISOString(),
      });
    }
  },

  trackXPEarned: (amount: number, source: string) => {
    if (window.posthog) {
      window.posthog.capture('xp_earned', {
        amount,
        source,
        timestamp: new Date().toISOString(),
      });
    }
  },

  trackXPAwarded: (amount: number, source: string, properties?: Record<string, any>) => {
    if (window.posthog) {
      window.posthog.capture('xp_awarded', {
        amount,
        source,
        ...properties,
        timestamp: new Date().toISOString(),
      });
    }
  },

  trackTierUnlocked: (tier: number, properties?: Record<string, any>) => {
    if (window.posthog) {
      window.posthog.capture('tier_unlocked', {
        tier,
        ...properties,
        timestamp: new Date().toISOString(),
      });
    }
  },

  trackTier3PreviewOpened: (properties?: Record<string, any>) => {
    if (window.posthog) {
      window.posthog.capture('tier3_preview_opened', {
        ...properties,
        timestamp: new Date().toISOString(),
      });
    }
  },

  trackDailyXPCapReached: (properties?: Record<string, any>) => {
    if (window.posthog) {
      window.posthog.capture('daily_xp_cap_reached', {
        ...properties,
        timestamp: new Date().toISOString(),
      });
    }
  },

  trackWidgetLocked: (widgetName: string, properties?: Record<string, any>) => {
    if (window.posthog) {
      window.posthog.capture('widget_locked', {
        widget_name: widgetName,
        ...properties,
        timestamp: new Date().toISOString(),
      });
    }
  },

  identify: (userId: string, properties?: Record<string, any>) => {
    if (window.posthog) {
      window.posthog.identify(userId, properties);
    }
  },

  identifyUser: (userId: string, properties?: Record<string, any>) => {
    if (window.posthog) {
      window.posthog.identify(userId, properties);
    }
  },

  reset: () => {
    if (window.posthog) {
      window.posthog.reset();
    }
  },
};
