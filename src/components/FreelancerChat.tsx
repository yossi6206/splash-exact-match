import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
}

interface FreelancerChatProps {
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  embedded?: boolean;
}

export const FreelancerChat = ({
  freelancerId,
  freelancerName,
  freelancerAvatar,
  open,
  onOpenChange,
  embedded = false,
}: FreelancerChatProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { isOtherUserTyping, startTyping, stopTyping } = useTypingIndicator(
    conversationId,
    user?.id,
    freelancerName
  );

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    if (open && user) {
      initializeConversation();
    }
  }, [open, user, freelancerId]);

  useEffect(() => {
    if (conversationId) {
      loadMessages();
      subscribeToMessages();
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeConversation = async () => {
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

      if (existingConv) {
        setConversationId(existingConv.id);
      } else {
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
        setConversationId(newConv.id);
      }
    } catch (error) {
      console.error("Error initializing conversation:", error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לפתוח את הצ'אט",
        variant: "destructive",
      });
    }
  };

  const loadMessages = async () => {
    if (!conversationId) return;

    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      
      // Mark unread messages from other user as read
      if (user && data) {
        const unreadMessages = data.filter(
          (msg) => msg.sender_id !== user.id && !msg.is_read
        );
        
        if (unreadMessages.length > 0) {
          await supabase
            .from("messages")
            .update({ is_read: true })
            .in("id", unreadMessages.map((msg) => msg.id));
        }
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const subscribeToMessages = () => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
          
          // Mark as read if message is from other user
          if (user && newMessage.sender_id !== user.id && !newMessage.is_read) {
            await supabase
              .from("messages")
              .update({ is_read: true })
              .eq("id", newMessage.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId || !user) return;

    setLoading(true);
    stopTyping(); // Stop typing indicator when sending
    
    try {
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לשלוח את ההודעה",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // Trigger typing indicator
    if (e.target.value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const chatContent = (
    <>
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={freelancerAvatar || ""} alt={freelancerName} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(freelancerName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{freelancerName}</h3>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div ref={scrollRef} className="space-y-4">
          {messages.map((message) => {
            const isOwn = message.sender_id === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {format(new Date(message.created_at), "HH:mm", {
                      locale: he,
                    })}
                  </span>
                </div>
              </div>
            );
          })}
          
          {/* Typing Indicator */}
          {isOtherUserTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-3 max-w-[70%]">
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-xs text-muted-foreground mr-2">מקליד</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            onBlur={stopTyping}
            placeholder="כתוב הודעה..."
            className="min-h-[60px] resize-none"
            dir="auto"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || loading}
            size="icon"
            className="h-[60px] w-[60px] flex-shrink-0"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </>
  );

  if (embedded) {
    return <div className="h-full flex flex-col">{chatContent}</div>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        {chatContent}
      </DialogContent>
    </Dialog>
  );
};
