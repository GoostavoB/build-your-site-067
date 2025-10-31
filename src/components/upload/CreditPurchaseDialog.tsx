import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Check, Zap, Plus, Minus, TrendingUp, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUploadCredits } from '@/hooks/useUploadCredits';

interface CreditPurchaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchaseComplete: () => void;
}

const CREDIT_PRICE = 0.50; // $0.50 per credit
const PRO_DISCOUNT = 0.20; // 20% discount for PRO users
const MIN_CREDITS = 10;
const CREDIT_INCREMENT = 10;

export const CreditPurchaseDialog = ({
  open,
  onOpenChange,
  onPurchaseComplete,
}: CreditPurchaseDialogProps) => {
  const { toast } = useToast();
  const { purchaseExtraCredits, balance } = useUploadCredits();
  const [creditAmount, setCreditAmount] = useState(MIN_CREDITS);
  const [purchasing, setPurchasing] = useState(false);
  const [showProPromotion, setShowProPromotion] = useState(false);
  
  // TODO: Check user subscription tier (Basic/Pro vs Elite)
  const isPro = false; // Replace with actual subscription check
  
  const pricePerCredit = isPro ? CREDIT_PRICE * (1 - PRO_DISCOUNT) : CREDIT_PRICE;
  const totalPrice = creditAmount * pricePerCredit;
  const proPrice = creditAmount * CREDIT_PRICE * (1 - PRO_DISCOUNT);
  const savings = totalPrice - proPrice;

  const increaseCredits = () => {
    setCreditAmount(prev => prev + CREDIT_INCREMENT);
  };

  const decreaseCredits = () => {
    setCreditAmount(prev => Math.max(MIN_CREDITS, prev - CREDIT_INCREMENT));
  };

  const handlePurchaseClick = () => {
    if (!isPro) {
      setShowProPromotion(true);
    } else {
      handlePurchase();
    }
  };

  const handlePurchase = async () => {
    setPurchasing(true);
    setShowProPromotion(false);
    
    const success = await purchaseExtraCredits(creditAmount, totalPrice);
    
    setPurchasing(false);
    
    if (success) {
      toast({
        title: 'Credits Added Successfully',
        description: `${creditAmount} upload credits have been added to your account.`,
      });
      onPurchaseComplete();
      onOpenChange(false);
      setCreditAmount(MIN_CREDITS);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Purchase Upload Credits</DialogTitle>
            <DialogDescription>
              Select the amount of credits you want to purchase
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Balance</span>
                <span className="text-2xl font-bold">{balance} credits</span>
              </div>
            </div>

            <div className="p-6 rounded-lg border-2 border-primary bg-primary/5">
              {/* Credit Counter */}
              <div className="mb-6">
                <div className="text-sm text-muted-foreground mb-3 text-center">
                  Credits Amount
                </div>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decreaseCredits}
                    disabled={creditAmount <= MIN_CREDITS || purchasing}
                    className="h-12 w-12"
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  
                  <div className="text-center min-w-[120px]">
                    <div className="text-5xl font-bold">{creditAmount}</div>
                    <div className="text-sm text-muted-foreground mt-1">Credits</div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={increaseCredits}
                    disabled={purchasing}
                    className="h-12 w-12"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Price Display */}
              <div className="text-center mb-6 pt-4 border-t">
                <div className="text-4xl font-bold mb-1">
                  ${totalPrice.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  ${pricePerCredit.toFixed(2)} per credit
                </div>
                {!isPro && (
                  <div className="mt-3 text-xs text-amber-600 dark:text-amber-400 font-medium">
                    💡 Save ${savings.toFixed(2)} with PRO (20% off)
                  </div>
                )}
              </div>

              <Button
                onClick={handlePurchaseClick}
                disabled={purchasing}
                className="w-full h-12 text-base"
              >
                {purchasing ? 'Processing...' : `Purchase ${creditAmount} Credits`}
              </Button>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                What you get:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• 1 credit = 1 image analysis</li>
                <li>• Each image can detect up to 10 trades</li>
                <li>• AI-powered trade extraction with 95%+ accuracy</li>
                <li>• Credits never expire</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PRO Promotion Dialog */}
      <AlertDialog open={showProPromotion} onOpenChange={setShowProPromotion}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl">
              <Zap className="h-6 w-6 text-amber-500" />
              Upgrade to PRO & Save More
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 pt-4">
              <div className="text-base text-foreground">
                You're about to pay <span className="font-bold">${CREDIT_PRICE.toFixed(2)} per credit</span>.
              </div>
              
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4 rounded-lg border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground mb-2">
                      With PRO you get:
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span><strong className="text-foreground">20% discount</strong> on all credit purchases (${proPrice.toFixed(2)} instead of ${totalPrice.toFixed(2)})</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Access to <strong className="text-foreground">premium widgets</strong> and analytics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span><strong className="text-foreground">Enhanced XP system</strong> with faster progression</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Priority support and early feature access</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-sm text-center pt-2">
                <span className="text-muted-foreground">This purchase: </span>
                <span className="font-semibold text-foreground">Save ${savings.toFixed(2)} with PRO</span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-col gap-2">
            <AlertDialogAction
              onClick={() => {
                setShowProPromotion(false);
                // TODO: Navigate to upgrade page
                toast({
                  title: 'Upgrade to PRO',
                  description: 'Redirecting to upgrade page...',
                });
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <Zap className="h-4 w-4 mr-2" />
              Upgrade to PRO Now
            </AlertDialogAction>
            <AlertDialogCancel
              onClick={handlePurchase}
              className="w-full"
            >
              Continue with ${totalPrice.toFixed(2)}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
