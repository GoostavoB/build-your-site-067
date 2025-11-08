/**
 * CHECKOUT FUNNEL TRACKING
 * Tracks all events in the purchase journey for conversion analysis
 */

import { analytics } from '@/utils/analytics';
import { trackEvent } from '@/utils/analyticsEvents';

export const trackCheckoutFunnel = {
  // Step 1: View pricing page
  viewPricing: () => {
    analytics.track('view_pricing_page');
    trackEvent('view_pricing_page');
  },

  // Step 2: Click on a plan's CTA
  selectPlan: (plan: string, billingCycle: string, price: number) => {
    analytics.track('select_plan_clicked', {
      plan_name: plan,
      billing_cycle: billingCycle,
      plan_price: price,
      event_category: 'conversion'
    });
    trackEvent('select_plan_clicked', { plan, billingCycle, price });
  },

  // Step 3: Initiate checkout (click purchase button)
  initiateCheckout: (productType: string, priceId: string, amount: number) => {
    analytics.track('checkout_initiated', {
      product_type: productType,
      price_id: priceId,
      amount: amount,
      currency: 'USD',
      event_category: 'conversion'
    });
    trackEvent('checkout_initiated', { productType, priceId, amount });
  },

  // Step 4: Stripe checkout page loaded (from success URL)
  checkoutPageLoaded: (sessionId: string) => {
    analytics.track('stripe_checkout_loaded', {
      session_id: sessionId,
      event_category: 'conversion'
    });
  },

  // Step 5: Purchase completed
  checkoutCompleted: (productType: string, amount: number, sessionId?: string) => {
    analytics.track('checkout_completed', {
      product_type: productType,
      amount: amount,
      currency: 'USD',
      session_id: sessionId,
      event_category: 'conversion'
    });
    trackEvent('checkout_completed', { productType, amount });
  },

  // Step 6: Checkout abandoned
  checkoutAbandoned: (lastStep: string, productType?: string) => {
    analytics.track('checkout_abandoned', {
      last_step: lastStep,
      product_type: productType,
      event_category: 'conversion'
    });
    trackEvent('checkout_abandoned', { lastStep, productType });
  },

  // Upsell tracking
  upsellShown: (tier: string, discountPercent: number) => {
    analytics.track('upsell_shown', {
      subscription_tier: tier,
      discount_percent: discountPercent,
      event_category: 'conversion'
    });
  },

  upsellAccepted: (creditsAmount: number, discountedPrice: number) => {
    analytics.track('upsell_accepted', {
      credits_amount: creditsAmount,
      discounted_price: discountedPrice,
      event_category: 'conversion'
    });
  },

  upsellDismissed: () => {
    analytics.track('upsell_dismissed', {
      event_category: 'conversion'
    });
  },

  // Annual upgrade upsell tracking
  annualUpsellShown: (planName: string) => {
    analytics.track('annual_upsell_shown', {
      plan_name: planName,
      discount_percent: 50,
      event_category: 'conversion'
    });
    trackEvent('annual_upsell_shown', { planName });
  },

  annualUpsellAccepted: (quantity: number, totalPrice: number, totalSavings: number) => {
    analytics.track('annual_upsell_accepted', {
      credits_quantity: quantity * 10,
      packs_purchased: quantity,
      total_price: totalPrice,
      total_savings: totalSavings,
      event_category: 'conversion'
    });
    trackEvent('annual_upsell_accepted', { quantity, totalPrice, totalSavings });
  },

  annualUpsellDeclined: (planName: string) => {
    analytics.track('annual_upsell_declined', {
      plan_name: planName,
      event_category: 'conversion'
    });
    trackEvent('annual_upsell_declined', { planName });
  },

  // Error tracking
  checkoutErrorOccurred: (errorType: string, errorMessage: string, productType: string, priceId: string, step: string) => {
    analytics.track('checkout_error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      product_type: productType,
      price_id: priceId,
      step: step,
      event_category: 'conversion'
    });
    trackEvent('checkout_error', { errorType, errorMessage, productType, priceId, step });
  },

  checkoutTimedOut: (duration: number, productType: string, priceId: string, step: string) => {
    analytics.track('checkout_timed_out', {
      duration_seconds: duration,
      product_type: productType,
      price_id: priceId,
      step: step,
      event_category: 'conversion'
    });
    trackEvent('checkout_timeout', { duration, productType, priceId, step });
  },

  checkoutRetried: (attemptNumber: number, productType: string, priceId: string) => {
    analytics.track('checkout_retried', {
      attempt_number: attemptNumber,
      product_type: productType,
      price_id: priceId,
      event_category: 'conversion'
    });
    trackEvent('checkout_retry', { attemptNumber, productType, priceId });
  },

  checkoutPopupBlocked: (productType: string, priceId: string) => {
    analytics.track('checkout_popup_blocked', {
      product_type: productType,
      price_id: priceId,
      event_category: 'conversion'
    });
    trackEvent('checkout_popup_blocked', { productType, priceId });
  },

  checkoutValidationFailed: (validationError: string, productType: string, priceId: string) => {
    analytics.track('checkout_validation_failed', {
      validation_error: validationError,
      product_type: productType,
      price_id: priceId,
      event_category: 'conversion'
    });
    trackEvent('checkout_validation_failed', { validationError, productType, priceId });
  }
};
