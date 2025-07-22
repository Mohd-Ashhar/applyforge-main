
-- Add subscription plan fields to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS plan text DEFAULT 'Free',
ADD COLUMN IF NOT EXISTS payment_id text,
ADD COLUMN IF NOT EXISTS subscription_start_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS subscription_end_date timestamp with time zone;

-- Create an enum for subscription plans
CREATE TYPE public.subscription_plan AS ENUM ('Free', 'Basic', 'Pro');

-- Update the plan column to use the enum (after adding the column above)
ALTER TABLE public.profiles 
ALTER COLUMN plan TYPE subscription_plan 
USING plan::subscription_plan;

-- Create a payments table to track payment history
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  razorpay_payment_id text NOT NULL,
  razorpay_order_id text NOT NULL,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  plan subscription_plan NOT NULL,
  status text NOT NULL DEFAULT 'completed',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for payments
CREATE POLICY "Users can view their own payments" 
  ON public.payments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" 
  ON public.payments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
