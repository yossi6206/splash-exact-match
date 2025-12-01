import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Heart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";

// Unified card component for all favorite types
const UnifiedFavoriteCard = ({ favorite }: { favorite: any }) => {
  const { isFavorite, toggleFavorite } = useFavorites(String(favorite.item_id), favorite.item_type);
  
  const getItemLink = () => {
    const id = favorite.item_id;
    switch (favorite.item_type) {
      case 'car': return `/cars/${id}`;
      case 'property': return `/properties/${id}`;
      case 'laptop': return `/laptops/${id}`;
      case 'job': return `/jobs/${id}`;
      case 'freelancer': return `/freelancers/${id}`;
      case 'business': return `/businesses/${id}`;
      case 'secondhand': return `/secondhand/item/${id}`;
      default: return '#';
    }
  };

  const getTitle = () => {
    const data = favorite.itemData;
    switch (favorite.item_type) {
      case 'car': return `${data.manufacturer || ''} ${data.model || ''}`.trim();
      case 'property': return data.title;
      case 'laptop': return `${data.brand} ${data.model}`;
      case 'job': return data.title;
      case 'freelancer': return data.full_name;
      case 'business': return data.title;
      case 'secondhand': return data.title;
      default: return '';
    }
  };

  const getSubtitle = () => {
    const data = favorite.itemData;
    switch (favorite.item_type) {
      case 'car': return `שנה ${data.year} • יד ${data.hand}`;
      case 'property': return `${data.rooms} חדרים • ${data.size} מ"ר • קומה ${data.floor}`;
      case 'laptop': return `${data.condition} • ${data.location}`;
      case 'job': return `${data.company_name} • ${data.location}`;
      case 'freelancer': return data.title;
      case 'business': return `${data.business_type} • ${data.location}`;
      case 'secondhand': return `${data.condition} • ${data.location}`;
      default: return '';
    }
  };

  const getPrice = () => {
    const data = favorite.itemData;
    switch (favorite.item_type) {
      case 'car': return data.price ? parseInt(data.price) : 0;
      case 'property': return data.price;
      case 'laptop': return data.price;
      case 'job': return null; // Jobs don't always have prices
      case 'freelancer': return data.hourly_rate;
      case 'business': return data.price;
      case 'secondhand': return data.price;
      default: return null;
    }
  };

  const getImage = () => {
    const data = favorite.itemData;
    if (data.images && data.images.length > 0) return data.images[0];
    if (data.image) return data.image;
    if (data.avatar_url) return data.avatar_url;
    return '';
  };

  const price = getPrice();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white border-border max-w-3xl">
      <Link to={getItemLink()}>
        <div className="flex gap-3 p-3">
          {/* Image */}
          <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 relative">
            {getImage() ? (
              <img 
                src={getImage()} 
                alt={getTitle()}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">אין תמונה</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div className="text-right">
              <h3 className="text-base font-bold text-foreground mb-1 line-clamp-1">
                {getTitle()}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {getSubtitle()}
              </p>
            </div>

            {price !== null && (
              <div className="text-right">
                <div className="text-xl font-bold text-foreground">
                  ₪{typeof price === 'number' ? price.toLocaleString() : price}
                  {favorite.item_type === 'freelancer' && <span className="text-xs font-normal text-muted-foreground"> לשעה</span>}
                </div>
              </div>
            )}
          </div>

          {/* Heart Button */}
          <div className="flex items-start relative z-10">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-red-500 hover:bg-muted/50"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(e);
              }}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
};

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchFavorites();
  }, [user, navigate]);

  const fetchFavorites = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: favData, error: favError } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (favError) throw favError;

      // Fetch full details for each favorite
      const enrichedFavorites = await Promise.all(
        (favData || []).map(async (fav) => {
          let itemData = null;
          
          switch (fav.item_type) {
            case 'car': {
              const { data } = await supabase
                .from("cars")
                .select("*")
                .eq("id", fav.item_id)
                .single();
              itemData = data;
              break;
            }
            case 'property': {
              const { data } = await supabase
                .from("properties")
                .select("*")
                .eq("id", fav.item_id)
                .single();
              itemData = data;
              break;
            }
            case 'laptop': {
              const { data } = await supabase
                .from("laptops")
                .select("*")
                .eq("id", fav.item_id)
                .single();
              itemData = data;
              break;
            }
            case 'job': {
              const { data } = await supabase
                .from("jobs")
                .select("*")
                .eq("id", fav.item_id)
                .single();
              itemData = data;
              break;
            }
            case 'freelancer': {
              const { data } = await supabase
                .from("freelancers")
                .select("*")
                .eq("id", fav.item_id)
                .single();
              itemData = data;
              break;
            }
            case 'business': {
              const { data } = await supabase
                .from("businesses")
                .select("*")
                .eq("id", fav.item_id)
                .single();
              itemData = data;
              break;
            }
            case 'secondhand': {
              const { data } = await supabase
                .from("secondhand_items")
                .select("*")
                .eq("id", fav.item_id)
                .single();
              itemData = data;
              break;
            }
          }

          return {
            ...fav,
            itemData,
          };
        })
      );

      setFavorites(enrichedFavorites.filter(f => f.itemData));
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFavorites = activeTab === "all" 
    ? favorites 
    : favorites.filter(f => f.item_type === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">מודעות שאהבתי</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">הכל ({favorites.length})</TabsTrigger>
            <TabsTrigger value="car">
              רכב ({favorites.filter(f => f.item_type === 'car').length})
            </TabsTrigger>
            <TabsTrigger value="property">
              נדל"ן ({favorites.filter(f => f.item_type === 'property').length})
            </TabsTrigger>
            <TabsTrigger value="laptop">
              מחשבים ({favorites.filter(f => f.item_type === 'laptop').length})
            </TabsTrigger>
            <TabsTrigger value="job">
              דרושים ({favorites.filter(f => f.item_type === 'job').length})
            </TabsTrigger>
            <TabsTrigger value="freelancer">
              פרילנסרים ({favorites.filter(f => f.item_type === 'freelancer').length})
            </TabsTrigger>
            <TabsTrigger value="business">
              עסקים ({favorites.filter(f => f.item_type === 'business').length})
            </TabsTrigger>
            <TabsTrigger value="secondhand">
              יד שניה ({favorites.filter(f => f.item_type === 'secondhand').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredFavorites.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">אין מודעות מועדפות</p>
              </div>
            ) : (
              <div className="space-y-3 max-w-4xl mx-auto">
                {filteredFavorites.map((fav) => (
                  <UnifiedFavoriteCard key={fav.id} favorite={fav} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
