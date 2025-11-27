import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "./RatingStars";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";

interface ReviewCardProps {
  review: {
    id: string;
    userName: string;
    rating: number;
    title: string;
    comment: string;
    verifiedPurchase: boolean;
    helpfulCount: number;
    createdAt: string;
  };
  onHelpful?: (reviewId: string) => void;
  onNotHelpful?: (reviewId: string) => void;
}

export const ReviewCard = ({ review, onHelpful, onNotHelpful }: ReviewCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {review.userName.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{review.userName}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(review.createdAt), { 
                      addSuffix: true,
                      locale: he 
                    })}
                  </div>
                </div>
              </div>
            </div>
            {review.verifiedPurchase && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                רכישה מאומתת
              </Badge>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <RatingStars rating={review.rating} size="md" />
            <span className="font-semibold text-foreground">{review.title}</span>
          </div>

          {/* Comment */}
          <p className="text-foreground/80 leading-relaxed">
            {review.comment}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2 border-t">
            <span className="text-sm text-muted-foreground">
              האם הביקורת הזו עזרה לך?
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onHelpful?.(review.id)}
                className="gap-1"
              >
                <ThumbsUp className="h-3 w-3" />
                כן ({review.helpfulCount})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNotHelpful?.(review.id)}
                className="gap-1"
              >
                <ThumbsDown className="h-3 w-3" />
                לא
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};