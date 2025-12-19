-- Create enum for subscription plans
CREATE TYPE public.subscription_plan AS ENUM ('free', 'monthly', 'annual');

-- Create enum for subscription status
CREATE TYPE public.subscription_status AS ENUM ('pending', 'active', 'paused', 'expired', 'cancelled');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  subscription_plan subscription_plan DEFAULT 'free',
  subscription_status subscription_status DEFAULT 'pending',
  subscription_activated_at TIMESTAMPTZ,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Admin can update all profiles
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Admin can view all roles
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Users can view their own role
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-expire subscriptions
CREATE OR REPLACE FUNCTION public.check_subscription_expiry()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.subscription_expires_at IS NOT NULL AND NEW.subscription_expires_at < NOW() THEN
    NEW.subscription_status = 'expired';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_subscription_expiry_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.check_subscription_expiry();