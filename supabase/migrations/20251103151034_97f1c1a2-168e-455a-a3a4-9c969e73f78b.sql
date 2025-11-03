-- Create RPC function to increment upload credits (used by Stripe webhook)
CREATE OR REPLACE FUNCTION increment_upload_credits(p_user_id UUID, p_credits INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE subscriptions
  SET 
    upload_credits_balance = COALESCE(upload_credits_balance, 0) + p_credits,
    extra_credits_purchased = COALESCE(extra_credits_purchased, 0) + p_credits
  WHERE user_id = p_user_id;
  
  -- If no subscription exists, create one with the credits
  IF NOT FOUND THEN
    INSERT INTO subscriptions (
      user_id,
      plan_type,
      status,
      upload_credits_balance,
      extra_credits_purchased,
      monthly_upload_limit
    )
    VALUES (
      p_user_id,
      'basic',
      'active',
      p_credits,
      p_credits,
      0
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;