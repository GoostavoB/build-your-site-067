-- Grant 5 free starter credits by setting a better default for daily_upload_limit
-- This ensures all new and existing users get 5 free uploads

-- Update the default value for daily_upload_limit column
ALTER TABLE user_xp_tiers 
ALTER COLUMN daily_upload_limit SET DEFAULT 5;

-- Backfill existing users to ensure they have at least 5 credits
UPDATE user_xp_tiers
SET daily_upload_limit = GREATEST(daily_upload_limit, 5)
WHERE daily_upload_limit < 5;

-- Create entries for users who don't have a user_xp_tiers record yet
INSERT INTO user_xp_tiers (
  user_id, 
  current_tier, 
  daily_xp_earned, 
  daily_xp_cap, 
  daily_upload_limit,
  daily_upload_count
)
SELECT 
  u.id, 
  0, 
  0, 
  750, 
  5,  -- 5 free uploads as starter gift
  0
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_xp_tiers WHERE user_id = u.id
)
ON CONFLICT (user_id) DO UPDATE
SET daily_upload_limit = GREATEST(user_xp_tiers.daily_upload_limit, 5);

COMMENT ON COLUMN user_xp_tiers.daily_upload_limit IS 'Daily upload limit - defaults to 5 free uploads for new users';
