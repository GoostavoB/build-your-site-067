-- Create XP boosts table
CREATE TABLE IF NOT EXISTS public.xp_boosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  multiplier NUMERIC NOT NULL DEFAULT 1.0,
  duration_minutes INTEGER NOT NULL,
  activated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.xp_boosts ENABLE ROW LEVEL SECURITY;

-- XP boosts policies
CREATE POLICY "Users can view their own XP boosts"
ON public.xp_boosts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own XP boosts"
ON public.xp_boosts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for active boosts query
CREATE INDEX IF NOT EXISTS idx_xp_boosts_active 
ON public.xp_boosts(user_id, is_active, expires_at);

-- Create add_xp RPC function if it doesn't exist
CREATE OR REPLACE FUNCTION public.add_xp(
  user_uuid UUID,
  xp_amount INTEGER
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_xp_levels (user_id, total_xp_earned)
  VALUES (user_uuid, xp_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET 
    total_xp_earned = user_xp_levels.total_xp_earned + xp_amount,
    updated_at = now();
END;
$$;