-- Add user_type column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_type text CHECK (user_type IN ('buyer', 'seller', 'freelancer', 'service_seeker'));

-- Add comment to explain the column
COMMENT ON COLUMN public.profiles.user_type IS 'Type of user: buyer (קונה), seller (מוכר), freelancer (פרילנסר), service_seeker (מחפש שירותים)';