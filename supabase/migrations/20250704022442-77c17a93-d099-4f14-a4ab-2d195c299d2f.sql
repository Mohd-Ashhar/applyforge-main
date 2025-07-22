
-- Create a table for saved jobs
CREATE TABLE public.saved_jobs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  job_title text NOT NULL,
  company_name text NOT NULL,
  job_location text NOT NULL,
  job_link text,
  company_linkedin_url text,
  posted_at text NOT NULL,
  apply_url text NOT NULL,
  job_description text,
  seniority_level text,
  employment_type text,
  job_function text,
  industries text,
  saved_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_user_job UNIQUE(user_id, job_link)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for saved jobs
CREATE POLICY "Users can view their own saved jobs" 
  ON public.saved_jobs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved jobs" 
  ON public.saved_jobs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved jobs" 
  ON public.saved_jobs 
  FOR DELETE 
  USING (auth.uid() = user_id);
