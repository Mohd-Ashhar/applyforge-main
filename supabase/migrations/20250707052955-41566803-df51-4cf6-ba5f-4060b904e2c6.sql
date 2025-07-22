
-- Add subscription plan fields to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS plan text DEFAULT 'Free',
ADD COLUMN IF NOT EXISTS payment_id text,
ADD COLUMN IF NOT EXISTS subscription_start_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS subscription_end_date timestamp with time zone;

-- Create an enum for subscription plans if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.subscription_plan AS ENUM ('Free', 'Basic', 'Pro');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update the plan column to use the enum (after adding the column above)
ALTER TABLE public.profiles 
ALTER COLUMN plan TYPE subscription_plan 
USING plan::subscription_plan;
