import { Upload, Palette, Trophy, BarChart3, LucideIcon } from "lucide-react";

export interface PricingFeature {
  icon?: LucideIcon;
  text: string;
}

export interface PricingPlan {
  id: 'free' | 'pro' | 'elite';
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  annualTotal: number;
  badge: string | null;
  popular: boolean;
  tagline: string;
  cta: {
    monthly: string;
    annual: string;
  };
  features: PricingFeature[];
  priceCurrency: string;
}

/**
 * SINGLE SOURCE OF TRUTH FOR PRICING
 * Used across: Landing page, SelectPlan page, Upgrade page
 * 
 * To update pricing, edit this file only - changes automatically reflect everywhere
 */
export const PRICING_PLANS: Record<'starter' | 'pro' | 'elite', PricingPlan> = {
  starter: {
    id: 'free',
    name: 'Starter',
    description: 'For new traders – Get started free',
    monthlyPrice: 0,
    annualPrice: 0,
    annualTotal: 0,
    badge: null,
    popular: false,
    tagline: 'No credit card required',
    cta: {
      monthly: 'Start Free',
      annual: 'Start Free'
    },
    features: [
      { icon: Upload, text: '5 uploads total (gift 🎁)' },
      { icon: Palette, text: 'Essential widgets (Tiers 1-2)' },
      { icon: Trophy, text: 'Basic XP system' },
      { icon: BarChart3, text: 'Starter analytics' },
      { text: 'One account only' }
    ],
    priceCurrency: 'USD'
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For serious traders ⚡ Progress faster',
    monthlyPrice: 12,
    annualPrice: 10,
    annualTotal: 120,
    badge: 'Most Popular',
    popular: true,
    tagline: 'Credit card required',
    cta: {
      monthly: 'Go Pro Now • Offer Ends Soon',
      annual: 'Go Pro Now • Offer Ends Soon'
    },
    features: [
      { icon: Upload, text: '30 uploads per month' },
      { icon: Palette, text: 'Advanced widgets & customization' },
      { icon: Trophy, text: 'Full XP system with leaderboards' },
      { icon: BarChart3, text: 'Advanced analytics & tracking' },
      { text: 'Unlimited trading accounts' },
      { text: 'Fee tracking & reporting' },
      { text: 'Add 10 uploads for $2' },
      { text: 'Renew every 30 days' }
    ],
    priceCurrency: 'USD'
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    description: 'For power traders ⚡ Full control and flexibility',
    monthlyPrice: 25,
    annualPrice: 20,
    annualTotal: 240,
    badge: 'Best Value',
    popular: false,
    tagline: 'Credit card required',
    cta: {
      monthly: 'Join Elite • Save $60/Year',
      annual: 'Join Elite • Save $60/Year'
    },
    features: [
      { icon: Upload, text: '150 uploads per month' },
      { text: 'All widgets unlocked' },
      { text: 'Full color & background customization' },
      { text: 'Premium priority support' },
      { text: 'Custom branding options' },
      { text: 'Add 10 uploads for $1 (50% off)' },
      { text: 'Everything in Pro' },
      { text: 'Renew every 30 days' }
    ],
    priceCurrency: 'USD'
  }
};

/**
 * Helper function to get display price based on billing cycle
 */
export const getDisplayPrice = (plan: PricingPlan, billingCycle: 'monthly' | 'annual'): number => {
  return billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
};

/**
 * Calculate annual savings for a plan
 */
export const getSavings = (plan: PricingPlan): number => {
  return (plan.monthlyPrice * 12) - plan.annualTotal;
};
