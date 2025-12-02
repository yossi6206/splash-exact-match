-- Create reports table for reporting inappropriate content
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL,
  item_type TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  reporter_id UUID,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create policy for users to create reports
CREATE POLICY "Users can create reports" 
ON public.reports 
FOR INSERT 
WITH CHECK (true);

-- Create policy for users to view their own reports
CREATE POLICY "Users can view their own reports" 
ON public.reports 
FOR SELECT 
USING (reporter_id = auth.uid() OR reporter_id IS NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reports_updated_at
BEFORE UPDATE ON public.reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_reports_item ON public.reports(item_id, item_type);
CREATE INDEX idx_reports_status ON public.reports(status);