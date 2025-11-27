-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  company_size TEXT,
  industry TEXT,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  job_type TEXT NOT NULL,
  scope TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  experience_min INTEGER,
  experience_max INTEGER,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL,
  nice_to_have TEXT[],
  benefits TEXT[],
  application_process TEXT[],
  status TEXT NOT NULL DEFAULT 'active',
  applicants_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for jobs table
CREATE POLICY "Anyone can view active jobs" 
ON public.jobs 
FOR SELECT 
USING ((status = 'active') OR (auth.uid() = user_id));

CREATE POLICY "Authenticated users can create jobs" 
ON public.jobs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs" 
ON public.jobs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jobs" 
ON public.jobs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  linkedin_url TEXT,
  portfolio_url TEXT,
  resume_url TEXT,
  cover_letter TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for job_applications table
CREATE POLICY "Job owners can view applications for their jobs"
ON public.job_applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = job_applications.job_id
    AND jobs.user_id = auth.uid()
  )
);

CREATE POLICY "Applicants can view their own applications"
ON public.job_applications
FOR SELECT
USING (auth.uid() = applicant_id);

CREATE POLICY "Authenticated users can create applications"
ON public.job_applications
FOR INSERT
WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Applicants can update their own applications"
ON public.job_applications
FOR UPDATE
USING (auth.uid() = applicant_id);

CREATE POLICY "Job owners can update applications status"
ON public.job_applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = job_applications.job_id
    AND jobs.user_id = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();