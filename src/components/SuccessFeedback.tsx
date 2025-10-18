import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SuccessFeedbackProps {
  tradesCount: number;
  onViewDashboard: () => void;
  onViewHistory: () => void;
}

export function SuccessFeedback({ tradesCount, onViewDashboard, onViewHistory }: SuccessFeedbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="p-8 bg-card border-border text-center space-y-6">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-neon-green/10 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-neon-green" />
          </div>
        </motion.div>

        {/* Success Message */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">
            Trade{tradesCount > 1 ? 's' : ''} Added Successfully!
          </h3>
          <p className="text-muted-foreground">
            {tradesCount > 1 
              ? `${tradesCount} trades have been saved to your history.`
              : 'Your trade has been saved to your history.'
            }
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            onClick={onViewDashboard}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            size="lg"
          >
            View Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            onClick={onViewHistory}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Edit or Remove in Trade History
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-muted-foreground pt-4 border-t border-border">
          You can edit or remove trades anytime in your Trade History page
        </div>
      </Card>
    </motion.div>
  );
}
