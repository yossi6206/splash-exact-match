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
        .single();

      // Count unread messages where user is either client or freelancer
      const { data: conversations } = await supabase
        .from("conversations")
        .select("id")
        .or(`client_id.eq.${userId},freelancer_id.eq.${freelancerData?.id || "none"}`);

      if (!conversations) return;

      const conversationIds = conversations.map((c) => c.id);
      if (conversationIds.length === 0) return;

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
          
          // Check if message is for this user
          const { data: conversation } = await supabase
            .from("conversations")
            .select("*, freelancers!inner(user_id)")
            .eq("id", newMessage.conversation_id)
            .single();

          if (!conversation) return;

          const isRecipient =
            conversation.client_id === userId ||
            (conversation.freelancers as any).user_id === userId;

          const isSender = newMessage.sender_id === userId;

          if (isRecipient && !isSender) {
            setUnreadCount((prev) => prev + 1);
            
            // Show toast notification
            const senderName = conversation.client_id === userId 
              ? "פרילנסר" 
              : "לקוח";
            
            toast.success("הודעה חדשה", {
              description: `קיבלת הודעה חדשה מ${senderName}`,
              action: {
                label: "צפה",
                onClick: () => window.location.href = "/dashboard/messages",
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
