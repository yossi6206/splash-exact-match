import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type ItemType = 'car' | 'property' | 'laptop' | 'job' | 'freelancer' | 'business' | 'secondhand';

export const useFavorites = (itemId: string | number, itemType: ItemType) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [user, itemId]);

  const checkFavoriteStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("item_id", String(itemId))
        .eq("item_type", itemType)
        .maybeSingle();

      if (error) throw error;
      setIsFavorite(!!data);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const toggleFavorite = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!user) {
      toast({
        title: "נדרשת התחברות",
        description: "אנא התחבר כדי לשמור מודעות למועדפים",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("item_id", String(itemId))
          .eq("item_type", itemType);

        if (error) throw error;

        setIsFavorite(false);
        toast({
          title: "הוסר מהמועדפים",
          description: "המודעה הוסרה מרשימת המועדפים שלך",
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from("favorites")
          .insert({
            user_id: user.id,
            item_id: String(itemId),
            item_type: itemType,
          });

        if (error) throw error;

        setIsFavorite(true);
        toast({
          title: "נשמר למועדפים",
          description: "המודעה נשמרה לרשימת המועדפים שלך",
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעת שמירת המודעה",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { isFavorite, isLoading, toggleFavorite };
};
