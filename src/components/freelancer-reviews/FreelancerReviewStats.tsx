import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface FreelancerReviewStatsProps {
  stats: ReviewStats;
}

const FreelancerReviewStats = ({ stats }: FreelancerReviewStatsProps) => {
  const { averageRating, totalReviews, ratingDistribution } = stats;

  const getPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
            <span className="text-5xl font-bold">{averageRating.toFixed(1)}</span>
          </div>
          <p className="text-muted-foreground">
            מבוסס על {totalReviews} ביקורות
          </p>
        </div>

        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16 justify-end">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{rating}</span>
              </div>
              <Progress 
                value={getPercentage(ratingDistribution[rating as keyof typeof ratingDistribution])} 
                className="flex-1 h-2"
              />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {ratingDistribution[rating as keyof typeof ratingDistribution]}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerReviewStats;
