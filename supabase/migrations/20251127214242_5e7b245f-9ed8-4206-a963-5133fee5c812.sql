-- Create tip_comments table for article comments
CREATE TABLE public.tip_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tip_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  helpful_count INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.tip_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view comments"
ON public.tip_comments
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create comments"
ON public.tip_comments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
ON public.tip_comments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON public.tip_comments
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_tip_comments_updated_at
BEFORE UPDATE ON public.tip_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_tip_comments_tip_id ON public.tip_comments(tip_id);
CREATE INDEX idx_tip_comments_user_id ON public.tip_comments(user_id);