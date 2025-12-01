import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CarCard } from "@/components/CarCard";
import PropertyCard from "@/components/PropertyCard";
import { LaptopCard } from "@/components/LaptopCard";
import { JobCard } from "@/components/JobCard";
import FreelancerCard from "@/components/FreelancerCard";
import BusinessCard from "@/components/BusinessCard";
import { SecondhandCard } from "@/components/SecondhandCard";

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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">המודעות המועדפות שלי</h1>

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFavorites.map((fav) => {
                  switch (fav.item_type) {
                    case 'car':
                      return (
                        <CarCard
                          key={fav.id}
                          car={{
                            id: fav.itemData.id,
                            image: fav.itemData.images?.[0] || '',
                            title: `${fav.itemData.manufacturer} ${fav.itemData.model}`,
                            subtitle: fav.itemData.description || '',
                            manufacturer: fav.itemData.manufacturer,
                            model: fav.itemData.model,
                            year: fav.itemData.year,
                            hand: `יד ${fav.itemData.hand}`,
                            km: fav.itemData.km,
                            price: parseInt(fav.itemData.price || '0'),
                            location: fav.itemData.location,
                            features: fav.itemData.features || [],
                            clicks_count: fav.itemData.clicks_count,
                            is_promoted: fav.itemData.is_promoted,
                            promotion_end_date: fav.itemData.promotion_end_date,
                          }}
                        />
                      );
                    case 'property':
                      return (
                        <PropertyCard
                          key={fav.id}
                          property={{
                            id: fav.itemData.id,
                            image: fav.itemData.images?.[0] || '',
                            title: fav.itemData.title,
                            subtitle: fav.itemData.description || '',
                            propertyType: fav.itemData.property_type,
                            condition: fav.itemData.condition || '',
                            price: fav.itemData.price.toString(),
                            location: fav.itemData.location,
                            rooms: fav.itemData.rooms,
                            size: fav.itemData.size,
                            floor: fav.itemData.floor,
                            year: fav.itemData.year,
                            features: fav.itemData.features || [],
                            clicks_count: fav.itemData.clicks_count,
                            is_promoted: fav.itemData.is_promoted,
                            promotion_end_date: fav.itemData.promotion_end_date,
                            listing_type: fav.itemData.listing_type,
                          }}
                        />
                      );
                    case 'laptop':
                      return (
                        <LaptopCard
                          key={fav.id}
                          laptop={{
                            id: fav.itemData.id,
                            image: fav.itemData.images?.[0] || '',
                            title: `${fav.itemData.brand} ${fav.itemData.model}`,
                            subtitle: fav.itemData.description || '',
                            price: fav.itemData.price,
                            condition: fav.itemData.condition,
                            location: fav.itemData.location,
                            features: fav.itemData.features || [],
                            clicks_count: fav.itemData.clicks_count,
                          }}
                        />
                      );
                    case 'job':
                      return (
                        <JobCard
                          key={fav.id}
                          id={fav.itemData.id}
                          company={fav.itemData.company_name}
                          title={fav.itemData.title}
                          location={fav.itemData.location}
                          type={fav.itemData.job_type}
                          scope={fav.itemData.scope}
                          salary={fav.itemData.salary_min && fav.itemData.salary_max 
                            ? `₪${fav.itemData.salary_min.toLocaleString()}-${fav.itemData.salary_max.toLocaleString()}`
                            : undefined
                          }
                          experience={`${fav.itemData.experience_min || 0}-${fav.itemData.experience_max || 0} שנות ניסיון`}
                          postedDate={new Date(fav.itemData.created_at).toLocaleDateString('he-IL')}
                          requirements={fav.itemData.requirements || []}
                          clicks_count={fav.itemData.clicks_count}
                        />
                      );
                    case 'freelancer':
                      return (
                        <FreelancerCard
                          key={fav.id}
                          id={fav.itemData.id}
                          full_name={fav.itemData.full_name}
                          avatar_url={fav.itemData.avatar_url}
                          title={fav.itemData.title}
                          bio={fav.itemData.bio}
                          skills={fav.itemData.skills || []}
                          hourly_rate={fav.itemData.hourly_rate}
                          rating={fav.itemData.rating || 0}
                          total_reviews={fav.itemData.total_reviews || 0}
                          location={fav.itemData.location}
                          category={fav.itemData.category}
                          user_id={fav.itemData.user_id}
                        />
                      );
                    case 'business':
                      return (
                        <BusinessCard
                          key={fav.id}
                          id={fav.itemData.id}
                          title={fav.itemData.title}
                          description={fav.itemData.description}
                          business_type={fav.itemData.business_type}
                          category={fav.itemData.category}
                          price={fav.itemData.price}
                          location={fav.itemData.location}
                          annual_revenue={fav.itemData.annual_revenue}
                          monthly_profit={fav.itemData.monthly_profit}
                          years_operating={fav.itemData.years_operating}
                          employees_count={fav.itemData.employees_count}
                          images={fav.itemData.images}
                          clicks_count={fav.itemData.clicks_count}
                          is_promoted={fav.itemData.is_promoted}
                          promotion_end_date={fav.itemData.promotion_end_date}
                        />
                      );
                    case 'secondhand':
                      return (
                        <SecondhandCard
                          key={fav.id}
                          item={{
                            id: fav.itemData.id,
                            images: fav.itemData.images,
                            title: fav.itemData.title,
                            category: fav.itemData.category,
                            subcategory: fav.itemData.subcategory,
                            condition: fav.itemData.condition,
                            price: fav.itemData.price,
                            location: fav.itemData.location,
                            brand: fav.itemData.brand,
                            size: fav.itemData.size,
                            color: fav.itemData.color,
                            material: fav.itemData.material,
                            age: fav.itemData.age,
                            features: fav.itemData.features,
                            delivery_available: fav.itemData.delivery_available,
                            negotiable: fav.itemData.negotiable,
                            year_manufactured: fav.itemData.year_manufactured,
                            dimensions: fav.itemData.dimensions,
                            weight: fav.itemData.weight,
                            user_id: fav.itemData.user_id,
                            seller_name: fav.itemData.seller_name,
                            clicks_count: fav.itemData.clicks_count,
                          }}
                        />
                      );
                    default:
                      return null;
                  }
                })}
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
