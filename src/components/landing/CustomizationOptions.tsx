import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export const CustomizationOptions = () => {
  const { t } = useTranslation();

  const plans = [
    {
      name: t('landing.customization.starter', 'Starter'),
      features: [
        t('landing.customization.starterFeature1', 'Default theme'),
        t('landing.customization.starterFeature2', 'Light mode'),
        t('landing.customization.starterFeature3', 'Dark mode'),
      ],
      colors: ['#2D68FF', '#718096', '#1A202C'],
    },
    {
      name: t('landing.customization.pro', 'Pro'),
      features: [
        t('landing.customization.proFeature1', 'Light & Dark mode'),
        t('landing.customization.proFeature2', 'Primary color'),
        t('landing.customization.proFeature3', 'Secondary color'),
        t('landing.customization.proFeature4', 'Accent color'),
      ],
      colors: ['#2D68FF', '#FFC300', '#10B981', '#8B5CF6', '#EF4444'],
      highlighted: true,
    },
    {
      name: t('landing.customization.elite', 'Elite'),
      features: [
        t('landing.customization.eliteFeature1', 'Full customization'),
        t('landing.customization.eliteFeature2', 'Background colors'),
        t('landing.customization.eliteFeature3', 'All color options'),
        t('landing.customization.eliteFeature4', 'Custom gradients'),
      ],
      colors: ['#2D68FF', '#FFC300', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B', '#EC4899'],
    },
  ];

  return (
    <section id="customization" className="py-16 md:py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {t('landing.customization.title', 'Color Themes & Customization')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('landing.customization.subtitle', 'Choose your plan and unlock customization options that match your trading style.')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`glass-card p-6 ${plan.highlighted ? 'ring-2 ring-primary' : ''}`}
            >
              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {plan.colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-background shadow-lg"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
