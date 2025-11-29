-- Add missing fields to cars table for consistency
ALTER TABLE public.cars
ADD COLUMN IF NOT EXISTS manufacturer TEXT,
ADD COLUMN IF NOT EXISTS fuel_type TEXT,
ADD COLUMN IF NOT EXISTS transmission TEXT,
ADD COLUMN IF NOT EXISTS vehicle_type TEXT DEFAULT 'רכב פרטי',
ADD COLUMN IF NOT EXISTS condition TEXT,
ADD COLUMN IF NOT EXISTS category TEXT;

-- Add similar fields to properties table
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS year INTEGER;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cars_manufacturer ON public.cars(manufacturer);
CREATE INDEX IF NOT EXISTS idx_cars_fuel_type ON public.cars(fuel_type);
CREATE INDEX IF NOT EXISTS idx_cars_transmission ON public.cars(transmission);
CREATE INDEX IF NOT EXISTS idx_properties_year ON public.properties(year);