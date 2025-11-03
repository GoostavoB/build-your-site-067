import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackUserJourney } from "@/utils/analyticsEvents";
import { SUBSCRIPTION_PRODUCTS } from "@/config/stripe-products";
import { PlanComparisonModal } from "@/components/pricing/PlanComparisonModal";
import { PRICING_PLANS, getDisplayPrice, getSavings } from "@/config/pricing";
import { useTranslation } from "react-i18next";

export default function SelectPlan() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual'); // Default to annual

  useEffect(() => {
    trackUserJourney.planSelectionViewed();
  }, []);

  const handleFreePlan = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Update profile to free tier
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_tier: 'free',
          onboarding_completed: true,
        })
        .eq('id', user.id);

      if (error) throw error;

      trackUserJourney.planSelected('free');
      toast.success("Welcome! You received 5 free credits to get started.");
      navigate('/dashboard');
    } catch (error) {
      console.error('Error setting free plan:', error);
      toast.error("Failed to complete setup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaidPlan = async (planType: 'pro' | 'elite') => {
    if (!user) return;
    
    setLoadingPlan(planType);
    try {
      const product = billingCycle === 'monthly' 
        ? SUBSCRIPTION_PRODUCTS[planType].monthly 
        : SUBSCRIPTION_PRODUCTS[planType].annual;
      
      const price = getDisplayPrice(PRICING_PLANS[planType], billingCycle);
      trackUserJourney.checkoutStarted('subscription', price, product.priceId);
      
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          priceId: product.priceId,
          productType: `subscription_${billingCycle}_${planType}`,
          successUrl: `${window.location.origin}/dashboard?welcome=true`,
          cancelUrl: `${window.location.origin}/select-plan`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  // Use centralized pricing configuration
  const plans = Object.values(PRICING_PLANS).map(plan => ({
    ...plan,
    displayPrice: getDisplayPrice(plan, billingCycle),
    savings: getSavings(plan),
    cta: billingCycle === 'monthly' ? plan.cta.monthly : plan.cta.annual,
    action: plan.id === 'free' 
      ? handleFreePlan 
      : () => handlePaidPlan(plan.id as 'pro' | 'elite')
  }));

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient Background Glow - Same as landing page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/2 left-[30%] w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(45,104,255,0.08), transparent 60%)',
            filter: 'blur(120px)',
          }}
        />
        <div 
          className="absolute top-1/2 right-[30%] w-[600px] h-[600px] translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(255,200,45,0.08), transparent 60%)',
            filter: 'blur(120px)',
          }}
        />
      </div>

      <div className="container mx-auto px-6 py-16 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Choose your plan to continue
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
            Select a plan that fits your trading style. You can upgrade anytime.
          </p>
          <p className="text-sm text-orange-400 font-semibold">
            Launch pricing available until November 30, 2025
          </p>

          {/* Billing Toggle - Same as landing page */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <div className="inline-flex items-center rounded-xl bg-card/40 backdrop-blur-sm border border-border/50 p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                aria-pressed={billingCycle === 'monthly'}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('pricing.billing.monthly', 'Monthly')}
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                aria-pressed={billingCycle === 'annual'}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('pricing.billing.annual', 'Annual')}
              </button>
            </div>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/15 text-green-500 text-xs font-semibold">
              <span className="animate-pulse">⚡</span>
              Save up to $60/year
            </span>
          </div>
          {billingCycle === 'annual' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground mt-2"
            >
              Save up to 16.7% when billed annually
            </motion.p>
          )}

          <Button 
            variant="link" 
            onClick={() => setShowComparison(true)}
            className="text-primary mt-4"
          >
            Compare plans in detail →
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto" role="list">
          {plans.map((plan, index) => {
            const isFree = plan.id === 'free';
            const isElite = plan.id === 'elite';
            
            return (
              <motion.article
                role="listitem"
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  y: -6, 
                  scale: plan.popular ? 1.07 : isElite ? 1.04 : 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className={`relative rounded-3xl p-7 md:p-8 transition-all duration-300 group
                  ${plan.popular ? 'md:scale-105' : isElite ? 'md:scale-102' : 'md:scale-100'}
                `}
                style={{
                  background: isFree 
                    ? 'rgba(255,255,255,0.02)'
                    : plan.popular
                    ? 'linear-gradient(180deg, rgba(45,104,255,0.12), rgba(45,104,255,0.05))'
                    : 'linear-gradient(180deg, rgba(255,200,45,0.12), rgba(255,200,45,0.05))',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: plan.popular
                    ? '0 4px 25px rgba(0,0,0,0.45), 0 0 0 rgba(45,104,255,0)'
                    : '0 4px 25px rgba(0,0,0,0.45)',
                }}
              >
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: plan.popular
                      ? '0 0 30px rgba(45,104,255,0.4)'
                      : isElite
                      ? '0 0 30px rgba(255,200,45,0.35)'
                      : 'none'
                  }}
                />

                {plan.popular && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider text-white z-20 shadow-lg"
                    style={{
                      background: 'linear-gradient(90deg, #2D68FF, #5A8CFF)',
                      boxShadow: '0 4px 12px rgba(45,104,255,0.4)',
                    }}
                  >
                    <span className="flex items-center gap-1">
                      <Sparkles size={12} />
                      Most Popular
                    </span>
                  </motion.div>
                )}

                {isElite && plan.badge && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider text-white z-20 shadow-lg"
                    style={{
                      background: 'linear-gradient(90deg, #FFC82D, #FFD700)',
                      boxShadow: '0 4px 12px rgba(255,200,45,0.4)',
                    }}
                  >
                    {plan.badge}
                  </motion.div>
                )}

                <div className="mb-6 relative z-10">
                  <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${
                    isElite ? 'bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent' : 'text-foreground'
                  }`}>
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground/65 text-sm mb-6 font-light">
                    {plan.description}
                  </p>
                  {plan.monthlyPrice > 0 ? (
                    <>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className={`font-bold ${plan.popular ? 'text-5xl' : 'text-4xl'}`} style={{ color: 'hsl(var(--primary))' }}>
                          ${plan.displayPrice}
                        </span>
                        <span className="text-sm text-muted-foreground/65 font-light">
                          /{billingCycle === 'monthly' ? t('pricing.perMonth', 'month') : t('pricing.perMonthBilledAnnually', 'month (billed annually)')}
                        </span>
                      </div>
                      {billingCycle === 'annual' && plan.savings > 0 && (
                        <div className="text-sm text-green-400 font-semibold mb-1">
                          Save ${plan.savings} annually
                        </div>
                      )}
                      {plan.monthlyPrice > 0 && (
                        <p className="text-xs text-muted-foreground/50 font-light">
                          {billingCycle === 'annual' ? `$${plan.annualTotal}/year billed annually` : 'Billed monthly'}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'hsl(var(--primary))' }}>
                      Free
                    </div>
                  )}
                </div>

                <motion.button
                  onClick={plan.action}
                  disabled={loadingPlan === plan.id}
                  whileHover={{ scale: loadingPlan === plan.id ? 1 : 1.02 }}
                  whileTap={{ scale: loadingPlan === plan.id ? 1 : 0.98 }}
                  className={`w-full h-12 mb-4 rounded-xl font-semibold transition-all relative z-10 overflow-hidden shadow-lg group/btn
                    ${plan.popular
                      ? ""
                      : isElite
                      ? "bg-amber-500/15 border-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/25 hover:border-amber-500/50"
                      : "bg-white/5 border border-white/10 hover:bg-white/10 text-muted-foreground hover:text-foreground"
                  } ${loadingPlan === plan.id ? 'opacity-70 cursor-not-allowed' : ''}`}
                  style={plan.popular ? {
                    background: 'linear-gradient(90deg, #2D68FF, #5A8CFF)',
                    boxShadow: '0 4px 15px rgba(45,104,255,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                  } : undefined}
                >
                  {plan.popular && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loadingPlan === plan.id ? 'Loading...' : plan.cta}
                    {plan.popular && loadingPlan !== plan.id && (
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        →
                      </motion.span>
                    )}
                  </span>
                </motion.button>

                <p className="text-xs text-muted-foreground/50 text-center mb-6 leading-relaxed relative z-10 font-light">
                  {plan.tagline}
                </p>

                <ul className="space-y-3 relative z-10">
                  {plan.features.map((feature, i) => {
                    const Icon = feature.icon;
                    return (
                      <motion.li 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + (i * 0.05) }}
                        className="flex items-start gap-3"
                      >
                        {Icon && <Icon className="w-4 h-4 text-primary shrink-0 mt-1" />}
                        <span className="text-sm text-muted-foreground/80 font-light">{feature.text}</span>
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>

      <PlanComparisonModal open={showComparison} onClose={() => setShowComparison(false)} />
    </div>
  );
}
