import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileHeader from "@/components/MobileHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Package,
  Star,
  User,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SellerReviewsList } from "@/components/seller-reviews/SellerReviewsList";
import { SecondhandCard } from "@/components/SecondhandCard";

const SellerProfile = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    activeItems: 0,
    averageRating: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    if (id) {
      fetchSellerData();
    }
  }, [id]);

  const fetchSellerData = async () => {
    setLoading(true);
    try {
      // Fetch seller profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (profileError) throw profileError;
      setSeller(profileData);

      // Fetch seller's items
      const { data: itemsData, error: itemsError } = await supabase
        .from("secondhand_items")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false });

      if (itemsError) throw itemsError;
      setItems(itemsData || []);

      // Fetch seller's reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("seller_reviews")
        .select("*")
        .eq("seller_id", id)
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;
      setReviews(reviewsData || []);

      // Calculate stats
      const totalItems = itemsData?.length || 0;
      const activeItems = itemsData?.filter((item) => item.status === "active").length || 0;
      const totalReviews = reviewsData?.length || 0;
      const averageRating = totalReviews > 0
        ? reviewsData.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

      setStats({
        totalItems,
        activeItems,
        averageRating,
        totalReviews,
      });
    } catch (error) {
      console.error("Error fetching seller data:", error);
      toast.error("שגיאה בטעינת נתוני המוכר");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader />
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader />
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">המוכר לא נמצא</h1>
          <Link to="/secondhand">
            <Button>חזרה לרשימת המוצרים</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const activeItems = items.filter((item) => item.status === "active");

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Seller Header */}
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar */}
            <Avatar className="h-24 w-24">
              <AvatarImage src={seller.avatar_url} alt={seller.full_name} />
              <AvatarFallback className="text-2xl">
                {seller.full_name ? seller.full_name.charAt(0) : <User className="h-12 w-12" />}
              </AvatarFallback>
            </Avatar>

            {/* Seller Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {seller.full_name || "מוכר פרטי"}
              </h1>
              
              {/* Stats Row */}
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>{stats.activeItems} מוצרים פעילים</span>
                </div>
                {stats.totalReviews > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-foreground">
                      {stats.averageRating.toFixed(1)}
                    </span>
                    <span>({stats.totalReviews} ביקורות)</span>
                  </div>
                )}
              </div>

              {seller.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">טלפון:</span>
                  <span className="font-medium">{seller.phone}</span>
                </div>
              )}
            </div>

            {/* Rating Badge */}
            {stats.totalReviews > 0 && (
              <div className="bg-primary/10 rounded-lg p-6 text-center min-w-[120px]">
                <div className="text-4xl font-bold text-primary mb-1">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= stats.averageRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  דירוג ממוצע
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="items">
              מוצרים ({activeItems.length})
            </TabsTrigger>
            <TabsTrigger value="reviews">
              ביקורות ({stats.totalReviews})
            </TabsTrigger>
          </TabsList>

          {/* Items Tab */}
          <TabsContent value="items">
            {activeItems.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">אין מוצרים פעילים</h3>
                <p className="text-muted-foreground mb-6">
                  למוכר זה אין מוצרים פעילים כרגע
                </p>
                <Link to="/secondhand">
                  <Button>
                    <ArrowRight className="ml-2 h-4 w-4" />
                    חזרה לדף הראשי
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeItems.map((item) => (
                  <SecondhandCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            {id && <SellerReviewsList sellerId={id} />}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default SellerProfile;
