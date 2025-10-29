import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PremiumFeatureCard } from './PremiumFeatureCard';
import { usePremiumShowcase } from '@/hooks/usePremiumShowcase';
import { Crown, Zap } from 'lucide-react';

export const PremiumFeaturesShowcase = () => {
  const { features, canAccessFeature } = usePremiumShowcase();

  const proFeatures = features.filter(f => f.requiredPlan === 'pro');
  const eliteFeatures = features.filter(f => f.requiredPlan === 'elite');

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className="text-3xl font-bold">Premium Features</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Unlock powerful tools and insights to take your trading to the next level
        </p>
      </motion.div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="all">All Features</TabsTrigger>
          <TabsTrigger value="pro" className="gap-1">
            <Zap className="h-3 w-3" />
            Pro
          </TabsTrigger>
          <TabsTrigger value="elite" className="gap-1">
            <Crown className="h-3 w-3" />
            Elite
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <PremiumFeatureCard
                key={feature.id}
                feature={feature}
                isUnlocked={canAccessFeature(feature.requiredPlan)}
                index={index}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pro" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {proFeatures.map((feature, index) => (
              <PremiumFeatureCard
                key={feature.id}
                feature={feature}
                isUnlocked={canAccessFeature(feature.requiredPlan)}
                index={index}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="elite" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {eliteFeatures.map((feature, index) => (
              <PremiumFeatureCard
                key={feature.id}
                feature={feature}
                isUnlocked={canAccessFeature(feature.requiredPlan)}
                index={index}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
