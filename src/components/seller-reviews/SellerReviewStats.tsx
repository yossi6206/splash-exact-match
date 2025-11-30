import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SellerReviewStatsProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
  averageAccuracy?: number;
  averageCommunication?: number;
}

export const SellerReviewStats = ({
  averageRating,
  totalReviews,
  ratingDistribution,
  averageAccuracy,
  averageCommunication,
}: SellerReviewStatsProps) => {
  const getRatingPercentage = (rating: number) => {
    if (totalReviews === 0) return 0;
    return ((ratingDistribution[rating] || 0) / totalReviews) * 100;
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6">דירוג המוכר</h3>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Overall Rating */}
        <div className="text-center">
          <div className="text-5xl font-bold text-primary mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= averageRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            מבוסס על {totalReviews} ביקורות
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2">
              <div className="flex items-center gap-1 w-20">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              </div>
              <Progress value={getRatingPercentage(rating)} className="flex-1" />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {ratingDistribution[rating] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Specific Ratings */}
      {(averageAccuracy !== undefined || averageCommunication !== undefined) && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          {averageAccuracy !== undefined && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">דיוק תיאור</p>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Progress value={(averageAccuracy / 5) * 100} />
                </div>
                <span className="text-sm font-medium">{averageAccuracy.toFixed(1)}</span>
              </div>
            </div>
          )}
          {averageCommunication !== undefined && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">תקשורת</p>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Progress value={(averageCommunication / 5) * 100} />
                </div>
                <span className="text-sm font-medium">{averageCommunication.toFixed(1)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
