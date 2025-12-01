-- Create a universal favorites table
CREATE TABLE public.favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  item_id uuid NOT NULL,
  item_type text NOT NULL, -- 'car', 'property', 'laptop', 'job', 'freelancer', 'business', 'secondhand'
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_id, item_type)
);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own favorites"
ON public.favorites
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites"
ON public.favorites
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites"
ON public.favorites
FOR DELETE
USING (auth.uid() = user_id);

-- Migrate existing data from favorite_cars
INSERT INTO public.favorites (user_id, item_id, item_type, created_at)
SELECT user_id, car_id::uuid, 'car', created_at
FROM public.favorite_cars
ON CONFLICT (user_id, item_id, item_type) DO NOTHING;

-- Migrate existing data from favorite_properties
INSERT INTO public.favorites (user_id, item_id, item_type, created_at)
SELECT user_id, property_id::uuid, 'property', created_at
FROM public.favorite_properties
ON CONFLICT (user_id, item_id, item_type) DO NOTHING;