import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReviewCard } from "./ReviewCard";
import { Filter } from "lucide-react";

interface Review {
  id: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

interface ReviewsListProps {
  reviews: Review[];
  onHelpful?: (reviewId: string) => void;
  onNotHelpful?: (reviewId: string) => void;
}

export const ReviewsList = ({ reviews, onHelpful, onNotHelpful }: ReviewsListProps) => {
  const [sortBy, setSortBy] = useState("recent");
  const [filterRating, setFilterRating] = useState("all");

  const filteredReviews = reviews
    .filter((review) => {
      if (filterRating === "all") return true;
      return review.rating === parseInt(filterRating);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "helpful":
          return b.helpfulCount - a.helpfulCount;
        case "rating-high":
          return b.rating - a.rating;
        case "rating-low":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6" dir="rtl">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          ביקורות ({reviews.length})
        </h2>
        
        <div className="flex flex-wrap gap-3">
          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value="recent">הכי חדש</SelectItem>
              <SelectItem value="helpful">הכי מועיל</SelectItem>
              <SelectItem value="rating-high">דירוג גבוה</SelectItem>
              <SelectItem value="rating-low">דירוג נמוך</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter by Rating */}
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-[180px] bg-card">
              <Filter className="h-4 w-4 ml-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value="all">כל הדירוגים</SelectItem>
              <SelectItem value="5">5 כוכבים</SelectItem>
              <SelectItem value="4">4 כוכבים</SelectItem>
              <SelectItem value="3">3 כוכבים</SelectItem>
              <SelectItem value="2">2 כוכבים</SelectItem>
              <SelectItem value="1">1 כוכב</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onHelpful={onHelpful}
              onNotHelpful={onNotHelpful}
            />
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            לא נמצאו ביקורות לפי הפילטרים שבחרת
          </div>
        )}
      </div>
    </div>
  );
};