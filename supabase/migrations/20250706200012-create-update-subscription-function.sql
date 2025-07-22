
-- Create a function to update user subscription
CREATE OR REPLACE FUNCTION update_user_subscription(
  user_id uuid,
  new_plan subscription_plan,
  payment_id text,
  start_date timestamp with time zone,
  end_date timestamp with time zone
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    plan = new_plan,
    payment_id = payment_id,
    subscription_start_date = start_date,
    subscription_end_date = end_date,
    updated_at = now()
  WHERE id = user_id;
END;
$$;
