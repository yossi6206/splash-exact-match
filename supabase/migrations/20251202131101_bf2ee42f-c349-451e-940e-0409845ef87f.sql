-- Create table for storing user search history
CREATE TABLE public.user_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  search_query TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'all',
  filters JSONB DEFAULT '{}',
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_searches ENABLE ROW LEVEL SECURITY;

-- Users can only view their own searches
CREATE POLICY "Users can view their own searches"
ON public.user_searches
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own searches
CREATE POLICY "Users can create their own searches"
ON public.user_searches
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own searches
CREATE POLICY "Users can delete their own searches"
ON public.user_searches
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_user_searches_user_id ON public.user_searches(user_id);
CREATE INDEX idx_user_searches_created_at ON public.user_searches(created_at DESC);