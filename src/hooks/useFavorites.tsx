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
        // Get current price based on item type
        let currentPrice: number | null = null;
        try {
          switch (itemType) {
            case 'car': {
              const { data } = await supabase
                .from('cars')
                .select('price')
                .eq('id', String(itemId))
                .maybeSingle();
              if (data?.price) currentPrice = parseInt(data.price);
              break;
            }
            case 'property': {
              const { data } = await supabase
                .from('properties')
                .select('price')
                .eq('id', String(itemId))
                .maybeSingle();
              if (data) currentPrice = data.price;
              break;
            }
            case 'laptop': {
              const { data } = await supabase
                .from('laptops')
                .select('price')
                .eq('id', String(itemId))
                .maybeSingle();
              if (data) currentPrice = data.price;
              break;
            }
            case 'business': {
              const { data } = await supabase
                .from('businesses')
                .select('price')
                .eq('id', String(itemId))
                .maybeSingle();
              if (data) currentPrice = data.price;
              break;
            }
            case 'secondhand': {
              const { data } = await supabase
                .from('secondhand_items')
                .select('price')
                .eq('id', String(itemId))
                .maybeSingle();
              if (data) currentPrice = data.price;
              break;
            }
            case 'freelancer': {
              const { data } = await supabase
                .from('freelancers')
                .select('hourly_rate')
                .eq('id', String(itemId))
                .maybeSingle();
              if (data) currentPrice = data.hourly_rate;
              break;
            }
            case 'job': {
              const { data } = await supabase
                .from('jobs')
                .select('salary_min')
                .eq('id', String(itemId))
                .maybeSingle();
              if (data) currentPrice = data.salary_min;
              break;
            }
          }
        } catch (priceError) {
          console.error("Error fetching price:", priceError);
        }

        // Add to favorites
        const { error } = await supabase
          .from("favorites")
          .insert({
            user_id: user.id,
            item_id: String(itemId),
            item_type: itemType,
            original_price: currentPrice,
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

// Helper function to get table name from item type
const getTableName = (itemType: ItemType): string => {
  switch (itemType) {
    case 'car': return 'cars';
    case 'property': return 'properties';
    case 'laptop': return 'laptops';
    case 'job': return 'jobs';
    case 'freelancer': return 'freelancers';
    case 'business': return 'businesses';
    case 'secondhand': return 'secondhand_items';
    default: return '';
  }
};
