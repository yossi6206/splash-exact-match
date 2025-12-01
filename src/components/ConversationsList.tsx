import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ConversationItem } from "./ConversationItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Conversation {
  id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_avatar: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count?: number;
  is_freelancer_view?: boolean;
}

interface ConversationsListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (
    conversationId: string,
    otherUserId: string,
    otherUserName: string,
    otherUserAvatar: string | null,
    isFreelancerView: boolean
  ) => void;
  onConversationDeleted?: () => void;
}

export const ConversationsList = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onConversationDeleted,
}: ConversationsListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      // First delete all messages in the conversation
      const { error: messagesError } = await supabase
        .from("messages")
        .delete()
        .eq("conversation_id", conversationId);

      if (messagesError) throw messagesError;

      // Then delete the conversation
      const { error: conversationError } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationId);

      if (conversationError) throw conversationError;

      toast.success("השיחה נמחקה בהצלחה");
      
      // Notify parent to refresh conversations
      if (onConversationDeleted) {
        onConversationDeleted();
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("שגיאה במחיקת השיחה");
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.other_user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col border-l">
      <div className="p-4 border-b space-y-4">
        <h2 className="text-xl font-bold">הודעות</h2>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="חפש שיחות..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>אין שיחות פעילות</p>
          </div>
        ) : (
          <div>
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                id={conversation.id}
                otherUserId={conversation.other_user_id}
                otherUserName={conversation.other_user_name}
                otherUserAvatar={conversation.other_user_avatar}
                lastMessage={conversation.last_message}
                lastMessageAt={conversation.last_message_at}
                unreadCount={conversation.unread_count}
                isSelected={selectedConversationId === conversation.id}
                onClick={() =>
                  onSelectConversation(
                    conversation.id,
                    conversation.other_user_id,
                    conversation.other_user_name,
                    conversation.other_user_avatar,
                    conversation.is_freelancer_view || false
                  )
                }
                onDelete={handleDeleteConversation}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
