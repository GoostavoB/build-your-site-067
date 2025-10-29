import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Lock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { PremiumFeature } from '@/hooks/usePremiumShowcase';

interface PremiumFeatureCardProps {
  feature: PremiumFeature;
  isUnlocked: boolean;
  index: number;
}

export const PremiumFeatureCard = ({ feature, isUnlocked, index }: PremiumFeatureCardProps) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const handleUpgrade = () => {
    const pricingPath = currentLang === 'en' ? '/pricing' : `/${currentLang}/pricing`;
    navigate(pricingPath);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`h-full transition-all duration-300 ${
        isUnlocked 
          ? 'border-primary/50 bg-gradient-to-br from-primary/5 to-transparent' 
          : 'border-muted hover:border-primary/30'
      }`}>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="text-4xl mb-2">{feature.icon}</div>
            <Badge 
              variant={isUnlocked ? "default" : "secondary"}
              className="gap-1"
            >
              {isUnlocked ? (
                <>
                  <Check className="h-3 w-3" />
                  Unlocked
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3" />
                  {feature.requiredPlan === 'elite' ? 'Elite' : 'Pro'}
                </>
              )}
            </Badge>
          </div>
          <CardTitle className="text-xl">{feature.title}</CardTitle>
          <CardDescription>{feature.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {feature.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className={isUnlocked ? 'text-foreground' : 'text-muted-foreground'}>
                  {benefit}
                </span>
              </div>
            ))}
          </div>
          
          {!isUnlocked && (
            <Button 
              onClick={handleUpgrade}
              variant="outline"
              size="sm"
              className="w-full gap-2 mt-4"
            >
              <Lock className="h-4 w-4" />
              Upgrade to {feature.requiredPlan === 'elite' ? 'Elite' : 'Pro'}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
