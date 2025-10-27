-- Create user_events table for granular analytics tracking
CREATE TABLE public.user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Index for fast queries by user and event type
CREATE INDEX idx_user_events_user_id ON public.user_events(user_id);
CREATE INDEX idx_user_events_type ON public.user_events(event_type);
CREATE INDEX idx_user_events_created_at ON public.user_events(created_at DESC);

-- Enable RLS
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

-- Users can view their own events
CREATE POLICY "Users can view own events"
ON public.user_events FOR SELECT
USING (auth.uid() = user_id);

-- Service role can insert events
CREATE POLICY "Service can insert events"
ON public.user_events FOR INSERT
WITH CHECK (true);

-- Create streak_reminder_log table for notification tracking
CREATE TABLE public.streak_reminder_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reminder_count INTEGER DEFAULT 0,
  last_reminder_sent_at TIMESTAMP WITH TIME ZONE,
  notification_paused BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP WITH TIME ZONE,
  message_variant TEXT DEFAULT 'default',
  clicked BOOLEAN DEFAULT false,
  clicked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Index for fast user lookups
CREATE UNIQUE INDEX idx_streak_reminder_log_user ON public.streak_reminder_log(user_id);

-- Enable RLS
ALTER TABLE public.streak_reminder_log ENABLE ROW LEVEL SECURITY;

-- Users can view own reminder log
CREATE POLICY "Users can view own reminder log"
ON public.streak_reminder_log FOR SELECT
USING (auth.uid() = user_id);

-- Service role can manage reminder log
CREATE POLICY "Service can manage reminder log"
ON public.streak_reminder_log FOR ALL
USING (true);

-- Add dual streak tracking to user_progression
ALTER TABLE public.user_progression
ADD COLUMN IF NOT EXISTS login_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS trade_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_login_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS last_trade_date DATE,
ADD COLUMN IF NOT EXISTS combo_bonus_awarded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_reengagement_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS reengagement_cooldown_until TIMESTAMP WITH TIME ZONE;

-- Migrate existing daily_streak to login_streak
UPDATE public.user_progression
SET login_streak = daily_streak
WHERE login_streak = 0 AND daily_streak > 0;

-- Add streak preferences to user_settings
ALTER TABLE public.user_settings
ADD COLUMN IF NOT EXISTS streak_reminders_enabled BOOLEAN DEFAULT NULL,
ADD COLUMN IF NOT EXISTS last_streak_milestone INTEGER DEFAULT 0;