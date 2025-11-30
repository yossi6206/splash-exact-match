import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useOnlineStatus = (userId?: string) => {
  const [isOnline, setIsOnline] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!userId) return;

    // Load initial status
    loadOnlineStatus();

    // Subscribe to status changes
    const channel = supabase
      .channel(`online_status:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "online_status",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new && "is_online" in payload.new) {
            setIsOnline(payload.new.is_online as boolean);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Update own online status
  useEffect(() => {
    if (!user) return;

    const updateStatus = async (isOnline: boolean) => {
      await supabase
        .from("online_status")
        .upsert({
          user_id: user.id,
          is_online: isOnline,
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
    };

    // Set online when component mounts
    updateStatus(true);

    // Set offline before page unload
    const handleBeforeUnload = () => {
      updateStatus(false);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Update status periodically
    const interval = setInterval(() => {
      updateStatus(true);
    }, 30000); // Every 30 seconds

    return () => {
      updateStatus(false);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(interval);
    };
  }, [user]);

  const loadOnlineStatus = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("online_status")
      .select("is_online")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data) {
      setIsOnline(data.is_online);
    }
  };

  return { isOnline };
};
