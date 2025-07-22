
-- Create a table for cover letters
CREATE TABLE public.cover_letters (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  job_description text NOT NULL,
  company_name text NOT NULL,
  position_title text NOT NULL,
  cover_letter_url text NOT NULL,
  file_type text NOT NULL DEFAULT 'pdf',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

-- Create policies for cover letters
CREATE POLICY "Users can view their own cover letters" 
  ON public.cover_letters 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cover letters" 
  ON public.cover_letters 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cover letters" 
  ON public.cover_letters 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cover letters" 
  ON public.cover_letters 
  FOR DELETE 
  USING (auth.uid() = user_id);
