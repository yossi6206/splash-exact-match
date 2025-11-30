-- Add listing_type column to properties table
ALTER TABLE properties 
ADD COLUMN listing_type text NOT NULL DEFAULT 'למכירה' 
CHECK (listing_type IN ('למכירה', 'להשכרה'));