import { motion } from "framer-motion";
import { Shield, Key, Globe, Lock, Upload, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { getLocalizedPath, getLanguageFromPath } from "@/utils/languageRouting";
import { useLocation } from "react-router-dom";

const BenefitBadges = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentLang = getLanguageFromPath(location.pathname);

  const benefits = [
    { 
      titleKey: "landing.benefits.noApiKeys.title",
      descriptionKey: "landing.benefits.noApiKeys.description",
      icon: Key 
    },
    { 
      titleKey: "landing.benefits.allExchanges.title",
      descriptionKey: "landing.benefits.allExchanges.description",
      icon: Globe 
    },
    { 
      titleKey: "landing.benefits.privateDefault.title",
      descriptionKey: "landing.benefits.privateDefault.description",
      icon: Shield 
    },
    { 
      titleKey: "landing.benefits.saferDesign.title",
      descriptionKey: "landing.benefits.saferDesign.description",
      icon: Lock 
    },
    { 
      titleKey: "landing.benefits.uploadGo.title",
      descriptionKey: "landing.benefits.uploadGo.description",
      icon: Upload 
    },
  ];

  return (
    <section className="py-24 md:py-32 px-6 relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background" aria-label="Key benefits">
      <div className="absolute inset-0 border-t border-b border-primary/10" aria-hidden="true"></div>
      
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {t('landing.benefits.mainTitle')}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('landing.benefits.mainSubtitle')}
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative h-full p-6 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
                  {/* Icon with glow effect */}
                  <div className="mb-4 relative inline-block">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <Icon 
                        className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" 
                        strokeWidth={1.5}
                        aria-hidden="true" 
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {t(benefit.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(benefit.descriptionKey)}
                  </p>

                  {/* Hover accent line */}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/0 group-hover:w-full transition-all duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-sm text-muted-foreground mb-4">
            {t('landing.benefits.trustedBy', 'Trusted by 45,000+ traders worldwide')}
          </p>
          <div className="flex items-center justify-center gap-8 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            <span className="text-xs font-semibold uppercase tracking-wider">Binance</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Bybit</span>
            <span className="text-xs font-semibold uppercase tracking-wider">OKX</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Kraken</span>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            onClick={() => navigate(getLocalizedPath('/auth', currentLang))}
            size="lg"
            className="group gap-2 px-8 py-6 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
          >
            {t('landing.benefits.ctaButton', 'Try it free now')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitBadges;
