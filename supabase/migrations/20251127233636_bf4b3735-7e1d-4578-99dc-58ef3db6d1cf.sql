-- Create freelancer_reviews table
CREATE TABLE public.freelancer_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  freelancer_id UUID NOT NULL REFERENCES public.freelancers(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  project_type TEXT,
  work_quality_rating INTEGER CHECK (work_quality_rating >= 1 AND work_quality_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  professionalism_rating INTEGER CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
  deadline_rating INTEGER CHECK (deadline_rating >= 1 AND deadline_rating <= 5),
  helpful_count INTEGER DEFAULT 0,
  verified_client BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.freelancer_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view reviews"
ON public.freelancer_reviews
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create reviews"
ON public.freelancer_reviews
FOR INSERT
WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews"
ON public.freelancer_reviews
FOR UPDATE
USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete their own reviews"
ON public.freelancer_reviews
FOR DELETE
USING (auth.uid() = reviewer_id);

-- Create trigger for updated_at
CREATE TRIGGER update_freelancer_reviews_updated_at
BEFORE UPDATE ON public.freelancer_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update freelancer rating
CREATE OR REPLACE FUNCTION public.update_freelancer_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.freelancers
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.freelancer_reviews
      WHERE freelancer_id = COALESCE(NEW.freelancer_id, OLD.freelancer_id)
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.freelancer_reviews
      WHERE freelancer_id = COALESCE(NEW.freelancer_id, OLD.freelancer_id)
    )
  WHERE id = COALESCE(NEW.freelancer_id, OLD.freelancer_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger to auto-update freelancer rating
CREATE TRIGGER update_freelancer_rating_on_review_change
AFTER INSERT OR UPDATE OR DELETE ON public.freelancer_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_freelancer_rating();

-- Create review_helpful table for marking reviews as helpful
CREATE TABLE public.freelancer_review_helpful (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES public.freelancer_reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(review_id, user_id)
);

-- Enable RLS
ALTER TABLE public.freelancer_review_helpful ENABLE ROW LEVEL SECURITY;

-- RLS Policies for helpful votes
CREATE POLICY "Anyone can view helpful votes"
ON public.freelancer_review_helpful
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can add helpful votes"
ON public.freelancer_review_helpful
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their helpful votes"
ON public.freelancer_review_helpful
FOR DELETE
USING (auth.uid() = user_id);