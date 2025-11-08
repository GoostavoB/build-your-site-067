/**
 * CHECKOUT ERROR TRACKING
 * Centralized error tracking for payment flow issues
 * Integrates with PostHog analytics and error monitoring
 */

import { errorTracker } from './errorTracking';
import { analytics } from './analytics';
import posthog from 'posthog-js';

export type CheckoutErrorType = 
  | 'validation_error'
  | 'network_error'
  | 'stripe_error'
  | 'timeout_error'
  | 'abandonment'
  | 'popup_blocked'
  | 'csp_error'
  | 'auth_error'
  | 'unknown_error';

export type CheckoutStep = 
  | 'validation'
  | 'authentication'
  | 'api_call'
  | 'redirect'
  | 'loading'
  | 'completed';

export interface CheckoutErrorContext {
  userId?: string;
  userEmail?: string;
  priceId?: string;
  productType?: string;
  amount?: number;
  step: CheckoutStep;
  errorType: CheckoutErrorType;
  errorMessage: string;
  browserContext?: {
    isIframe: boolean;
    userAgent: string;
    viewport: string;
  };
  performance?: {
    timeToError?: number;
    attemptNumber?: number;
  };
  [key: string]: any;
}

class CheckoutErrorTracker {
  /**
   * Track checkout error with full context
   */
  trackCheckoutError(context: CheckoutErrorContext) {
    console.error('🔴 Checkout Error:', context);

    // Track with errorTracker
    errorTracker.captureError(
      new Error(`[${context.errorType}] ${context.errorMessage}`),
      {
        page: 'checkout',
        action: 'checkout_error',
        ...context,
      }
    );

    // Track with PostHog
    if (posthog) {
      posthog.capture('checkout_error', {
        error_type: context.errorType,
        error_message: context.errorMessage,
        product_type: context.productType,
        price_id: context.priceId,
        step: context.step,
        user_id: context.userId,
        time_to_error: context.performance?.timeToError,
        attempt_number: context.performance?.attemptNumber,
        is_iframe: context.browserContext?.isIframe,
        event_category: 'conversion',
      });
    }

    // Track with analytics
    analytics.track('checkout_error', {
      error_type: context.errorType,
      error_message: context.errorMessage,
      product_type: context.productType,
      step: context.step,
    });
  }

  /**
   * Track checkout abandonment
   */
  trackCheckoutAbandonment(lastStep: CheckoutStep, context: Partial<CheckoutErrorContext>) {
    console.warn('⚠️ Checkout Abandoned:', { lastStep, ...context });

    if (posthog) {
      posthog.capture('checkout_abandoned', {
        last_step: lastStep,
        product_type: context.productType,
        price_id: context.priceId,
        time_on_page: context.performance?.timeToError,
        event_category: 'conversion',
      });
    }

    analytics.track('checkout_abandoned', {
      last_step: lastStep,
      product_type: context.productType,
    });
  }

  /**
   * Track checkout timeout
   */
  trackCheckoutTimeout(duration: number, context: Partial<CheckoutErrorContext>) {
    console.error('⏱️ Checkout Timeout:', { duration, ...context });

    if (posthog) {
      posthog.capture('checkout_timeout', {
        duration_seconds: duration,
        product_type: context.productType,
        price_id: context.priceId,
        step: context.step,
        event_category: 'conversion',
      });
    }

    analytics.track('checkout_timeout', {
      duration_seconds: duration,
      product_type: context.productType,
      step: context.step,
    });
  }

  /**
   * Track checkout retry attempt
   */
  trackCheckoutRetry(attemptNumber: number, context: Partial<CheckoutErrorContext>) {
    console.info('🔄 Checkout Retry:', { attemptNumber, ...context });

    if (posthog) {
      posthog.capture('checkout_retry', {
        attempt_number: attemptNumber,
        product_type: context.productType,
        price_id: context.priceId,
        event_category: 'conversion',
      });
    }

    analytics.track('checkout_retry', {
      attempt_number: attemptNumber,
      product_type: context.productType,
    });
  }

  /**
   * Track popup blocked
   */
  trackPopupBlocked(context: Partial<CheckoutErrorContext>) {
    console.warn('🚫 Popup Blocked:', context);

    if (posthog) {
      posthog.capture('checkout_popup_blocked', {
        product_type: context.productType,
        price_id: context.priceId,
        is_iframe: context.browserContext?.isIframe,
        event_category: 'conversion',
      });
    }

    analytics.track('checkout_popup_blocked', {
      product_type: context.productType,
    });
  }

  /**
   * Track validation failure
   */
  trackValidationFailed(validationError: string, context: Partial<CheckoutErrorContext>) {
    console.error('❌ Validation Failed:', { validationError, ...context });

    if (posthog) {
      posthog.capture('checkout_validation_failed', {
        validation_error: validationError,
        product_type: context.productType,
        price_id: context.priceId,
        event_category: 'conversion',
      });
    }

    analytics.track('checkout_validation_failed', {
      validation_error: validationError,
      product_type: context.productType,
    });
  }

  /**
   * Get browser context for error tracking
   */
  getBrowserContext() {
    return {
      isIframe: window.self !== window.top,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    };
  }
}

export const checkoutErrorTracker = new CheckoutErrorTracker();
