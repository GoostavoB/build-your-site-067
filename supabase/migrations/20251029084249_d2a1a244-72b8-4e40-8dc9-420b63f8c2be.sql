-- Add theme unlock tracking and background customization columns
ALTER TABLE user_customization_preferences 
ADD COLUMN IF NOT EXISTS unlocked_themes TEXT[] DEFAULT ARRAY['default']::TEXT[],
ADD COLUMN IF NOT EXISTS theme_unlock_dates JSONB DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS last_theme_notification_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS theme_studio_opened_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS custom_background TEXT,
ADD COLUMN IF NOT EXISTS background_gradient JSONB;

-- Add comment explaining background_gradient format
COMMENT ON COLUMN user_customization_preferences.background_gradient IS 'Stores gradient configuration: {"type": "linear", "angle": 135, "color1": "#667eea", "color2": "#764ba2"}';

-- Create index for faster theme unlock queries
CREATE INDEX IF NOT EXISTS idx_user_customization_unlocked_themes 
ON user_customization_preferences USING GIN (unlocked_themes);