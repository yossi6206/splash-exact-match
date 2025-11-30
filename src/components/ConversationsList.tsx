import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ConversationItem } from "./ConversationItem";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Conversation {
  id: string;
  freelancer_id: string;
  freelancer_name: string;
  freelancer_avatar: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count?: number;
}

interface ConversationsListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string, freelancerId: string, freelancerName: string, freelancerAvatar: string | null) => void;
}

export const ConversationsList = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ConversationsListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.freelancer_name.toLowerCase().includes(searchQuery.toLowerCase())
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
                freelancerId={conversation.freelancer_id}
                freelancerName={conversation.freelancer_name}
                freelancerAvatar={conversation.freelancer_avatar}
                lastMessage={conversation.last_message}
                lastMessageAt={conversation.last_message_at}
                unreadCount={conversation.unread_count}
                isSelected={selectedConversationId === conversation.id}
                onClick={() =>
                  onSelectConversation(
                    conversation.id,
                    conversation.freelancer_id,
                    conversation.freelancer_name,
                    conversation.freelancer_avatar
                  )
                }
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
