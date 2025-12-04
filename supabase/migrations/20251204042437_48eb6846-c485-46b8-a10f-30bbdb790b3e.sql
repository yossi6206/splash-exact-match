-- Create projects table for new construction projects
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  developer_name text NOT NULL,
  location text NOT NULL,
  neighborhood text,
  project_type text NOT NULL DEFAULT 'מגורים',
  listing_type text NOT NULL DEFAULT 'מכירה',
  min_price integer,
  max_price integer,
  min_rooms numeric,
  max_rooms numeric,
  delivery_date text,
  description text,
  images text[],
  features text[],
  amenities text[],
  total_units integer,
  available_units integer,
  floors_count integer,
  buildings_count integer,
  parking_included boolean DEFAULT false,
  storage_included boolean DEFAULT false,
  contact_name text,
  contact_phone text,
  contact_email text,
  website_url text,
  status text NOT NULL DEFAULT 'active',
  views_count integer DEFAULT 0,
  clicks_count integer DEFAULT 0,
  contacts_count integer DEFAULT 0,
  is_promoted boolean DEFAULT false,
  promotion_start_date timestamp with time zone,
  promotion_end_date timestamp with time zone,
  promotion_impressions integer DEFAULT 0,
  last_top_position_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active projects" 
ON public.projects 
FOR SELECT 
USING ((status = 'active') OR (auth.uid() = user_id));

CREATE POLICY "Users can create their own projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON public.projects 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
ON public.projects 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();