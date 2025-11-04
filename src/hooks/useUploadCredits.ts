import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadCredits {
  balance: number;
  used: number;
  limit: number;
  extraPurchased: number;
  canUpload: boolean;
  isLoading: boolean;
}

export const useUploadCredits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [credits, setCredits] = useState<UploadCredits>({
    balance: 0,
    used: 0,
    limit: 0,
    extraPurchased: 0,
    canUpload: false,
    isLoading: true,
  });

  const fetchCredits = async () => {
    if (!user) {
      setCredits({
        balance: 0,
        used: 0,
        limit: 0,
        extraPurchased: 0,
        canUpload: false,
        isLoading: false,
      });
      return;
    }

    try {
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('upload_credits_balance, upload_credits_used_this_month, monthly_upload_limit, extra_credits_purchased')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        setCredits({
          balance: 0,
          used: 0,
          limit: 0,
          extraPurchased: 0,
          canUpload: false,
          isLoading: false,
        });
        return;
      }

      if (!subscription) {
        setCredits({
          balance: 0,
          used: 0,
          limit: 0,
          extraPurchased: 0,
          canUpload: false,
          isLoading: false,
        });
        return;
      }

      const balance = subscription.upload_credits_balance ?? 0;
      const used = subscription.upload_credits_used_this_month ?? 0;
      const limit = subscription.monthly_upload_limit ?? 0;
      const extra = subscription.extra_credits_purchased ?? 0;

      console.log('[Credits] Fetched from subscriptions:', { balance, used, limit, extra });

      setCredits({
        balance,
        used,
        limit,
        extraPurchased: extra,
        canUpload: balance > 0,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking upload credits:', error);
      setCredits({
        balance: 0,
        used: 0,
        limit: 0,
        extraPurchased: 0,
        canUpload: false,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [user]);

  const deductCredit = async (): Promise<boolean> => {
    if (!user) return false;

    if (credits.balance <= 0) {
      toast({
        title: 'No Credits Available',
        description: 'You have no credits. Buy more or upgrade to Pro.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const { data, error } = await supabase.rpc('deduct_upload_credit', {
        p_user_id: user.id,
      });

      if (error) {
        console.error('Error deducting credit:', error);
        toast({
          title: 'Error',
          description: 'Failed to process upload credit. Please try again.',
          variant: 'destructive',
        });
        return false;
      }

      const result = data as { success: boolean; error?: string; message?: string; remaining_balance?: number };
      
      if (!result.success) {
        toast({
          title: 'No Credits Available',
          description: result.message || 'You have used all your upload credits.',
          variant: 'destructive',
        });
        return false;
      }

      await fetchCredits();
      return true;
    } catch (error) {
      console.error('Error deducting credit:', error);
      toast({
        title: 'Error',
        description: 'Failed to process upload credit. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const purchaseExtraCredits = async (creditsAmount: number, amount: number): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('add_extra_credits', {
        p_user_id: user.id,
        p_credits: creditsAmount,
        p_amount: amount,
      });

      if (error || !data) {
        toast({
          title: 'Purchase Failed',
          description: 'Failed to add extra credits. Please try again.',
          variant: 'destructive',
        });
        return false;
      }

      toast({
        title: 'Credits Added',
        description: `${creditsAmount} upload credits have been added to your account.`,
      });

      await fetchCredits();
      return true;
    } catch (error) {
      console.error('Error purchasing credits:', error);
      toast({
        title: 'Error',
        description: 'Failed to purchase credits. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    ...credits,
    deductCredit,
    purchaseExtraCredits,
    refetch: fetchCredits,
  };
};
