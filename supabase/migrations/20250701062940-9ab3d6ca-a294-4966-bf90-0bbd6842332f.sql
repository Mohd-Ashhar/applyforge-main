
-- Create a table for storing tailored resumes
CREATE TABLE public.tailored_resumes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  job_description TEXT NOT NULL,
  resume_data TEXT NOT NULL, -- base64 encoded resume data
  file_type TEXT NOT NULL DEFAULT 'pdf', -- pdf or docx
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title TEXT -- optional title for the resume
);

-- Add Row Level Security (RLS)
ALTER TABLE public.tailored_resumes ENABLE ROW LEVEL SECURITY;

-- Create policies for users to manage their own tailored resumes
CREATE POLICY "Users can view their own tailored resumes" 
  ON public.tailored_resumes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tailored resumes" 
  ON public.tailored_resumes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tailored resumes" 
  ON public.tailored_resumes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tailored resumes" 
  ON public.tailored_resumes 
  FOR DELETE 
  USING (auth.uid() = user_id);
