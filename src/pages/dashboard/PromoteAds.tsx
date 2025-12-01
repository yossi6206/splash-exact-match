import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PromotionPackageCard } from "@/components/PromotionPackageCard";
import { Sparkles, Calendar, Eye, MousePointer, TrendingUp } from "lucide-react";
import { isItemPromoted } from "@/utils/promotionUtils";

interface AdItem {
  id: string;
  title: string;
  price?: number | string;
  location?: string;
  images?: string[];
  category?: string;
  is_promoted?: boolean;
  promotion_start_date?: string;
  promotion_end_date?: string;
  promotion_impressions?: number;
  clicks_count?: number;
  views_count?: number;
  table_name: string;
}

const PROMOTION_PACKAGES = [
  { duration: 7, price: 49, popular: false },
  { duration: 14, price: 89, popular: true },
  { duration: 30, price: 149, popular: false },
];

const PromoteAds = () => {
  const { user } = useAuth();
  const [ads, setAds] = useState<AdItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<AdItem | null>(null);
  const [isPromoting, setIsPromoting] = useState(false);
  const [activeTab, setActiveTab] = useState<"available" | "promoted">("available");

  useEffect(() => {
    if (user) {
      fetchUserAds();
    }
  }, [user]);

  const fetchUserAds = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch from all tables
      const tables = [
        { name: 'cars', label: 'רכבים' },
        { name: 'properties', label: 'נכסים' },
        { name: 'businesses', label: 'עסקים' },
        { name: 'jobs', label: 'משרות' },
        { name: 'freelancers', label: 'פרילנסרים' },
        { name: 'laptops', label: 'מחשבים' },
        { name: 'secondhand_items', label: 'יד שנייה' },
      ];

      const allAds: AdItem[] = [];

      for (const table of tables) {
        const { data, error } = await supabase
          .from(table.name as any)
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (error) {
          console.error(`Error fetching ${table.name}:`, error);
          continue;
        }

        if (data) {
          const mappedData = data.map((item: any) => ({
            ...item,
            table_name: table.name,
            category: table.label,
          }));
          allAds.push(...mappedData);
        }
      }

      setAds(allAds);
    } catch (error) {
      console.error('Error fetching ads:', error);
      toast.error('שגיאה בטעינת המודעות');
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteAd = async (duration: number, price: number) => {
    if (!selectedAd || !user) return;

    setIsPromoting(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + duration);

      const { error } = await supabase
        .from(selectedAd.table_name as any)
        .update({
          is_promoted: true,
          promotion_start_date: startDate.toISOString(),
          promotion_end_date: endDate.toISOString(),
          promotion_impressions: 0,
        })
        .eq('id', selectedAd.id);

      if (error) throw error;

      toast.success(`המודעה קודמה בהצלחה ל-${duration} ימים!`);
      setSelectedAd(null);
      fetchUserAds();
    } catch (error) {
      console.error('Error promoting ad:', error);
      toast.error('שגיאה בקידום המודעה');
    } finally {
      setIsPromoting(false);
    }
  };


  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const promotedAds = ads.filter(ad => isItemPromoted(ad));
  const availableAds = ads.filter(ad => !isItemPromoted(ad));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          קידום מודעות
        </h1>
        <p className="text-muted-foreground text-lg">
          קדם את המודעות שלך והגדל את החשיפה והמכירות
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">מודעות פעילות</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ads.length}</div>
            <p className="text-xs text-muted-foreground mt-1">סך המודעות</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">מודעות מקודמות</CardTitle>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotedAds.length}</div>
            <p className="text-xs text-muted-foreground mt-1">פעילות כעת</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">חשיפות כוללות</CardTitle>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promotedAds.reduce((sum, ad) => sum + (ad.promotion_impressions || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">במודעות מקודמות</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="available">
            מודעות זמינות לקידום ({availableAds.length})
          </TabsTrigger>
          <TabsTrigger value="promoted">
            מודעות מקודמות ({promotedAds.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4 mt-6">
          {loading ? (
            <div className="text-center py-12">טוען מודעות...</div>
          ) : availableAds.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">אין מודעות זמינות לקידום</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableAds.map((ad) => (
                <Card key={`${ad.table_name}-${ad.id}`} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        {ad.images?.[0] ? (
                          <img 
                            src={ad.images[0]} 
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {ad.category}
                          </Badge>
                          <h3 className="font-bold line-clamp-2">{ad.title}</h3>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {ad.price && (
                            <span className="font-semibold text-primary">
                              ₪{typeof ad.price === 'number' ? ad.price.toLocaleString() : ad.price}
                            </span>
                          )}
                          {ad.location && <span>{ad.location}</span>}
                        </div>

                        <div className="flex items-center gap-3 text-sm text-muted-foreground pt-2">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{ad.views_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MousePointer className="w-4 h-4" />
                            <span>{ad.clicks_count || 0}</span>
                          </div>
                        </div>

                        <Button 
                          onClick={() => setSelectedAd(ad)}
                          className="w-full mt-2"
                          variant="default"
                        >
                          <Sparkles className="w-4 h-4 ml-2" />
                          קדם מודעה
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="promoted" className="space-y-4 mt-6">
          {promotedAds.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">אין מודעות מקודמות כרגע</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {promotedAds.map((ad) => (
                <Card key={`${ad.table_name}-${ad.id}`} className="border-2 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted relative">
                        <Badge className="absolute top-1 right-1 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs">
                          מקודם
                        </Badge>
                        {ad.images?.[0] ? (
                          <img 
                            src={ad.images[0]} 
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {ad.category}
                          </Badge>
                          <h3 className="font-bold line-clamp-2">{ad.title}</h3>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>
                            נותרו {getDaysRemaining(ad.promotion_end_date!)} ימים
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{ad.promotion_impressions || 0} חשיפות</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MousePointer className="w-4 h-4" />
                            <span>{ad.clicks_count || 0} קליקים</span>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground text-center mt-2 p-2 bg-muted rounded-lg">
                          הקידום יסתיים אוטומטית ב-{new Date(ad.promotion_end_date!).toLocaleDateString('he-IL')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Promotion Package Dialog */}
      <Dialog open={!!selectedAd} onOpenChange={(open) => !open && setSelectedAd(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">בחר חבילת קידום</DialogTitle>
            <DialogDescription>
              קדם את "{selectedAd?.title}" והגדל את החשיפה שלה
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {PROMOTION_PACKAGES.map((pkg) => (
              <PromotionPackageCard
                key={pkg.duration}
                duration={pkg.duration}
                price={pkg.price}
                isPopular={pkg.popular}
                onSelect={() => handlePromoteAd(pkg.duration, pkg.price)}
                isLoading={isPromoting}
              />
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">💡 טיפ:</h4>
            <p className="text-sm text-muted-foreground">
              מודעות מקודמות מקבלות בממוצע פי 5 יותר צפיות ופי 3 יותר קליקים מאשר מודעות רגילות!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromoteAds;
