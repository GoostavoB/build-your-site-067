import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

const CTA = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="py-20 md:py-28 px-6" aria-labelledby="cta-heading">
      <div className="container mx-auto max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <h2 id="cta-heading" 
              className="font-bold leading-tight tracking-tight"
              style={{ 
                fontSize: 'clamp(28px, 3.5vw, 42px)',
                letterSpacing: '-0.01em'
              }}
          >
            {t('landing.cta.mainTitle', 'Start today')}
          </h2>
          
          <p className="text-[17px] text-muted-foreground/70 font-light max-w-xl mx-auto leading-relaxed">
            {t('landing.cta.mainSubtitle', 'Upload your last 30 days and get AI-powered insights to raise your average R')}
          </p>
          
          <div>
            <Button 
              onClick={() => navigate('/auth')}
              size="lg"
              className="px-10 py-7 text-[15px] font-semibold rounded-xl"
              aria-label="Start free trial"
            >
              {t('landing.cta.buttonText', 'Start free trial')}
            </Button>
            
            <p className="mt-4 text-[13px] text-muted-foreground/70">
              {t('landing.cta.disclaimer', 'No credit card required • 7-day free trial')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
