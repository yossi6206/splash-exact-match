import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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
  freelancerAvatar?: string;
  isOpen: boolean;
  onClose: () => void;
}

const FreelancerChat = ({
  freelancerId,
  freelancerName,
  freelancerAvatar,
  isOpen,
  onClose,
}: FreelancerChatProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    if (isOpen && user) {
      initializeConversation();
    }
  }, [isOpen, user, freelancerId]);

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
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                <AvatarImage src={freelancerAvatar} alt={freelancerName} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(freelancerName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-xl">{freelancerName}</DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  בעל מקצוע זמין
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  התחל שיחה עם {freelancerName}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  שלח הודעה ותקבל מענה בהקדם
                </p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwn = message.sender_id === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                        isOwn
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      <p
                        className={`text-[10px] mt-1 ${
                          isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {format(new Date(message.created_at), "HH:mm")}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t bg-background/95 backdrop-blur">
          <div className="flex gap-3">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="הקלד הודעה..."
              className="min-h-[44px] max-h-32 resize-none"
              disabled={loading}
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || loading}
              size="icon"
              className="h-11 w-11 shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            לחץ Enter לשליחה, Shift+Enter לשורה חדשה
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FreelancerChat;
