-- Add promotion fields to all listing tables

-- Cars table
ALTER TABLE public.cars
ADD COLUMN IF NOT EXISTS is_promoted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS promotion_start_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS promotion_end_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS promotion_impressions integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_top_position_at timestamp with time zone;

-- Properties table
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS is_promoted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS promotion_start_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS promotion_end_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS promotion_impressions integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_top_position_at timestamp with time zone;

-- Businesses table
ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS is_promoted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS promotion_start_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS promotion_end_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS promotion_impressions integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_top_position_at timestamp with time zone;

-- Jobs table
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS is_promoted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS promotion_start_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS promotion_end_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS promotion_impressions integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_top_position_at timestamp with time zone;

-- Freelancers table
ALTER TABLE public.freelancers
ADD COLUMN IF NOT EXISTS is_promoted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS promotion_start_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS promotion_end_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS promotion_impressions integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_top_position_at timestamp with time zone;

-- Laptops table
ALTER TABLE public.laptops
ADD COLUMN IF NOT EXISTS is_promoted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS promotion_start_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS promotion_end_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS promotion_impressions integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_top_position_at timestamp with time zone;

-- Secondhand items table
ALTER TABLE public.secondhand_items
ADD COLUMN IF NOT EXISTS is_promoted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS promotion_start_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS promotion_end_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS promotion_impressions integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_top_position_at timestamp with time zone;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cars_promoted ON public.cars(is_promoted, promotion_end_date, last_top_position_at) WHERE is_promoted = true;
CREATE INDEX IF NOT EXISTS idx_properties_promoted ON public.properties(is_promoted, promotion_end_date, last_top_position_at) WHERE is_promoted = true;
CREATE INDEX IF NOT EXISTS idx_businesses_promoted ON public.businesses(is_promoted, promotion_end_date, last_top_position_at) WHERE is_promoted = true;
CREATE INDEX IF NOT EXISTS idx_jobs_promoted ON public.jobs(is_promoted, promotion_end_date, last_top_position_at) WHERE is_promoted = true;
CREATE INDEX IF NOT EXISTS idx_freelancers_promoted ON public.freelancers(is_promoted, promotion_end_date, last_top_position_at) WHERE is_promoted = true;
CREATE INDEX IF NOT EXISTS idx_laptops_promoted ON public.laptops(is_promoted, promotion_end_date, last_top_position_at) WHERE is_promoted = true;
CREATE INDEX IF NOT EXISTS idx_secondhand_items_promoted ON public.secondhand_items(is_promoted, promotion_end_date, last_top_position_at) WHERE is_promoted = true;