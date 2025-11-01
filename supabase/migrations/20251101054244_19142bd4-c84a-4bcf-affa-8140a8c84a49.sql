-- Add unlimited uploads flag to user_settings table
ALTER TABLE public.user_settings 
ADD COLUMN unlimited_uploads BOOLEAN DEFAULT FALSE;

-- Set unlimited uploads for current user
UPDATE public.user_settings 
SET unlimited_uploads = TRUE 
WHERE user_id = 'b09c0877-fce1-478f-9b26-db3e59ca4e15';