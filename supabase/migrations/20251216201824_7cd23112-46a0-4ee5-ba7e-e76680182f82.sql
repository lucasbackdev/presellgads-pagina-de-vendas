-- Fix search_path for update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix search_path for check_subscription_expiry function
CREATE OR REPLACE FUNCTION public.check_subscription_expiry()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.subscription_expires_at IS NOT NULL AND NEW.subscription_expires_at < NOW() THEN
    NEW.subscription_status = 'expired';
  END IF;
  RETURN NEW;
END;
$$;