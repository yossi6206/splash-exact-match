-- Add additional technical specification columns to laptops table
ALTER TABLE public.laptops
ADD COLUMN IF NOT EXISTS resolution text,
ADD COLUMN IF NOT EXISTS operating_system text,
ADD COLUMN IF NOT EXISTS weight text,
ADD COLUMN IF NOT EXISTS battery text,
ADD COLUMN IF NOT EXISTS connectivity text,
ADD COLUMN IF NOT EXISTS ports text;