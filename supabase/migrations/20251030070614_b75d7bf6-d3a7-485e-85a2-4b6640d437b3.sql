-- Update trading_goals constraint to match UI goal types
-- Drop the old constraint
ALTER TABLE public.trading_goals 
DROP CONSTRAINT IF EXISTS trading_goals_goal_type_check;

-- Add new constraint with correct values matching the UI
ALTER TABLE public.trading_goals 
ADD CONSTRAINT trading_goals_goal_type_check 
CHECK (goal_type = ANY (ARRAY['profit'::text, 'win_rate'::text, 'trades'::text, 'streak'::text, 'roi'::text]));

-- Update any existing 'pnl' values to 'profit' for consistency
UPDATE public.trading_goals 
SET goal_type = 'profit' 
WHERE goal_type = 'pnl';