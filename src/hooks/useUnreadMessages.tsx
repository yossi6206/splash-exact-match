import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useUnreadMessages = (userId: string | undefined) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const loadUnreadCount = async () => {
      // Get user's freelancer profile if exists
      const { data: freelancerData } = await supabase
        .from("freelancers")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      // Build query for conversations
      let conversationsQuery = supabase
        .from("conversations")
        .select("id");

      if (freelancerData) {
        // User has freelancer profile - get conversations as both client and freelancer
        conversationsQuery = conversationsQuery.or(
          `client_id.eq.${userId},freelancer_id.eq.${freelancerData.id}`
        );
      } else {
        // User only as client
        conversationsQuery = conversationsQuery.eq("client_id", userId);
      }

      const { data: conversations } = await conversationsQuery;

      if (!conversations || conversations.length === 0) return;

      const conversationIds = conversations.map((c) => c.id);

      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .in("conversation_id", conversationIds)
        .eq("is_read", false)
        .neq("sender_id", userId);

      setUnreadCount(count || 0);
    };

    loadUnreadCount();

    // Subscribe to new messages
    const channel = supabase
      .channel("unread-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const newMessage = payload.new as any;
          
          // Get user's freelancer profile if exists
          const { data: freelancerData } = await supabase
            .from("freelancers")
            .select("id")
            .eq("user_id", userId)
            .maybeSingle();

          // Check if message is for this user
          const { data: conversation } = await supabase
            .from("conversations")
            .select("*, freelancers!inner(user_id)")
            .eq("id", newMessage.conversation_id)
            .maybeSingle();

          if (!conversation) return;

          const isRecipientAsClient = conversation.client_id === userId;
          const isRecipientAsFreelancer = 
            freelancerData && 
            conversation.freelancer_id === freelancerData.id;
          
          const isRecipient = isRecipientAsClient || isRecipientAsFreelancer;
          const isSender = newMessage.sender_id === userId;

          if (isRecipient && !isSender) {
            setUnreadCount((prev) => prev + 1);
            
            // Show toast notification
            const senderName = isRecipientAsClient
              ? "פרילנסר" 
              : "לקוח";
            
            toast.success("הודעה חדשה", {
              description: `קיבלת הודעה חדשה מ${senderName}`,
              action: {
                label: "צפה",
                onClick: () => window.location.href = "/messages",
              },
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const updatedMessage = payload.new as any;
          if (updatedMessage.is_read && updatedMessage.sender_id !== userId) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return unreadCount;
};
