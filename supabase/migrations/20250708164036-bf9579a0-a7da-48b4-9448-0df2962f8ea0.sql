
-- Update the user_usage table to include the missing ats_checks_used column and ensure proper structure
ALTER TABLE public.user_usage ADD COLUMN IF NOT EXISTS ats_checks_used integer DEFAULT 0;

-- Add RLS policies for user_usage table
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own usage data
CREATE POLICY "Users can view their own usage data" 
  ON public.user_usage 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own usage data
CREATE POLICY "Users can create their own usage data" 
  ON public.user_usage 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own usage data
CREATE POLICY "Users can update their own usage data" 
  ON public.user_usage 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create a function to initialize user usage when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_usage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_usage (user_id, plan_type)
  VALUES (NEW.id, 'Free');
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create usage record for new users
DROP TRIGGER IF EXISTS on_auth_user_created_usage ON auth.users;
CREATE TRIGGER on_auth_user_created_usage
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_usage();
