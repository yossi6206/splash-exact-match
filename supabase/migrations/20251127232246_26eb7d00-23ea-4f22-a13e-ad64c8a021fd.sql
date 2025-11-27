-- Create freelancers table
CREATE TABLE public.freelancers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  title TEXT NOT NULL,
  bio TEXT,
  skills TEXT[] NOT NULL,
  hourly_rate INTEGER NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  location TEXT,
  experience_years INTEGER,
  availability TEXT DEFAULT 'available',
  portfolio_url TEXT,
  languages TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.freelancers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view available freelancers" 
ON public.freelancers 
FOR SELECT 
USING (availability = 'available' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own freelancer profile" 
ON public.freelancers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own freelancer profile" 
ON public.freelancers 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own freelancer profile" 
ON public.freelancers 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_freelancers_updated_at
BEFORE UPDATE ON public.freelancers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();