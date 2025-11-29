-- Create laptops table
CREATE TABLE public.laptops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  processor TEXT,
  ram INTEGER,
  storage INTEGER,
  storage_type TEXT,
  screen_size NUMERIC,
  graphics_card TEXT,
  condition TEXT NOT NULL,
  price INTEGER NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  images TEXT[],
  features TEXT[],
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for laptops
ALTER TABLE public.laptops ENABLE ROW LEVEL SECURITY;

-- RLS policies for laptops
CREATE POLICY "Anyone can view active laptops"
ON public.laptops
FOR SELECT
USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own laptops"
ON public.laptops
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own laptops"
ON public.laptops
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own laptops"
ON public.laptops
FOR DELETE
USING (auth.uid() = user_id);

-- Create secondhand_items table
CREATE TABLE public.secondhand_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  condition TEXT NOT NULL,
  price INTEGER NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  images TEXT[],
  brand TEXT,
  size TEXT,
  color TEXT,
  material TEXT,
  age TEXT,
  features TEXT[],
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for secondhand_items
ALTER TABLE public.secondhand_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for secondhand_items
CREATE POLICY "Anyone can view active secondhand items"
ON public.secondhand_items
FOR SELECT
USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own secondhand items"
ON public.secondhand_items
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own secondhand items"
ON public.secondhand_items
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own secondhand items"
ON public.secondhand_items
FOR DELETE
USING (auth.uid() = user_id);