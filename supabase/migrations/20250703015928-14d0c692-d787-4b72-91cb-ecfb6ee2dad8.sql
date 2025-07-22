
-- Create a table for job search results
CREATE TABLE public.job_search_results (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  company_name text NOT NULL,
  job_role text NOT NULL,
  location text NOT NULL,
  experience_level text NOT NULL,
  job_type text NOT NULL,
  work_type text NOT NULL,
  posted_at text NOT NULL,
  apply_link text NOT NULL,
  search_query jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.job_search_results ENABLE ROW LEVEL SECURITY;

-- Create policies for job search results
CREATE POLICY "Users can view their own job search results" 
  ON public.job_search_results 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own job search results" 
  ON public.job_search_results 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job search results" 
  ON public.job_search_results 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job search results" 
  ON public.job_search_results 
  FOR DELETE 
  USING (auth.uid() = user_id);
