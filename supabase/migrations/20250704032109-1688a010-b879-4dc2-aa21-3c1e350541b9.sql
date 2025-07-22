
-- Update cover_letters table to store generated cover letters properly
ALTER TABLE public.cover_letters 
ADD COLUMN IF NOT EXISTS original_resume_name text,
ADD COLUMN IF NOT EXISTS generated_at timestamp with time zone DEFAULT now();

-- Create index for better performance on user queries
CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON public.cover_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_generated_at ON public.cover_letters(user_id, generated_at DESC);
