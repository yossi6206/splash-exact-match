import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RatingStars } from "./RatingStars";

interface ReviewStatsProps {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export const ReviewStats = ({
  totalReviews,
  averageRating,
  ratingDistribution
}: ReviewStatsProps) => {
  const getPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">דירוגי לקוחות</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Rating */}
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-5xl font-bold text-foreground mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center">
                <RatingStars rating={averageRating} size="lg" />
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                מתוך {totalReviews} ביקורות
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingDistribution[stars as keyof typeof ratingDistribution];
              const percentage = getPercentage(count);
              
              return (
                <div key={stars} className="flex items-center gap-3" dir="rtl">
                  <div className="flex items-center gap-1 w-20 justify-end">
                    <RatingStars rating={1} maxRating={1} size="sm" />
                    <span className="text-sm font-medium">{stars}</span>
                  </div>
                  <Progress value={percentage} className="h-2 flex-1" />
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};