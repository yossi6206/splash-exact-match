import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

interface TypingUser {
  user_id: string;
  user_name: string;
  is_typing: boolean;
  timestamp: number;
}

export const useTypingIndicator = (
  conversationId: string | null,
  currentUserId: string | undefined,
  otherUserName: string
) => {
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!conversationId || !currentUserId) return;

    const channelName = `typing:${conversationId}`;
    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: currentUserId,
        },
      },
    });

    // Subscribe to presence changes
    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        
        // Check if any other user (not current user) is typing
        const otherUsersTyping = Object.keys(state).some((key) => {
          const presences = state[key];
          return presences.some((presence: any) => 
            presence.user_id !== currentUserId && presence.is_typing
          );
        });

        setIsOtherUserTyping(otherUsersTyping);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      channel.unsubscribe();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversationId, currentUserId]);

  const startTyping = useCallback(() => {
    if (!channelRef.current || !currentUserId) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Track typing state
    channelRef.current.track({
      user_id: currentUserId,
      is_typing: true,
      timestamp: Date.now(),
    });

    // Auto-stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [currentUserId]);

  const stopTyping = useCallback(() => {
    if (!channelRef.current || !currentUserId) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    channelRef.current.track({
      user_id: currentUserId,
      is_typing: false,
      timestamp: Date.now(),
    });
  }, [currentUserId]);

  return {
    isOtherUserTyping,
    startTyping,
    stopTyping,
  };
};
