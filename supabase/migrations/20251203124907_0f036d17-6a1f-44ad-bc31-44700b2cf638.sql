-- Add street and house_number columns to properties table
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS street text;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS house_number text;