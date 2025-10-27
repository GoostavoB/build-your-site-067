import { Shield, Zap, Lock, Building2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const BenefitsGrid = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const benefits = [
    {
      icon: Shield,
      titleKey: "landing.benefits.noApiKeys.title",
      descriptionKey: "landing.benefits.noApiKeys.description",
    },
    {
      icon: Building2,
      titleKey: "landing.benefits.allExchanges.title",
      descriptionKey: "landing.benefits.allExchanges.description",
    },
    {
      icon: Lock,
      titleKey: "landing.benefits.privateDefault.title",
      descriptionKey: "landing.benefits.privateDefault.description",
    },
    {
      icon: Shield,
      titleKey: "landing.benefits.saferDesign.title",
      descriptionKey: "landing.benefits.saferDesign.description",
    },
    {
      icon: Upload,
      titleKey: "landing.benefits.uploadGo.title",
      descriptionKey: "landing.benefits.uploadGo.description",
    },
    {
      icon: Zap,
      titleKey: "landing.benefits.fasterUploads.title",
      descriptionKey: "landing.benefits.fasterUploads.description",
    },
  ];

  const handleCTAClick = () => {
    const params = new URLSearchParams(location.search);
    const lang = params.get('lang');
    navigate(`/auth${lang ? `?lang=${lang}` : ''}`);
  };

  return (
    <section 
      className="py-20 md:py-32 px-4 relative overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-background"
      data-testid="benefits-v2"
      aria-label="Key Benefits"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            {t("landing.benefits.mainTitle")}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("landing.benefits.mainSubtitle")}
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="glass p-8 rounded-2xl h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 border border-border/50 hover:border-primary/30">
                  <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                    <Icon 
                      className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110" 
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground transition-colors duration-300 group-hover:text-primary">
                    {t(benefit.titleKey)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(benefit.descriptionKey)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            onClick={handleCTAClick}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label={t("landing.benefits.ctaButton")}
          >
            {t("landing.benefits.ctaButton")}
          </Button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-sm text-muted-foreground mb-6">
            {t("landing.benefits.trustedBy")}
          </p>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-50 hover:opacity-75 transition-opacity">
            <span className="text-xl font-semibold text-muted-foreground">Binance</span>
            <span className="text-xl font-semibold text-muted-foreground">Bybit</span>
            <span className="text-xl font-semibold text-muted-foreground">OKX</span>
            <span className="text-xl font-semibold text-muted-foreground">Kraken</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsGrid;
