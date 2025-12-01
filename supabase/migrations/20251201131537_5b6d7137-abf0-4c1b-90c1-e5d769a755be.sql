-- Add DELETE policies for conversations and messages

-- Allow users to delete conversations they are part of
CREATE POLICY "Users can delete their conversations"
ON public.conversations
FOR DELETE
USING (
  auth.uid() = client_id 
  OR auth.uid() IN (
    SELECT user_id FROM freelancers WHERE id = conversations.freelancer_id
  )
);

-- Allow users to delete messages in their conversations
CREATE POLICY "Users can delete messages in their conversations"
ON public.messages
FOR DELETE
USING (
  conversation_id IN (
    SELECT id FROM conversations 
    WHERE client_id = auth.uid() 
    OR auth.uid() IN (
      SELECT user_id FROM freelancers WHERE id = conversations.freelancer_id
    )
  )
);