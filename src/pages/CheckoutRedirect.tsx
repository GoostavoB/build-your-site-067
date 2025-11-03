import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { initiateStripeCheckout } from '@/utils/stripeCheckout';

const CheckoutRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [showManualLink, setShowManualLink] = useState(false);
  const [isInIframe] = useState(() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const initiateCheckout = async () => {
      console.info('🛒 Starting Stripe checkout via Edge Function...');
      console.info('🖼️ Running in iframe:', isInIframe);
      
      const priceId = searchParams.get('priceId');
      const productType = searchParams.get('productType') as 'subscription_monthly' | 'subscription_annual' | 'credits_starter' | 'credits_pro';
      
      if (!priceId || !productType) {
        setError('No product selected. Please select a plan.');
        setIsLoading(false);
        return;
      }

      try {
        console.info('📞 Calling initiateStripeCheckout with:', { priceId, productType });
        
        // Get the checkout URL from the Edge Function
        const url = await initiateStripeCheckout({
          priceId,
          productType,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        });
        
        console.info('✅ Got checkout URL:', url);
        setRedirectUrl(url);
        
        // Fallback timer: show manual link after 1 second
        setTimeout(() => {
          console.info('⏰ Showing manual fallback link');
          setShowManualLink(true);
        }, 1000);
        
        if (isInIframe) {
          // In iframe: show manual link immediately and try popup
          console.info('🪟 In iframe - showing manual link and attempting popup');
          setShowManualLink(true);
          
          const popup = window.open(url, '_blank', 'noopener,noreferrer');
          if (!popup || popup.closed || typeof popup.closed === 'undefined') {
            console.warn('⚠️ Popup blocked - user must click manual link');
          } else {
            console.info('✅ Popup opened successfully');
          }
        } else {
          // Top-level window: redirect after short delay
          console.info('🔄 Top-level window - redirecting...');
          setTimeout(() => {
            window.location.replace(url);
          }, 50);
        }
      } catch (err) {
        console.error('❌ Checkout error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initiate checkout. Please try again.');
        setIsLoading(false);
      }
    };

    initiateCheckout();
  }, [searchParams, isInIframe]);

  // Show error UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-destructive/5 to-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-md w-full p-8 text-center glass-strong">
            <div className="mx-auto w-20 h-20 mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-destructive">Checkout Error</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => navigate('/pricing')}
                variant="outline"
                className="w-full"
              >
                Back to Pricing
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Show loading UI while checkout is being initiated
  if (isLoading && !showManualLink) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-md w-full p-8 text-center glass-strong">
            <div className="mx-auto w-20 h-20 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Creating checkout session...</h2>
            <p className="text-muted-foreground">
              Setting up your secure payment with Stripe.
            </p>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Show manual link if redirect didn't work
  if (showManualLink && redirectUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="max-w-md w-full p-8 text-center glass-strong">
            <div className="mx-auto w-20 h-20 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <ExternalLink className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Ready to checkout</h2>
            <p className="text-muted-foreground mb-6">
              Click the button below to continue to Stripe's secure checkout.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => window.open(redirectUrl, '_blank', 'noopener,noreferrer')}
                className="w-full"
                size="lg"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Continue to Stripe
              </Button>
              <Button 
                onClick={() => navigate('/pricing')}
                variant="outline"
                className="w-full"
              >
                Back to Pricing
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default CheckoutRedirect;
