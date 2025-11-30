-- Add tracking columns to freelancers table
ALTER TABLE public.freelancers
ADD COLUMN IF NOT EXISTS views_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS clicks_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS contacts_count integer DEFAULT 0;