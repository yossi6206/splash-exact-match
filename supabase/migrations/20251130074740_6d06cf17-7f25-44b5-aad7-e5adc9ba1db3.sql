-- Create businesses table
CREATE TABLE public.businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  business_type TEXT NOT NULL, -- קפה/מסעדה, חנות, משרד, וכו'
  category TEXT NOT NULL, -- מזון ומשקאות, קמעונאי, שירותים, וכו'
  price INTEGER NOT NULL,
  location TEXT NOT NULL,
  annual_revenue INTEGER,
  monthly_profit INTEGER,
  years_operating INTEGER,
  employees_count INTEGER,
  reasons_for_sale TEXT,
  includes TEXT[], -- מה כלול במכירה: ציוד, מלאי, וכו'
  images TEXT[],
  status TEXT NOT NULL DEFAULT 'active',
  views_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  contacts_count INTEGER DEFAULT 0,
  seller_name TEXT,
  seller_phone TEXT,
  lease_details TEXT, -- פרטי חוזה שכירות
  lease_monthly_cost INTEGER,
  lease_expiry_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active businesses"
ON public.businesses
FOR SELECT
USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own businesses"
ON public.businesses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own businesses"
ON public.businesses
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own businesses"
ON public.businesses
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_businesses_updated_at
BEFORE UPDATE ON public.businesses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();