import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Sparkles, Plus, Minus, TrendingUp } from 'lucide-react';
import { UPSELL_CREDIT_PRODUCTS } from '@/config/stripe-products';

interface AnnualUpgradeUpsellProps {
  open: boolean;
  onAccept: (quantity: number) => void;
  onDecline: () => void;
  planName: string;
  annualPrice: number;
}

export const AnnualUpgradeUpsell = ({ 
  open, 
  onAccept, 
  onDecline, 
  planName,
  annualPrice 
}: AnnualUpgradeUpsellProps) => {
  const [quantity, setQuantity] = useState(3); // Default to 3 packs (30 credits)
  const upsellProduct = UPSELL_CREDIT_PRODUCTS.annual_promo;

  const totalCredits = quantity * 10;
  const totalPrice = quantity * upsellProduct.price;
  const totalSavings = quantity * (upsellProduct.originalPrice - upsellProduct.price);
  const grandTotal = annualPrice + totalPrice;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= upsellProduct.maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onDecline}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-2 border-primary/20">
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 p-8 pb-6">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="absolute top-4 right-4"
          >
            <Gift className="h-12 w-12 text-primary opacity-20" />
          </motion.div>

          <DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="mb-4 bg-primary text-primary-foreground px-4 py-1.5 text-xs font-bold">
                🎁 ONE-TIME EXCLUSIVE OFFER
              </Badge>
              <DialogTitle className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-primary" />
                50% Off Extra Credits!
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Upgrade to <strong className="text-foreground">{planName} Annual</strong> and stock up on credits at half price - this offer won't come again!
              </DialogDescription>
            </motion.div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Pricing Comparison */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-muted/50 rounded-lg p-6 border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Regular Price (Pro Members)</p>
                <p className="text-2xl font-bold line-through text-muted-foreground/60">
                  ${upsellProduct.originalPrice.toFixed(2)} <span className="text-sm font-normal">per 10 credits</span>
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                <p className="text-sm text-primary font-semibold mb-1">Annual Upgrade Price</p>
                <p className="text-3xl font-bold text-primary">
                  ${upsellProduct.price.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">per 10 credits</span>
                </p>
              </div>
              <Badge className="bg-accent text-accent-foreground text-lg px-4 py-2">
                50% OFF
              </Badge>
            </div>
          </motion.div>

          {/* Quantity Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="text-sm font-semibold mb-3 block">
              How many credit packs do you want? (1 pack = 10 uploads)
            </label>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="h-12 w-12"
              >
                <Minus className="h-5 w-5" />
              </Button>
              
              <div className="flex-1 text-center bg-muted rounded-lg py-4">
                <motion.div
                  key={quantity}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-1"
                >
                  <p className="text-4xl font-bold">{quantity}</p>
                  <p className="text-sm text-muted-foreground">
                    {totalCredits} credits total
                  </p>
                </motion.div>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= upsellProduct.maxQuantity}
                className="h-12 w-12"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Maximum {upsellProduct.maxQuantity} packs ({upsellProduct.maxQuantity * 10} credits)
            </p>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 space-y-3 border border-primary/20"
          >
            <h4 className="font-semibold text-lg mb-4">Order Summary</h4>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{planName} Annual Subscription</span>
              <span className="font-semibold">${annualPrice.toFixed(2)}/year</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{quantity} × Bonus Credit Packs ({totalCredits} credits)</span>
              <span className="font-semibold">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-accent font-semibold">
              <span>💰 You Save</span>
              <span>${totalSavings.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-border flex justify-between text-lg font-bold">
              <span>Total Today</span>
              <span className="text-primary">${grandTotal.toFixed(2)}</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-3"
          >
            <Button
              onClick={() => onAccept(quantity)}
              size="lg"
              className="w-full text-lg py-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              <Gift className="mr-2 h-5 w-5" />
              Add to My Order - Save ${totalSavings.toFixed(2)}!
            </Button>
            <Button
              onClick={onDecline}
              variant="ghost"
              size="lg"
              className="w-full"
            >
              No Thanks, Continue Without Credits
            </Button>
          </motion.div>

          {/* Features Reminder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border"
          >
            <p className="flex items-center gap-2">
              <span className="text-primary">✓</span> Credits never expire
            </p>
            <p className="flex items-center gap-2">
              <span className="text-primary">✓</span> Use for AI image uploads anytime
            </p>
            <p className="flex items-center gap-2">
              <span className="text-primary">✓</span> This 50% discount is a one-time offer
            </p>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
