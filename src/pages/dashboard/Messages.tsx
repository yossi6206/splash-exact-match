import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ConversationsList } from "@/components/ConversationsList";
import { FreelancerChat } from "@/components/FreelancerChat";
import { MessageSquare } from "lucide-react";

interface Conversation {
  id: string;
  freelancer_id: string;
  freelancer_name: string;
  freelancer_avatar: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count?: number;
}

export default function Messages() {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<{
    conversationId: string;
    freelancerId: string;
    freelancerName: string;
    freelancerAvatar: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if we were navigated here with a specific freelancer
  useEffect(() => {
    const state = location.state as {
      freelancerId?: string;
      freelancerName?: string;
      freelancerAvatar?: string;
    };

    if (state?.freelancerId && user) {
      // Initialize conversation with the specified freelancer
      initializeSpecificConversation(
        state.freelancerId,
        state.freelancerName || "פרילנסר",
        state.freelancerAvatar || null
      );
    }
  }, [location.state, user]);

  useEffect(() => {
    if (user) {
      loadConversations();
      subscribeToConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      // Get conversations where user is client
      const { data: clientConversations, error: clientError } = await supabase
        .from("conversations")
        .select(
          `
          id,
          freelancer_id,
          last_message_at,
          freelancers (
            id,
            full_name,
            avatar_url
          )
        `
        )
        .eq("client_id", user.id)
        .order("last_message_at", { ascending: false, nullsFirst: false });

      if (clientError) throw clientError;

      // Get conversations where user is freelancer
      const { data: freelancerProfile } = await supabase
        .from("freelancers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      let freelancerConversations: any[] = [];
      if (freelancerProfile) {
        const { data, error } = await supabase
          .from("conversations")
          .select(
            `
            id,
            client_id,
            last_message_at,
            profiles!conversations_client_id_fkey (
              id,
              full_name,
              avatar_url
            )
          `
          )
          .eq("freelancer_id", freelancerProfile.id)
          .order("last_message_at", { ascending: false, nullsFirst: false });

        if (!error) freelancerConversations = data || [];
      }

      // Get last message for each conversation
      const allConversations = [
        ...(clientConversations || []).map((conv: any) => ({
          id: conv.id,
          freelancer_id: conv.freelancer_id,
          freelancer_name: conv.freelancers?.full_name || "פרילנסר",
          freelancer_avatar: conv.freelancers?.avatar_url || null,
          last_message_at: conv.last_message_at,
        })),
        ...freelancerConversations.map((conv: any) => ({
          id: conv.id,
          freelancer_id: conv.client_id,
          freelancer_name: conv.profiles?.full_name || "לקוח",
          freelancer_avatar: conv.profiles?.avatar_url || null,
          last_message_at: conv.last_message_at,
        })),
      ];

      // Get last message for each conversation
      const conversationsWithMessages = await Promise.all(
        allConversations.map(async (conv) => {
          const { data: lastMessage } = await supabase
            .from("messages")
            .select("content")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          return {
            ...conv,
            last_message: lastMessage?.content || null,
          };
        })
      );

      setConversations(conversationsWithMessages);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToConversations = () => {
    const channel = supabase
      .channel("conversations-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        () => {
          loadConversations();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const initializeSpecificConversation = async (
    freelancerId: string,
    freelancerName: string,
    freelancerAvatar: string | null
  ) => {
    if (!user) return;

    try {
      // Check if conversation exists
      const { data: existingConv, error: convError } = await supabase
        .from("conversations")
        .select("id")
        .eq("client_id", user.id)
        .eq("freelancer_id", freelancerId)
        .maybeSingle();

      if (convError && convError.code !== "PGRST116") {
        throw convError;
      }

      let conversationId = existingConv?.id;

      if (!conversationId) {
        // Create new conversation
        const { data: newConv, error: createError } = await supabase
          .from("conversations")
          .insert({
            client_id: user.id,
            freelancer_id: freelancerId,
          })
          .select("id")
          .single();

        if (createError) throw createError;
        conversationId = newConv.id;
      }

      // Set the selected conversation
      setSelectedConversation({
        conversationId,
        freelancerId,
        freelancerName,
        freelancerAvatar,
      });

      // Reload conversations to show the new one in the list
      loadConversations();
    } catch (error) {
      console.error("Error initializing specific conversation:", error);
    }
  };

  const handleSelectConversation = (
    conversationId: string,
    freelancerId: string,
    freelancerName: string,
    freelancerAvatar: string | null
  ) => {
    setSelectedConversation({
      conversationId,
      freelancerId,
      freelancerName,
      freelancerAvatar,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-background">
      <div className="w-96 flex-shrink-0 border-l">
        <ConversationsList
          conversations={conversations}
          selectedConversationId={selectedConversation?.conversationId || null}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      <div className="flex-1 flex items-center justify-center">
        {selectedConversation ? (
          <div className="w-full h-full">
            <FreelancerChat
              freelancerId={selectedConversation.freelancerId}
              freelancerName={selectedConversation.freelancerName}
              freelancerAvatar={selectedConversation.freelancerAvatar}
              open={true}
              onOpenChange={() => setSelectedConversation(null)}
              embedded={true}
            />
          </div>
        ) : (
          <div className="text-center space-y-4 p-8">
            <div className="mx-auto w-32 h-32 rounded-full bg-muted/30 flex items-center justify-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground/40" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">המשך מאיפה שעצרת</h3>
              <p className="text-muted-foreground">
                בחר שיחה ותוכל להמשיך לצ'אט
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
