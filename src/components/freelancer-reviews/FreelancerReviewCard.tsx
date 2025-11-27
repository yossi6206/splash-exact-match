import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, ThumbsUp, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FreelancerReviewCardProps {
  review: {
    id: string;
    reviewer_name: string;
    rating: number;
    title: string;
    comment: string;
    project_type: string | null;
    work_quality_rating: number | null;
    communication_rating: number | null;
    professionalism_rating: number | null;
    deadline_rating: number | null;
    helpful_count: number | null;
    verified_client: boolean | null;
    created_at: string;
  };
  currentUserId?: string;
  onHelpfulClick?: () => void;
}

const FreelancerReviewCard = ({ review, currentUserId, onHelpfulClick }: FreelancerReviewCardProps) => {
  const { toast } = useToast();
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0);

  const handleHelpfulClick = async () => {
    if (!currentUserId) {
      toast({
        title: "נדרש התחברות",
        description: "יש להתחבר כדי לסמן ביקורת כמועילה",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isHelpful) {
        // Remove helpful vote
        await supabase
          .from("freelancer_review_helpful")
          .delete()
          .eq("review_id", review.id)
          .eq("user_id", currentUserId);
        
        setHelpfulCount(prev => Math.max(0, prev - 1));
        setIsHelpful(false);
      } else {
        // Add helpful vote
        await supabase
          .from("freelancer_review_helpful")
          .insert({
            review_id: review.id,
            user_id: currentUserId
          });
        
        setHelpfulCount(prev => prev + 1);
        setIsHelpful(true);
      }

      onHelpfulClick?.();
    } catch (error) {
      console.error("Error toggling helpful:", error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לעדכן את הסימון",
        variant: "destructive"
      });
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const starSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
    return (
      <div className="flex gap-0.5 flex-row-reverse">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${starSize} ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 flex-row-reverse">
          {review.project_type && (
            <Badge variant="outline" className="text-xs">
              {review.project_type}
            </Badge>
          )}
          
          <div className="flex items-start gap-3 flex-row-reverse flex-1">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                {getInitials(review.reviewer_name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-row-reverse justify-end">
                {review.verified_client && (
                  <Badge variant="secondary" className="text-xs h-5 px-1.5">
                    <CheckCircle2 className="w-3 h-3 ml-0.5" />
                    לקוח מאומת
                  </Badge>
                )}
                <span className="font-semibold">{review.reviewer_name}</span>
              </div>
              <div className="flex items-center gap-2 flex-row-reverse justify-end">
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(review.created_at), { 
                    addSuffix: true, 
                    locale: he 
                  })}
                </span>
                {renderStars(review.rating, "md")}
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 text-right">{review.title}</h3>

        {/* Comment */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 text-right">
          {review.comment}
        </p>

        {/* Detailed Ratings */}
        {(review.work_quality_rating || review.communication_rating || 
          review.professionalism_rating || review.deadline_rating) && (
          <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
            {review.work_quality_rating && (
              <div className="flex items-center justify-between gap-2 flex-row-reverse">
                <div className="flex items-center gap-1">
                  {renderStars(review.work_quality_rating)}
                </div>
                <span className="text-xs text-muted-foreground">איכות עבודה:</span>
              </div>
            )}
            {review.communication_rating && (
              <div className="flex items-center justify-between gap-2 flex-row-reverse">
                <div className="flex items-center gap-1">
                  {renderStars(review.communication_rating)}
                </div>
                <span className="text-xs text-muted-foreground">תקשורת:</span>
              </div>
            )}
            {review.professionalism_rating && (
              <div className="flex items-center justify-between gap-2 flex-row-reverse">
                <div className="flex items-center gap-1">
                  {renderStars(review.professionalism_rating)}
                </div>
                <span className="text-xs text-muted-foreground">מקצועיות:</span>
              </div>
            )}
            {review.deadline_rating && (
              <div className="flex items-center justify-between gap-2 flex-row-reverse">
                <div className="flex items-center gap-1">
                  {renderStars(review.deadline_rating)}
                </div>
                <span className="text-xs text-muted-foreground">עמידה בזמנים:</span>
              </div>
            )}
          </div>
        )}

        {/* Helpful Button */}
        <div className="flex items-center gap-2 pt-3 border-t justify-end">
          <Button
            variant={isHelpful ? "default" : "outline"}
            size="sm"
            onClick={handleHelpfulClick}
            className="gap-1.5 flex-row-reverse"
          >
            {helpfulCount > 0 && (
              <span className="font-semibold">({helpfulCount})</span>
            )}
            <span>{isHelpful ? "מועיל" : "מועיל?"}</span>
            <ThumbsUp className={`w-3.5 h-3.5 ${isHelpful ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerReviewCard;
