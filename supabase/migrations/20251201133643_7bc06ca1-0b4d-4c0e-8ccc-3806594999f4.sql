-- Add edited_at column to track message edits
ALTER TABLE public.messages 
ADD COLUMN edited_at timestamp with time zone;