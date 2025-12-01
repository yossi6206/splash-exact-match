-- Update profiles RLS policy to allow viewing basic profile info in conversations
-- Users can view profile info of people they have conversations with
CREATE POLICY "Users can view profiles in their conversations"
ON profiles
FOR SELECT
USING (
  auth.uid() = id 
  OR 
  -- User can see profiles of people they chat with (as client or freelancer)
  id IN (
    -- Profiles of freelancers user is chatting with
    SELECT f.user_id 
    FROM conversations c 
    JOIN freelancers f ON f.id = c.freelancer_id
    WHERE c.client_id = auth.uid()
    
    UNION
    
    -- Profiles of clients chatting with user's freelancer profile
    SELECT c.client_id 
    FROM conversations c 
    JOIN freelancers f ON f.id = c.freelancer_id
    WHERE f.user_id = auth.uid()
  )
);