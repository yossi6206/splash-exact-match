-- Add new columns to secondhand_items table for enhanced filtering and better user experience

ALTER TABLE public.secondhand_items
ADD COLUMN IF NOT EXISTS warranty TEXT,
ADD COLUMN IF NOT EXISTS delivery_available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS negotiable BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS year_manufactured INTEGER,
ADD COLUMN IF NOT EXISTS dimensions TEXT,
ADD COLUMN IF NOT EXISTS weight TEXT;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_secondhand_items_subcategory ON public.secondhand_items(subcategory);
CREATE INDEX IF NOT EXISTS idx_secondhand_items_brand ON public.secondhand_items(brand);
CREATE INDEX IF NOT EXISTS idx_secondhand_items_size ON public.secondhand_items(size);
CREATE INDEX IF NOT EXISTS idx_secondhand_items_price ON public.secondhand_items(price);
CREATE INDEX IF NOT EXISTS idx_secondhand_items_delivery ON public.secondhand_items(delivery_available);
CREATE INDEX IF NOT EXISTS idx_secondhand_items_negotiable ON public.secondhand_items(negotiable);

COMMENT ON COLUMN public.secondhand_items.warranty IS 'Warranty information for the item';
COMMENT ON COLUMN public.secondhand_items.delivery_available IS 'Whether the seller offers delivery';
COMMENT ON COLUMN public.secondhand_items.negotiable IS 'Whether the price is negotiable';
COMMENT ON COLUMN public.secondhand_items.year_manufactured IS 'Year the item was manufactured';
COMMENT ON COLUMN public.secondhand_items.dimensions IS 'Dimensions of the item (e.g., 200x100x80 cm)';
COMMENT ON COLUMN public.secondhand_items.weight IS 'Weight of the item';