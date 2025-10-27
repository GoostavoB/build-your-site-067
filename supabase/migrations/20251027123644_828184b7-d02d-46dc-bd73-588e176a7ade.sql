-- Insert subscription with infinite credits for gustavo.belfiore@gmail.com
INSERT INTO public.subscriptions (
  user_id,
  plan_type,
  status,
  billing_cycle,
  current_period_start,
  current_period_end,
  upload_credits_balance,
  upload_credits_used_this_month,
  monthly_upload_limit,
  extra_credits_purchased,
  cancel_at_period_end,
  connected_accounts_limit,
  custom_metrics_limit
) VALUES (
  'e019b392-2eb3-4b82-8e92-bbb8f502560b',
  'elite',
  'active',
  'annual',
  NOW(),
  '2099-12-31 23:59:59',
  999999,
  0,
  999999,
  0,
  false,
  999,
  999
)
ON CONFLICT (user_id) 
DO UPDATE SET
  upload_credits_balance = 999999,
  monthly_upload_limit = 999999,
  plan_type = 'elite',
  status = 'active',
  current_period_end = '2099-12-31 23:59:59';

-- Update deduct_upload_credit function to whitelist admin account
CREATE OR REPLACE FUNCTION public.deduct_upload_credit(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_credits_available INTEGER;
BEGIN
  -- Whitelist for admin account - never deduct credits
  IF p_user_id = 'e019b392-2eb3-4b82-8e92-bbb8f502560b' THEN
    RETURN true;
  END IF;

  -- Check available credits for other users
  SELECT upload_credits_balance INTO v_credits_available
  FROM public.subscriptions
  WHERE user_id = p_user_id
  AND status = 'active';

  IF v_credits_available IS NULL OR v_credits_available <= 0 THEN
    RETURN false;
  END IF;

  -- Deduct credit
  UPDATE public.subscriptions
  SET 
    upload_credits_balance = upload_credits_balance - 1,
    upload_credits_used_this_month = upload_credits_used_this_month + 1
  WHERE user_id = p_user_id
  AND status = 'active';

  RETURN true;
END;
$$;