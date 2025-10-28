-- Create user_daily_activity table
CREATE TABLE public.user_daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Activity progress tracking
  trades_uploaded INTEGER DEFAULT 0,
  emotional_logs_created INTEGER DEFAULT 0,
  journal_entries_created INTEGER DEFAULT 0,
  challenges_completed INTEGER DEFAULT 0,
  
  -- Reminder interaction tracking
  last_reminder_shown_at TIMESTAMP WITH TIME ZONE,
  reminder_clicked_count INTEGER DEFAULT 0,
  widget_interaction_count INTEGER DEFAULT 0,
  
  -- Performance metadata
  xp_earned_today INTEGER DEFAULT 0,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

-- Enable RLS
ALTER TABLE public.user_daily_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily activity"
  ON public.user_daily_activity FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily activity"
  ON public.user_daily_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily activity"
  ON public.user_daily_activity FOR UPDATE
  USING (auth.uid() = user_id);

-- Auto-update last_updated_at
CREATE TRIGGER update_daily_activity_timestamp
  BEFORE UPDATE ON public.user_daily_activity
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Extend user_xp_tiers table
ALTER TABLE public.user_xp_tiers
ADD COLUMN IF NOT EXISTS reminder_intensity TEXT DEFAULT 'normal' 
  CHECK (reminder_intensity IN ('minimal', 'normal', 'aggressive')),
ADD COLUMN IF NOT EXISTS last_login_date DATE,
ADD COLUMN IF NOT EXISTS last_login_timezone TEXT DEFAULT 'UTC';

-- Create helper function for upserting daily activity
CREATE OR REPLACE FUNCTION upsert_daily_activity(
  p_user_id UUID,
  p_activity_type TEXT,
  p_increment INTEGER DEFAULT 1
) RETURNS void AS $$
BEGIN
  INSERT INTO public.user_daily_activity (
    user_id,
    activity_date,
    trades_uploaded,
    emotional_logs_created,
    journal_entries_created
  )
  VALUES (
    p_user_id,
    CURRENT_DATE,
    CASE WHEN p_activity_type = 'trades' THEN p_increment ELSE 0 END,
    CASE WHEN p_activity_type = 'emotional_logs' THEN p_increment ELSE 0 END,
    CASE WHEN p_activity_type = 'journal' THEN p_increment ELSE 0 END
  )
  ON CONFLICT (user_id, activity_date)
  DO UPDATE SET
    trades_uploaded = user_daily_activity.trades_uploaded + 
      CASE WHEN p_activity_type = 'trades' THEN p_increment ELSE 0 END,
    emotional_logs_created = user_daily_activity.emotional_logs_created + 
      CASE WHEN p_activity_type = 'emotional_logs' THEN p_increment ELSE 0 END,
    journal_entries_created = user_daily_activity.journal_entries_created + 
      CASE WHEN p_activity_type = 'journal' THEN p_increment ELSE 0 END,
    last_updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;