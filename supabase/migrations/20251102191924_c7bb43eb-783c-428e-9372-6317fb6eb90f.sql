-- Add onboarding_completed column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding 
ON public.profiles(onboarding_completed) 
WHERE onboarding_completed = false;

-- Add comment
COMMENT ON COLUMN public.profiles.onboarding_completed IS 'Tracks whether user has completed the initial onboarding flow';