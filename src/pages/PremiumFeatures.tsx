import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PremiumFeaturesShowcase } from '@/components/premium/PremiumFeaturesShowcase';

export default function PremiumFeatures() {
  const navigate = useNavigate();

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Premium Features</h1>
          <p className="text-muted-foreground">Discover what you can unlock</p>
        </div>
      </motion.div>

      <PremiumFeaturesShowcase />
    </div>
  );
}
