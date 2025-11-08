import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface OrderDetails {
  id: string;
  amount_total: number;
  currency: string;
  customer_email: string;
  customer_name: string;
  payment_status: string;
  line_items: Array<{
    description: string;
    amount_total: number;
  }>;
  metadata: Record<string, string>;
}

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!sessionId) {
        toast.error('No session ID found');
        navigate('/');
        return;
      }

      try {
        // Get checkout session details
        const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
          'get-checkout-session',
          { body: { sessionId } }
        );

        if (sessionError) throw sessionError;

        const session = sessionData.session;
        setOrderDetails(session);

        // Send confirmation email
        const productType = session.metadata?.productType || 'purchase';
        const { error: emailError } = await supabase.functions.invoke(
          'send-checkout-confirmation',
          {
            body: {
              email: session.customer_email,
              name: session.customer_name,
              productType,
              orderDetails: {
                amount: session.amount_total,
                currency: session.currency,
                items: session.line_items,
                sessionId: session.id,
              },
            },
          }
        );

        if (emailError) {
          console.error('Email sending failed:', emailError);
        } else {
          setEmailSent(true);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [sessionId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your order details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
            <CardDescription>We couldn't find your order details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedAmount = (orderDetails.amount_total / 100).toFixed(2);
  const currencySymbol = orderDetails.currency === 'usd' ? '$' : orderDetails.currency.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold mb-2">Payment Successful!</CardTitle>
            <CardDescription className="text-lg">
              Thank you for your purchase, {orderDetails.customer_name || 'valued customer'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg border-b border-border pb-2">Order Summary</h3>
            
            <div className="space-y-3">
              {orderDetails.line_items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{item.description}</span>
                  <span className="font-medium">
                    {currencySymbol}
                    {((item.amount_total || 0) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
              
              <div className="pt-3 border-t border-border flex justify-between items-center">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-2xl text-primary">
                  {currencySymbol}
                  {formattedAmount}
                </span>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono text-sm font-medium truncate">{orderDetails.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <p className="font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                {orderDetails.payment_status}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{orderDetails.customer_email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Product Type</p>
              <p className="text-sm font-medium">
                {orderDetails.metadata?.productType?.replace('_', ' ') || 'Purchase'}
              </p>
            </div>
          </div>

          {/* Email Confirmation */}
          {emailSent && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Confirmation Email Sent
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Check your inbox at {orderDetails.customer_email} for your order details.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => navigate('/dashboard')}
              className="flex-1"
              size="lg"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              Return Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutSuccess;
