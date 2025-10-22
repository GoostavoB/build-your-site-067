import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePageMeta } from "@/hooks/usePageMeta";
import { motion } from "framer-motion";
import PricingComparison from "@/components/PricingComparison";
import PricingRoadmap from "@/components/PricingRoadmap";
import CTA from "@/components/CTA";
import { ShaderBackground } from "@/components/ShaderBackground";
import { OutcomeCard } from "@/components/premium/OutcomeCard";
import { ParallaxTradingElements } from "@/components/premium/ParallaxTradingElements";
import { PremiumPricingCard } from "@/components/PremiumPricingCard";
import { MagneticButton } from "@/components/MagneticButton";

const PricingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const [backgroundIntensity, setBackgroundIntensity] = useState(1.0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  usePageMeta({
    title: 'Pricing Plans - AI-Powered Crypto Trading Journal',
    description: 'Choose the perfect plan for your crypto trading journey. AI insights, pattern recognition, risk management, and performance analytics.',
    canonical: 'https://www.thetradingdiary.com/pricing',
  });

  // Scroll-linked background intensity
  useEffect(() => {
    const handleScroll = () => {
      if (pricingRef.current) {
        const rect = pricingRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Increase intensity as pricing section approaches
        if (rect.top < windowHeight && rect.top > 0) {
          const progress = 1 - (rect.top / windowHeight);
          setBackgroundIntensity(1 + progress * 0.08);
        } else if (rect.top <= 0) {
          // Return to baseline when section is in view
          setBackgroundIntensity(1.0);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const solutions = [
    {
      headline: t('pricing.solutions.seePatterns.headline'),
      subhead: t('pricing.solutions.seePatterns.subhead'),
      metric: t('pricing.solutions.seePatterns.metric'),
      proofPoint: t('pricing.solutions.seePatterns.proofPoint'),
      visual: (
        <div className="relative w-full h-48 bg-gradient-to-br from-primary/10 to-accent/5 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-5 grid-rows-4 gap-2 p-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="rounded bg-primary/20"
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      headline: t('pricing.solutions.knowEdge.headline'),
      subhead: t('pricing.solutions.knowEdge.subhead'),
      metric: t('pricing.solutions.knowEdge.metric'),
      metricValue: 67,
      proofPoint: t('pricing.solutions.knowEdge.proofPoint'),
      visual: (
        <div className="relative w-full h-48">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            {[30, 45, 60, 75, 90].map((height, i) => (
              <motion.rect
                key={i}
                x={i * 35 + 10}
                y={100 - height}
                width="25"
                height={height}
                fill="currentColor"
                className="text-primary/60"
                initial={{ height: 0 }}
                animate={{ height }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
            ))}
          </svg>
        </div>
      ),
    },
    {
      headline: t('pricing.solutions.tradeConfidence.headline'),
      subhead: t('pricing.solutions.tradeConfidence.subhead'),
      metric: t('pricing.solutions.tradeConfidence.metric'),
      metricValue: 89,
      proofPoint: t('pricing.solutions.tradeConfidence.proofPoint'),
      visual: (
        <div className="relative w-full h-48 flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/20"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className="text-primary"
                initial={{ strokeDasharray: '0 251.2' }}
                animate={{ strokeDasharray: '224 251.2' }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
              89%
            </div>
          </div>
        </div>
      ),
    },
    {
      headline: t('pricing.solutions.trackEffortlessly.headline'),
      subhead: t('pricing.solutions.trackEffortlessly.subhead'),
      metric: t('pricing.solutions.trackEffortlessly.metric'),
      metricValue: 12,
      proofPoint: t('pricing.solutions.trackEffortlessly.proofPoint'),
      visual: (
        <div className="relative w-full h-48 flex items-center justify-center">
          <div className="relative">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute w-32 h-40 bg-gradient-to-br from-primary/20 to-accent/10 rounded-lg border border-white/10"
                style={{
                  left: `${i * 12}px`,
                  top: `${i * 8}px`,
                  zIndex: 3 - i,
                }}
                initial={{ rotateZ: 0, y: 0 }}
                animate={{
                  rotateZ: i * 4,
                  y: i * -2,
                }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      headline: t('pricing.solutions.performanceSpeaks.headline'),
      subhead: t('pricing.solutions.performanceSpeaks.subhead'),
      metric: t('pricing.solutions.performanceSpeaks.metric'),
      metricValue: 2.3,
      proofPoint: t('pricing.solutions.performanceSpeaks.proofPoint'),
      visual: (
        <div className="relative w-full h-48">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <motion.path
              d="M 10 90 Q 50 70, 100 40 T 190 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-primary"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
          </svg>
        </div>
      ),
    },
    {
      headline: t('pricing.solutions.yourRules.headline'),
      subhead: t('pricing.solutions.yourRules.subhead'),
      metric: t('pricing.solutions.yourRules.metric'),
      metricValue: 8,
      proofPoint: t('pricing.solutions.yourRules.proofPoint'),
      visual: (
        <div className="relative w-full h-48 grid grid-cols-3 grid-rows-3 gap-2 p-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-br from-primary/20 to-accent/10 rounded-lg border border-white/10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            />
          ))}
        </div>
      ),
    },
    {
      headline: t('pricing.solutions.builtByTraders.headline'),
      subhead: t('pricing.solutions.builtByTraders.subhead'),
      metric: t('pricing.solutions.builtByTraders.metric'),
      metricValue: 10000,
      proofPoint: t('pricing.solutions.builtByTraders.proofPoint'),
      visual: (
        <div className="relative w-full h-48 flex items-center justify-center">
          <div className="flex -space-x-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/40 to-accent/20 border-2 border-background"
                initial={{ scale: 0, x: -20 }}
                animate={{ scale: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
      ),
    },
  ];

  const plans = [
    {
      id: 'basic',
      nameKey: "pricing.plans.basic.name",
      descriptionKey: "pricing.plans.basic.description",
      monthlyPrice: 15,
      annualPrice: 12,
      annualTotal: 144,
      featuresKeys: [
        "pricing.plans.basic.features.uploads",
        "pricing.plans.basic.features.manualUploads",
        "pricing.plans.basic.features.dashboard",
        "pricing.plans.basic.features.charts",
        "pricing.plans.basic.features.basicJournal",
        "pricing.plans.basic.features.feeAnalytics",
        "pricing.plans.basic.features.csv",
        "pricing.plans.basic.features.social",
      ],
      ctaKey: "pricing.plans.cta",
      popular: false,
    },
    {
      id: 'pro',
      nameKey: "pricing.plans.pro.name",
      descriptionKey: "pricing.plans.pro.description",
      monthlyPrice: 35,
      annualPrice: 28,
      annualTotal: 336,
      featuresKeys: [
        "pricing.plans.pro.features.uploads",
        "pricing.plans.pro.features.aiAnalysis",
        "pricing.plans.pro.features.tradingPlan",
        "pricing.plans.pro.features.goals",
        "pricing.plans.pro.features.richJournal",
        "pricing.plans.pro.features.customWidgets",
        "pricing.plans.pro.features.fullSocial",
        "pricing.plans.pro.features.everythingBasic",
      ],
      ctaKey: "pricing.plans.cta",
      popular: true,
    },
    {
      id: 'elite',
      nameKey: "pricing.plans.elite.name",
      descriptionKey: "pricing.plans.elite.description",
      monthlyPrice: 79,
      annualPrice: 63,
      annualTotal: 756,
      featuresKeys: [
        "pricing.plans.elite.features.uploads",
        "pricing.plans.elite.features.aiAnalysis",
        "pricing.plans.elite.features.tradeReplay",
        "pricing.plans.elite.features.positionCalculator",
        "pricing.plans.elite.features.riskDashboard",
        "pricing.plans.elite.features.advancedAlerts",
        "pricing.plans.elite.features.everythingPro",
      ],
      ctaKey: "pricing.plans.cta",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* WebGL Shader Background */}
      <ShaderBackground intensity={backgroundIntensity} />

      {/* Hero Section */}
      <section ref={heroRef} className="relative py-32 md:py-40 px-6 overflow-hidden">
        <div className="container relative mx-auto max-w-4xl text-center z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 
              className="text-6xl md:text-8xl font-bold mb-6 leading-tight tracking-tight" 
              style={{ 
                letterSpacing: '-0.02em', 
                maxWidth: '64ch', 
                margin: '0 auto',
                textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                color: 'rgba(255,255,255,0.95)'
              }}
            >
              {t('pricing.hero.title')}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              {t('pricing.hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton
                onClick={() => navigate('/auth')}
                size="lg"
                className="px-10 py-7 text-base"
              >
                {t('pricing.hero.primaryCta')}
              </MagneticButton>
              <MagneticButton
                onClick={() => {/* TODO: Add demo video */}}
                variant="outline"
                size="lg"
                className="px-10 py-7 text-base"
              >
                {t('pricing.hero.secondaryCta')}
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section - Premium Outcome Gallery */}
      <section className="relative py-32 px-6 overflow-hidden">
        <ParallaxTradingElements />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-display font-bold mb-6 tracking-[-0.02em]"
            >
              {t('pricing.solutions.title')}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-muted-foreground/80 max-w-2xl mx-auto"
            >
              {t('pricing.solutions.subtitle')}
            </motion.p>
          </div>

          <div className="space-y-40">
            {solutions.map((solution, index) => (
              <OutcomeCard key={index} {...solution} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section ref={pricingRef} className="py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
              style={{ letterSpacing: '-0.01em' }}
            >
              {t('pricing.title')}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.09, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              {t('pricing.subtitle')}
            </motion.p>

            {/* Billing Toggle with Physical Switch Feel */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.28, delay: 0.18 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-4 mb-4"
            >
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-280 ease-premium ${
                  billingCycle === 'monthly'
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('pricing.billing.monthly')}
              </button>
              
              <motion.button
                onClick={() => setBillingCycle('annual')}
                whileTap={{ scale: 0.98 }}
                className={`relative px-6 py-3 rounded-lg font-medium transition-all duration-280 ease-premium ${
                  billingCycle === 'annual'
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('pricing.billing.annual')}
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                  {t('pricing.billing.save20')}
                </span>
              </motion.button>
            </motion.div>

            {/* Guarantee Banner */}
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.28, delay: 0.27 }}
              viewport={{ once: true }}
              className="text-sm text-muted-foreground"
            >
              {t('pricing.guaranteeNote')}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
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
        </div>
      </section>

      {/* Comparison Table */}
      <PricingComparison />

      {/* Roadmap */}
      <PricingRoadmap />

      {/* Final CTA */}
      <CTA />
    </div>
  );
};

// Remove the old SolutionCard component as it's now in its own file

export default PricingPage;
