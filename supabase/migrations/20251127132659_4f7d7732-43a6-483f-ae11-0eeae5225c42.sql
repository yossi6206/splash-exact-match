-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  location TEXT NOT NULL,
  rooms INTEGER NOT NULL,
  size INTEGER, -- מ"ר
  floor INTEGER,
  total_floors INTEGER,
  property_type TEXT NOT NULL, -- דירה, בית פרטי, פנטהאוז, דופלקס
  condition TEXT, -- חדש מקבלן, משופץ, דורש שיפוץ
  parking BOOLEAN DEFAULT false,
  elevator BOOLEAN DEFAULT false,
  balcony BOOLEAN DEFAULT false,
  accessible BOOLEAN DEFAULT false,
  images TEXT[],
  features TEXT[],
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active properties"
ON public.properties
FOR SELECT
USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own properties"
ON public.properties
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties"
ON public.properties
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties"
ON public.properties
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create favorite_properties table
CREATE TABLE public.favorite_properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  property_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Enable RLS
ALTER TABLE public.favorite_properties ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own favorites"
ON public.favorite_properties
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites"
ON public.favorite_properties
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites"
ON public.favorite_properties
FOR DELETE
USING (auth.uid() = user_id);