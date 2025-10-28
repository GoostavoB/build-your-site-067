import { Button } from '@/components/ui/button';
import { Zap, FlaskConical } from 'lucide-react';
import { useXPSystem } from '@/hooks/useXPSystem';
import { toast } from 'sonner';

export function XPTestButton() {
  const { addXP } = useXPSystem();

  // Only show in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  const handleTestXP = async () => {
    try {
      await addXP(100, 'test', 'Dev test XP award');
      toast.success('Test XP awarded! Check DailyMissionBar above.', {
        description: '+100 XP added to your daily total',
      });
    } catch (error) {
      toast.error('Failed to award test XP', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        onClick={handleTestXP}
        variant="outline"
        className="gap-2 bg-yellow-500/10 border-yellow-500/50 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
        size="lg"
      >
        <FlaskConical className="w-4 h-4" />
        <Zap className="w-4 h-4" />
        +100 XP (Test Only)
      </Button>
    </div>
  );
}
