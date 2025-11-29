-- Add seller contact information to cars table
ALTER TABLE public.cars 
ADD COLUMN seller_name TEXT,
ADD COLUMN seller_phone TEXT;

-- Add seller contact information to properties table
ALTER TABLE public.properties 
ADD COLUMN seller_name TEXT,
ADD COLUMN seller_phone TEXT;

-- Add seller contact information to laptops table
ALTER TABLE public.laptops 
ADD COLUMN seller_name TEXT,
ADD COLUMN seller_phone TEXT;

-- Add seller contact information to secondhand_items table
ALTER TABLE public.secondhand_items 
ADD COLUMN seller_name TEXT,
ADD COLUMN seller_phone TEXT;