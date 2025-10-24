import { Users, TrendingUp, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

export const ProofBar = () => {
  const { t } = useTranslation();

  const metrics = [
    {
      icon: Users,
      value: "3,200+",
      label: t('landing.proofBar.activeTraders'),
    },
    {
      icon: TrendingUp,
      value: "120,000+",
      label: t('landing.proofBar.tradesAnalyzed'),
    },
    {
      icon: Star,
      value: "4.8",
      label: t('landing.proofBar.averageRating'),
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
      className="py-8 px-6"
      aria-label="Social proof metrics"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card border border-primary/20 rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-2"
              >
                <metric.icon className="h-5 w-5 text-primary mb-1" aria-hidden="true" />
                <div className="text-xl md:text-2xl font-bold text-foreground">
                  {metric.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};
