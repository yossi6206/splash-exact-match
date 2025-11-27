-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create trigger to auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create cars table for listings
CREATE TABLE public.cars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  model TEXT NOT NULL,
  description TEXT,
  year INTEGER NOT NULL,
  km INTEGER NOT NULL,
  hand INTEGER NOT NULL,
  location TEXT NOT NULL,
  price TEXT,
  features TEXT[],
  images TEXT[],
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on cars
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Cars policies
CREATE POLICY "Anyone can view active cars"
  ON public.cars FOR SELECT
  USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own cars"
  ON public.cars FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cars"
  ON public.cars FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cars"
  ON public.cars FOR DELETE
  USING (auth.uid() = user_id);

-- Create favorite_cars table
CREATE TABLE public.favorite_cars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  car_id UUID NOT NULL REFERENCES public.cars ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, car_id)
);

-- Enable RLS on favorite_cars
ALTER TABLE public.favorite_cars ENABLE ROW LEVEL SECURITY;

-- Favorite cars policies
CREATE POLICY "Users can view their own favorites"
  ON public.favorite_cars FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites"
  ON public.favorite_cars FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites"
  ON public.favorite_cars FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_cars_user_id ON public.cars(user_id);
CREATE INDEX idx_cars_status ON public.cars(status);
CREATE INDEX idx_favorite_cars_user_id ON public.favorite_cars(user_id);
CREATE INDEX idx_favorite_cars_car_id ON public.favorite_cars(car_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON public.cars
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();