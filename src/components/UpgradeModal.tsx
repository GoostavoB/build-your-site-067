import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PremiumPricingCard } from '@/components/PremiumPricingCard';
import { useTranslation } from '@/hooks/useTranslation';
import { useState } from 'react';
import { CreditCard, Lock, Rocket, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export type UpgradeIllustration = 'credits' | 'lock' | 'rocket' | 'chart';
export type UpgradeSource =
  | 'upload_zero_credits'
  | 'feature_lock'
  | 'rate_limit'
  | 'manual'
  | 'batch_upload_zero_credits';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: UpgradeSource;
  title?: string;
  message?: string;
  illustration?: UpgradeIllustration;
  requiredPlan?: 'basic' | 'pro' | 'elite';
  onPlanSelected?: (planId: string) => void;
}

const illustrations = {
  credits: CreditCard,
  lock: Lock,
  rocket: Rocket,
  chart: TrendingUp,
};

const defaultTitles: Record<UpgradeSource, string> = {
  upload_zero_credits: 'Out of AI Credits',
  batch_upload_zero_credits: 'Out of AI Credits',
  feature_lock: 'Premium Feature',
  rate_limit: 'Rate Limit Reached',
  manual: 'Upgrade Your Plan',
};

const defaultMessages: Record<UpgradeSource, string> = {
  upload_zero_credits: "You've used your monthly AI budget. Upgrade to continue using automatic trade extraction.",
  batch_upload_zero_credits: "You've used your monthly AI budget. Upgrade to process multiple images at once.",
  feature_lock: 'This feature requires a premium subscription. Upgrade to unlock advanced analytics and insights.',
  rate_limit: "You've reached your hourly limit. Upgrade for higher limits and priority processing.",
  manual: 'Choose a plan that fits your trading journey.',
};

export const UpgradeModal = ({
  open,
  onOpenChange,
  source,
  title,
  message,
  illustration = 'credits',
  requiredPlan,
  onPlanSelected,
}: UpgradeModalProps) => {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const IllustrationIcon = illustrations[illustration];
  const displayTitle = title || defaultTitles[source];
  const displayMessage = message || defaultMessages[source];

  const plans = [
    {
      id: 'basic',
      nameKey: 'pricing.plans.basic.name',
      descriptionKey: 'pricing.plans.basic.description',
      monthlyPrice: 15,
      annualPrice: 12,
      annualTotal: 144,
      featuresKeys: [
        'pricing.plans.basic.features.uploads',
        'pricing.plans.basic.features.manualUploads',
        'pricing.plans.basic.features.dashboard',
        'pricing.plans.basic.features.charts',
        'pricing.plans.basic.features.basicJournal',
        'pricing.plans.basic.features.feeAnalytics',
        'pricing.plans.basic.features.csv',
        'pricing.plans.basic.features.social',
      ],
      ctaKey: 'pricing.plans.cta',
      popular: false,
    },
    {
      id: 'pro',
      nameKey: 'pricing.plans.pro.name',
      descriptionKey: 'pricing.plans.pro.description',
      monthlyPrice: 35,
      annualPrice: 28,
      annualTotal: 336,
      featuresKeys: [
        'pricing.plans.pro.features.uploads',
        'pricing.plans.pro.features.aiAnalysis',
        'pricing.plans.pro.features.tradingPlan',
        'pricing.plans.pro.features.goals',
        'pricing.plans.pro.features.richJournal',
        'pricing.plans.pro.features.customWidgets',
        'pricing.plans.pro.features.fullSocial',
        'pricing.plans.pro.features.everythingBasic',
      ],
      ctaKey: 'pricing.plans.cta',
      popular: true,
    },
    {
      id: 'elite',
      nameKey: 'pricing.plans.elite.name',
      descriptionKey: 'pricing.plans.elite.description',
      monthlyPrice: 79,
      annualPrice: 63,
      annualTotal: 756,
      featuresKeys: [
        'pricing.plans.elite.features.uploads',
        'pricing.plans.elite.features.aiAnalysis',
        'pricing.plans.elite.features.tradeReplay',
        'pricing.plans.elite.features.positionCalculator',
        'pricing.plans.elite.features.riskDashboard',
        'pricing.plans.elite.features.advancedAlerts',
        'pricing.plans.elite.features.everythingPro',
      ],
      ctaKey: 'pricing.plans.cta',
      popular: false,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col items-center text-center mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-4 rounded-full bg-primary/10 p-4"
            >
              <IllustrationIcon className="h-12 w-12 text-primary" />
            </motion.div>
            <DialogTitle className="text-2xl md:text-3xl font-bold mb-2">
              {displayTitle}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground max-w-md">
              {displayMessage}
            </DialogDescription>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center rounded-lg bg-muted p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="flex items-center gap-2">
                  Annual
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-500/10 text-green-600 dark:text-green-400">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Save 20%
                  </span>
                </span>
              </button>
            </div>
          </div>
        </DialogHeader>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {plans.map((plan, index) => (
            <PremiumPricingCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              index={index}
              t={t}
            />
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include a 7-day money-back guarantee. Cancel anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
