import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import FreelancerReviewCard from "./FreelancerReviewCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FreelancerReviewsListProps {
  freelancerId: string;
  currentUserId?: string;
}

const FreelancerReviewsList = ({ freelancerId, currentUserId }: FreelancerReviewsListProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    fetchReviews();
  }, [freelancerId, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from("freelancer_reviews")
        .select("*", { count: "exact" })
        .eq("freelancer_id", freelancerId)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (page === 1) {
        setReviews(data || []);
      } else {
        setReviews(prev => [...prev, ...(data || [])]);
      }

      setHasMore(count ? count > page * ITEMS_PER_PAGE : false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">עדיין אין ביקורות לפרילנסר זה</p>
        <p className="text-sm text-muted-foreground mt-2">היה הראשון לכתוב ביקורת!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <FreelancerReviewCard
          key={review.id}
          review={review}
          currentUserId={currentUserId}
          onHelpfulClick={fetchReviews}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                טוען...
              </>
            ) : (
              "טען עוד ביקורות"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FreelancerReviewsList;
