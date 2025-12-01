-- Add original_price column to favorites table to track price changes
ALTER TABLE public.favorites 
ADD COLUMN original_price numeric;