import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PremiumFeaturesButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate('/premium-features')}
      className="gap-2 border-primary/30 hover:bg-primary/5"
    >
      <Sparkles className="h-4 w-4 text-primary" />
      Explore Premium
    </Button>
  );
};
