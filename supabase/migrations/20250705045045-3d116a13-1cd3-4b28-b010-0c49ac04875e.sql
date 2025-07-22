
-- Create applied_jobs table to track jobs that users have applied to
CREATE TABLE public.applied_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  job_location TEXT NOT NULL,
  job_description TEXT,
  apply_url TEXT NOT NULL,
  job_link TEXT,
  company_linkedin_url TEXT,
  posted_at TEXT NOT NULL,
  seniority_level TEXT,
  employment_type TEXT,
  job_function TEXT,
  industries TEXT,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.applied_jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own applied jobs" 
  ON public.applied_jobs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applied jobs" 
  ON public.applied_jobs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applied jobs" 
  ON public.applied_jobs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applied jobs" 
  ON public.applied_jobs 
  FOR DELETE 
  USING (auth.uid() = user_id);
