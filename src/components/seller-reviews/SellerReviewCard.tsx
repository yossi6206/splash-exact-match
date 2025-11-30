import { Star, ThumbsUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface SellerReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string;
    accuracy_rating?: number;
    communication_rating?: number;
    transaction_id?: string;
    created_at: string;
    reviewer_id: string;
  };
  currentUserId?: string;
  onHelpfulUpdate?: () => void;
}

export const SellerReviewCard = ({
  review,
  currentUserId,
  onHelpfulUpdate,
}: SellerReviewCardProps) => {
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleHelpful = async () => {
    if (!currentUserId) {
      toast.error("יש להתחבר כדי לסמן ביקורת כמועילה");
      return;
    }

    setLoading(true);
    try {
      if (isHelpful) {
        // Remove helpful vote
        await supabase
          .from("review_helpful")
          .delete()
          .eq("review_id", review.id)
          .eq("user_id", currentUserId);
        setHelpfulCount((prev) => prev - 1);
        setIsHelpful(false);
        toast.success("הסימון הוסר");
      } else {
        // Add helpful vote
        await supabase.from("review_helpful").insert({
          review_id: review.id,
          user_id: currentUserId,
        });
        setHelpfulCount((prev) => prev + 1);
        setIsHelpful(true);
        toast.success("תודה על המשוב!");
      }
      onHelpfulUpdate?.();
    } catch (error) {
      console.error("Error updating helpful status:", error);
      toast.error("שגיאה בעדכון הסימון");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{review.rating.toFixed(1)}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {format(new Date(review.created_at), "d MMMM yyyy", { locale: he })}
          </p>
        </div>
        
        {review.transaction_id && (
          <Badge variant="secondary" className="text-xs">
            עסקה מאומתת
          </Badge>
        )}
      </div>

      {/* Specific ratings */}
      {(review.accuracy_rating || review.communication_rating) && (
        <div className="flex gap-4 mb-4 text-sm">
          {review.accuracy_rating && (
            <div>
              <span className="text-muted-foreground">דיוק תיאור: </span>
              <span className="font-medium">{review.accuracy_rating}/5</span>
            </div>
          )}
          {review.communication_rating && (
            <div>
              <span className="text-muted-foreground">תקשורת: </span>
              <span className="font-medium">{review.communication_rating}/5</span>
            </div>
          )}
        </div>
      )}

      <p className="text-foreground mb-4 whitespace-pre-wrap">{review.comment}</p>

      <div className="flex items-center gap-2 pt-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleHelpful}
          disabled={loading || !currentUserId}
          className={isHelpful ? "text-primary" : ""}
        >
          <ThumbsUp className={`h-4 w-4 ml-1 ${isHelpful ? "fill-current" : ""}`} />
          מועיל ({helpfulCount})
        </Button>
      </div>
    </Card>
  );
};
