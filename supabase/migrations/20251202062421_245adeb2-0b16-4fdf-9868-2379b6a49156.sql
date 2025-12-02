-- Add verified_seller field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN verified_seller boolean DEFAULT false;

-- Create index for better performance
CREATE INDEX idx_profiles_verified_seller ON public.profiles(verified_seller);

COMMENT ON COLUMN public.profiles.verified_seller IS 'Indicates if the seller is verified and trusted on the platform';