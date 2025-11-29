-- Add statistics columns to cars table
ALTER TABLE public.cars
ADD COLUMN IF NOT EXISTS views_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS clicks_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS contacts_count integer DEFAULT 0;

-- Add statistics columns to properties table
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS views_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS clicks_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS contacts_count integer DEFAULT 0;

-- Add statistics columns to laptops table
ALTER TABLE public.laptops
ADD COLUMN IF NOT EXISTS views_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS clicks_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS contacts_count integer DEFAULT 0;

-- Add statistics columns to secondhand_items table
ALTER TABLE public.secondhand_items
ADD COLUMN IF NOT EXISTS views_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS clicks_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS contacts_count integer DEFAULT 0;

-- Update jobs table (already has views_count and applicants_count)
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS clicks_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS contacts_count integer DEFAULT 0;