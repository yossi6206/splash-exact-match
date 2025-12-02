import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, X, FileText, Download, MoreVertical, Edit2, Trash2, Check } from "lucide-react";
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
  attachment_url: string | null;
  attachment_type: string | null;
  attachment_name: string | null;
  edited_at: string | null;
}

interface FreelancerChatProps {
  conversationId?: string;
  otherUserId?: string;
  otherUserName?: string;
  otherUserAvatar?: string | null;
  isFreelancerView?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  embedded?: boolean;
  // Legacy props for backward compatibility
  freelancerId?: string;
  freelancerName?: string;
  freelancerAvatar?: string | null;
}

export const FreelancerChat = ({
  conversationId: propConversationId,
  otherUserId,
  otherUserName,
  otherUserAvatar,
  isFreelancerView = false,
  open,
  onOpenChange,
  embedded = false,
  // Legacy props
  freelancerId,
  freelancerName,
  freelancerAvatar,
}: FreelancerChatProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(propConversationId || null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use new props or fall back to legacy props
  const displayName = otherUserName || freelancerName || "משתמש";
  const displayAvatar = otherUserAvatar || freelancerAvatar || null;
  const displayUserId = otherUserId || freelancerId || "";

  const { isOtherUserTyping, startTyping, stopTyping } = useTypingIndicator(
    conversationId,
    user?.id,
    displayName
  );

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    if (open && user && !propConversationId) {
      initializeConversation();
    } else if (propConversationId) {
      setConversationId(propConversationId);
    }
  }, [open, user, displayUserId, propConversationId]);

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
    if (!user || !displayUserId) return;

    try {
      let query;
      
      if (isFreelancerView) {
        // When freelancer is viewing: client_id is the other user, freelancer is current user
        const { data: myFreelancerProfile } = await supabase
          .from("freelancers")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!myFreelancerProfile) {
          throw new Error("Freelancer profile not found");
        }

        query = supabase
          .from("conversations")
          .select("id")
          .eq("client_id", displayUserId)
          .eq("freelancer_id", myFreelancerProfile.id);
      } else {
        // When client is viewing: client is current user, freelancer_id is the other user
        query = supabase
          .from("conversations")
          .select("id")
          .eq("client_id", user.id)
          .eq("freelancer_id", displayUserId);
      }

      const { data: existingConv, error: convError } = await query.maybeSingle();

      if (convError && convError.code !== "PGRST116") {
        throw convError;
      }

      if (existingConv) {
        setConversationId(existingConv.id);
      } else if (!isFreelancerView) {
        // Only allow creating new conversations when user is a client
        const { data: newConv, error: createError } = await supabase
          .from("conversations")
          .insert({
            client_id: user.id,
            freelancer_id: displayUserId,
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
          
          // Only add message if it's from another user (to avoid duplicates)
          if (user && newMessage.sender_id !== user.id) {
            setMessages((prev) => [...prev, newMessage]);
            
            // Mark as read
            if (!newMessage.is_read) {
              await supabase
                .from("messages")
                .update({ is_read: true })
                .eq("id", newMessage.id);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "שגיאה",
        description: "הקובץ גדול מדי. גודל מקסימלי: 10MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!user || !conversationId) return null;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${conversationId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("chat-attachments")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("chat-attachments")
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "שגיאה",
        description: "לא ניתן להעלות את הקובץ",
        variant: "destructive",
      });
      return null;
    }
  };

  const sendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || !conversationId || !user) return;

    setLoading(true);
    stopTyping();
    
    try {
      let attachmentUrl = null;
      let attachmentType = null;
      let attachmentName = null;

      if (selectedFile) {
        attachmentUrl = await uploadFile(selectedFile);
        if (!attachmentUrl) {
          setLoading(false);
          return;
        }
        attachmentType = selectedFile.type;
        attachmentName = selectedFile.name;
      }

      const messageContent = newMessage.trim() || (selectedFile ? `שלח קובץ: ${selectedFile.name}` : "");

      const { data, error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: messageContent,
        attachment_url: attachmentUrl,
        attachment_type: attachmentType,
        attachment_name: attachmentName,
      }).select().single();

      if (error) throw error;

      // Add message to state immediately
      if (data) {
        setMessages((prev) => [...prev, data as Message]);
      }

      // Send email notification to recipient
      if (conversationId) {
        try {
          // Get conversation details to find recipient
          const { data: conversation } = await supabase
            .from("conversations")
            .select("client_id, freelancer_id, freelancers(user_id)")
            .eq("id", conversationId)
            .single();

          if (conversation) {
            // Determine recipient user_id (not freelancer_id)
            let recipientUserId: string;
            if (user.id === conversation.client_id) {
              // Current user is client, recipient is freelancer
              recipientUserId = (conversation.freelancers as any)?.user_id;
            } else {
              // Current user is freelancer, recipient is client
              recipientUserId = conversation.client_id;
            }

            if (recipientUserId) {
              // Get sender name
              const { data: senderProfile } = await supabase
                .from("profiles")
                .select("full_name")
                .eq("id", user.id)
                .single();

              await supabase.functions.invoke("send-message-notification", {
                body: {
                  recipientId: recipientUserId,
                  senderName: senderProfile?.full_name || "משתמש",
                  messagePreview: messageContent.substring(0, 100),
                },
              });
            }
          }
        } catch (notificationError) {
          console.error("Error sending notification:", notificationError);
          // Don't show error to user - notification failure shouldn't block messaging
        }
      }

      setNewMessage("");
      removeSelectedFile();
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

  const startEditMessage = (message: Message) => {
    setEditingMessageId(message.id);
    setEditedContent(message.content);
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditedContent("");
  };

  const saveEditedMessage = async (messageId: string) => {
    if (!editedContent.trim()) return;

    try {
      const { error } = await supabase
        .from("messages")
        .update({
          content: editedContent,
          edited_at: new Date().toISOString(),
        })
        .eq("id", messageId);

      if (error) throw error;

      // Update local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, content: editedContent, edited_at: new Date().toISOString() }
            : msg
        )
      );

      cancelEdit();
      toast({
        title: "הודעה עודכנה",
        description: "ההודעה נערכה בהצלחה",
      });
    } catch (error) {
      console.error("Error editing message:", error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לערוך את ההודעה",
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק הודעה זו?")) return;

    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId);

      if (error) throw error;

      // Update local state
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));

      toast({
        title: "הודעה נמחקה",
        description: "ההודעה נמחקה בהצלחה",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "שגיאה",
        description: "לא ניתן למחוק את ההודעה",
        variant: "destructive",
      });
    }
  };

  const chatContent = (
    <>
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={displayAvatar || ""} alt={displayName} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{displayName}</h3>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div ref={scrollRef} className="space-y-4">
          {messages.map((message) => {
            const isOwn = message.sender_id === user?.id;
            const isEditing = editingMessageId === message.id;
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"} group min-w-0`}
              >
                <div
                  className={`max-w-[70%] min-w-0 rounded-lg px-4 py-2 relative overflow-hidden break-words ${
                    isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {/* Message Actions - Only for own messages */}
                  {isOwn && !isEditing && (
                    <div className="absolute -top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1 bg-background border rounded-lg shadow-lg p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => startEditMessage(message)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={() => deleteMessage(message.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {message.attachment_url && (
                    <div className="mb-2">
                      {message.attachment_type?.startsWith("image/") ? (
                        <img
                          src={message.attachment_url}
                          alt={message.attachment_name || "תמונה"}
                          className="rounded-lg max-w-full max-h-64 object-cover cursor-pointer"
                          onClick={() => window.open(message.attachment_url!, "_blank")}
                        />
                      ) : (
                        <a
                          href={message.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 p-2 rounded ${
                            isOwn ? "bg-primary-foreground/10" : "bg-background"
                          }`}
                        >
                          <FileText className="h-5 w-5" />
                          <span className="text-sm truncate max-w-[200px]">
                            {message.attachment_name || "קובץ"}
                          </span>
                          <Download className="h-4 w-4 ml-auto" />
                        </a>
                      )}
                    </div>
                  )}
                  
                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className={`min-h-[60px] text-sm ${
                          isOwn ? "bg-primary-foreground/10" : "bg-background"
                        }`}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={cancelEdit}
                          className="h-7 text-xs"
                        >
                          ביטול
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => saveEditedMessage(message.id)}
                          className="h-7 text-xs"
                        >
                          <Check className="h-3 w-3 ml-1" />
                          שמור
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {message.content && (
                        <p className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere min-w-0" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}>
                          {message.content}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs opacity-70">
                          {format(new Date(message.created_at), "HH:mm", {
                            locale: he,
                          })}
                        </span>
                        {message.edited_at && (
                          <span className="text-xs opacity-50 italic">
                            (נערך)
                          </span>
                        )}
                      </div>
                    </>
                  )}
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
        {selectedFile && (
          <div className="mb-3 p-3 bg-muted rounded-lg flex items-center gap-3">
            {filePreview ? (
              <img
                src={filePreview}
                alt="תצוגה מקדימה"
                className="h-16 w-16 object-cover rounded"
              />
            ) : (
              <FileText className="h-16 w-16 text-muted-foreground" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeSelectedFile}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
            className="hidden"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="h-[60px] w-[60px] flex-shrink-0"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Textarea
            value={newMessage}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="כתוב הודעה..."
            className="min-h-[60px] resize-none"
            dir="auto"
          />
          <Button
            onClick={sendMessage}
            disabled={(!newMessage.trim() && !selectedFile) || loading}
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
