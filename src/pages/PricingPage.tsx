import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { usePageMeta } from "@/hooks/usePageMeta";
import { motion } from "framer-motion";
import { Sparkles, Target, Shield, TrendingUp, FileText, LayoutDashboard, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Pricing from "@/components/Pricing";
import PricingComparison from "@/components/PricingComparison";
import PricingRoadmap from "@/components/PricingRoadmap";
import CTA from "@/components/CTA";

const PricingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);

  usePageMeta({
    title: 'Pricing Plans - AI-Powered Crypto Trading Journal',
    description: 'Choose the perfect plan for your crypto trading journey. AI insights, pattern recognition, risk management, and performance analytics.',
    canonical: 'https://www.thetradingdiary.com/pricing',
  });

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const solutions = [
    {
      icon: Sparkles,
      title: t('pricing.solutions.aiInsights.title'),
      description: t('pricing.solutions.aiInsights.description'),
      outcome: t('pricing.solutions.aiInsights.outcome')
    },
    {
      icon: Target,
      title: t('pricing.solutions.patternRecognition.title'),
      description: t('pricing.solutions.patternRecognition.description'),
      outcome: t('pricing.solutions.patternRecognition.outcome')
    },
    {
      icon: Shield,
      title: t('pricing.solutions.riskManagement.title'),
      description: t('pricing.solutions.riskManagement.description'),
      outcome: t('pricing.solutions.riskManagement.outcome')
    },
    {
      icon: TrendingUp,
      title: t('pricing.solutions.performanceAnalytics.title'),
      description: t('pricing.solutions.performanceAnalytics.description'),
      outcome: t('pricing.solutions.performanceAnalytics.outcome')
    },
    {
      icon: FileText,
      title: t('pricing.solutions.notesAttachments.title'),
      description: t('pricing.solutions.notesAttachments.description'),
      outcome: t('pricing.solutions.notesAttachments.outcome')
    },
    {
      icon: LayoutDashboard,
      title: t('pricing.solutions.customDashboard.title'),
      description: t('pricing.solutions.customDashboard.description'),
      outcome: t('pricing.solutions.customDashboard.outcome')
    },
    {
      icon: Users,
      title: t('pricing.solutions.builtByTraders.title'),
      description: t('pricing.solutions.builtByTraders.description'),
      outcome: t('pricing.solutions.builtByTraders.outcome')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-20 md:py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent opacity-50" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="container relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t('pricing.hero.title')}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('pricing.hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/auth')}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all"
              >
                {t('pricing.hero.primaryCta')}
              </button>
              <button
                onClick={() => {/* TODO: Add demo video */}}
                className="px-8 py-4 bg-secondary text-secondary-foreground rounded-xl font-medium hover:opacity-90 transition-all"
              >
                {t('pricing.hero.secondaryCta')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section with Scroll Animations */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              {t('pricing.solutions.title')}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              {t('pricing.solutions.subtitle')}
            </motion.p>
          </div>
          
          <div className="space-y-6">
            {solutions.map((solution, index) => (
              <SolutionCard key={index} solution={solution} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <Pricing />
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

// Solution Card Component with Scroll Animation
const SolutionCard = ({ solution, index }: { solution: any; index: number }) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.4 });
  const Icon = solution.icon;
  const isEven = index % 2 === 0;

  return (
    <div ref={ref}>
      <motion.div
        initial={{ 
          opacity: 0, 
          x: isEven ? -32 : 32 
        }}
        animate={{ 
          opacity: isVisible ? 1 : 0, 
          x: isVisible ? 0 : (isEven ? -32 : 32)
        }}
        transition={{ 
          duration: 0.35,
          delay: 0.12,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">{solution.title}</h3>
                <p className="text-muted-foreground mb-4 text-base leading-relaxed">
                  {solution.description}
                </p>
                <div className="flex items-start gap-2 pt-2 border-t border-border/50">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs">→</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {solution.outcome}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PricingPage;
