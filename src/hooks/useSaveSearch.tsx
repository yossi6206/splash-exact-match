import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Json } from "@/integrations/supabase/types";

interface SaveSearchParams {
  searchQuery: string;
  category: string;
  filters?: Record<string, unknown>;
  resultsCount?: number;
}

export const useSaveSearch = () => {
  const { user } = useAuth();

  const saveSearch = useCallback(async ({
    searchQuery,
    category,
    filters = {},
    resultsCount = 0
  }: SaveSearchParams) => {
    if (!user || !searchQuery.trim()) return;

    try {
      // Check if this exact search already exists recently (within last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      
      const { data: existing } = await supabase
        .from("user_searches")
        .select("id")
        .eq("user_id", user.id)
        .eq("search_query", searchQuery.trim())
        .eq("category", category)
        .gte("created_at", oneHourAgo)
        .limit(1);

      // Don't save duplicate searches within the same hour
      if (existing && existing.length > 0) return;

      await supabase.from("user_searches").insert([{
        user_id: user.id,
        search_query: searchQuery.trim(),
        category,
        filters: filters as Json,
        results_count: resultsCount
      }]);
    } catch (error) {
      console.error("Error saving search:", error);
    }
  }, [user]);

  return { saveSearch };
};
