-- Add color and test_until columns to cars table
ALTER TABLE public.cars 
ADD COLUMN color text,
ADD COLUMN test_until date;