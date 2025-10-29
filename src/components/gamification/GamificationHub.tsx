import { memo } from 'react';
import { Card } from '@/components/ui/card';
import { TierPreviewButton } from '@/components/tier/TierPreviewButton';
import { QuickShareButtons } from '@/components/social/QuickShareButtons';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/utils/animations';

export const GamificationHub = memo(() => {
  const navigate = useNavigate();

  return (
    <Card className="p-6 glass-strong">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        <motion.div variants={fadeInUp}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Rewards Hub
          </h3>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <TierPreviewButton />
        </motion.div>

        <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="justify-start group hover:bg-primary/5 hover:border-primary/50"
            onClick={() => navigate('/achievements')}
          >
            <Target className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
            <span>View Achievements</span>
          </Button>

          <Button
            variant="outline"
            className="justify-start group hover:bg-primary/5 hover:border-primary/50"
            onClick={() => navigate('/leaderboard')}
          >
            <Users className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
            <span>Leaderboard</span>
          </Button>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <QuickShareButtons text="Check out my trading progress!" />
        </motion.div>
      </motion.div>
    </Card>
  );
});

GamificationHub.displayName = 'GamificationHub';
