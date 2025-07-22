
-- Update the job_search_results table to handle the new response format
ALTER TABLE public.job_search_results 
ADD COLUMN job_link text,
ADD COLUMN company_linkedin_url text,
ADD COLUMN salary_info jsonb,
ADD COLUMN applicants_count text,
ADD COLUMN job_description text,
ADD COLUMN seniority_level text,
ADD COLUMN employment_type text,
ADD COLUMN job_function text,
ADD COLUMN industries text;

-- Update existing columns to match new response format
ALTER TABLE public.job_search_results 
RENAME COLUMN job_role TO job_title;

-- Make some columns nullable since they might not always be present
ALTER TABLE public.job_search_results 
ALTER COLUMN job_link DROP NOT NULL,
ALTER COLUMN company_linkedin_url DROP NOT NULL,
ALTER COLUMN salary_info DROP NOT NULL,
ALTER COLUMN applicants_count DROP NOT NULL,
ALTER COLUMN job_description DROP NOT NULL,
ALTER COLUMN seniority_level DROP NOT NULL,
ALTER COLUMN employment_type DROP NOT NULL,
ALTER COLUMN job_function DROP NOT NULL,
ALTER COLUMN industries DROP NOT NULL;
