import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SellerReviewCard } from "./SellerReviewCard";
import { SellerReviewStats } from "./SellerReviewStats";
import { SellerReviewForm } from "./SellerReviewForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

interface SellerReviewsListProps {
  sellerId: string;
}

export const SellerReviewsList = ({ sellerId }: SellerReviewsListProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {} as { [key: number]: number },
    averageAccuracy: 0,
    averageCommunication: 0,
  });

  useEffect(() => {
    fetchCurrentUser();
    fetchReviews();
  }, [sellerId]);

  const fetchCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setCurrentUserId(user?.id);
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("seller_reviews")
        .select("*")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setReviews(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reviewsData: any[]) => {
    if (reviewsData.length === 0) {
      setStats({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {},
        averageAccuracy: 0,
        averageCommunication: 0,
      });
      return;
    }

    const totalReviews = reviewsData.length;
    const sumRating = reviewsData.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = sumRating / totalReviews;

    const ratingDistribution: { [key: number]: number } = {};
    reviewsData.forEach((review) => {
      const rating = Math.round(review.rating);
      ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
    });

    const accuracyReviews = reviewsData.filter((r) => r.accuracy_rating);
    const averageAccuracy = accuracyReviews.length
      ? accuracyReviews.reduce((sum, r) => sum + r.accuracy_rating, 0) /
        accuracyReviews.length
      : 0;

    const commReviews = reviewsData.filter((r) => r.communication_rating);
    const averageCommunication = commReviews.length
      ? commReviews.reduce((sum, r) => sum + r.communication_rating, 0) /
        commReviews.length
      : 0;

    setStats({
      averageRating,
      totalReviews,
      ratingDistribution,
      averageAccuracy,
      averageCommunication,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">ביקורות על המוכר</h2>

      {stats.totalReviews > 0 && (
        <SellerReviewStats
          averageRating={stats.averageRating}
          totalReviews={stats.totalReviews}
          ratingDistribution={stats.ratingDistribution}
          averageAccuracy={stats.averageAccuracy}
          averageCommunication={stats.averageCommunication}
        />
      )}

      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews">
            ביקורות ({stats.totalReviews})
          </TabsTrigger>
          <TabsTrigger value="write">כתוב ביקורת</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4 mt-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>עדיין אין ביקורות למוכר זה</p>
              <p className="text-sm mt-2">היה הראשון לכתוב ביקורת!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <SellerReviewCard
                key={review.id}
                review={review}
                currentUserId={currentUserId}
                onHelpfulUpdate={fetchReviews}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="write" className="mt-6">
          <SellerReviewForm
            sellerId={sellerId}
            onReviewSubmitted={() => {
              fetchReviews();
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
