import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#2D68FF', '#5A8CFF', '#8AB4FF']
      });

      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#2D68FF', '#5A8CFF', '#8AB4FF']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-md w-full p-8 text-center glass-strong">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto w-20 h-20 mb-6 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-primary" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-bold mb-3 flex items-center justify-center gap-2">
              Welcome to Pro! <Sparkles className="w-6 h-6 text-primary" />
            </h1>
            <p className="text-muted-foreground mb-6">
              Your subscription is now active. Get ready to supercharge your trading journey!
            </p>

            {sessionId && (
              <p className="text-xs text-muted-foreground mb-4">
                Session ID: {sessionId.slice(0, 20)}...
              </p>
            )}

            <div className="space-y-3">
              <Button
                onClick={() => navigate('/dashboard')}
                size="lg"
                className="w-full"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-sm text-muted-foreground">
                Redirecting in {countdown} seconds...
              </p>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CheckoutSuccess;
