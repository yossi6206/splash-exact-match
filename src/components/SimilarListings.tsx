import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CloudflareImage } from "@/components/CloudflareImage";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Default images for fallbacks
import property1 from "@/assets/property-1.jpg";
import carImage from "@/assets/item-car.jpg";
import laptopImage from "@/assets/item-laptop.jpg";
import jobImage from "@/assets/item-job.jpg";

interface SimilarListingsProps {
  itemType: "property" | "car" | "laptop" | "secondhand" | "job" | "business" | "freelancer";
  currentItemId: string;
  location?: string;
  propertyType?: string;
  rooms?: number;
  priceRange?: { min: number; max: number };
  manufacturer?: string;
  brand?: string;
  category?: string;
  jobType?: string;
}

interface SimilarItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  price: string;
  location: string;
  details: string;
}

const SimilarListings = ({
  itemType,
  currentItemId,
  location,
  propertyType,
  rooms,
  priceRange,
  manufacturer,
  brand,
  category,
  jobType,
}: SimilarListingsProps) => {
  const [items, setItems] = useState<SimilarItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarItems = async () => {
      setLoading(true);
      let data: SimilarItem[] = [];
      const targetCount = 4;

      try {
        switch (itemType) {
          case "property": {
            // Strategy: Try multiple queries with decreasing specificity
            const fetchedIds = new Set<string>([currentItemId]);
            
            // Query 1: Same location + property type + similar rooms
            if (location && propertyType && rooms) {
              const { data: exact } = await supabase
                .from("properties")
                .select("id, title, images, price, location, property_type, rooms, street, house_number, size, floor")
                .eq("status", "active")
                .eq("location", location)
                .eq("property_type", propertyType)
                .gte("rooms", rooms - 1)
                .lte("rooms", rooms + 1)
                .neq("id", currentItemId)
                .limit(targetCount);
              
              if (exact) {
                exact.forEach(p => {
                  if (!fetchedIds.has(p.id) && data.length < targetCount) {
                    fetchedIds.add(p.id);
                    data.push(mapProperty(p));
                  }
                });
              }
            }

            // Query 2: Same location + property type (ignore rooms)
            if (data.length < targetCount && location && propertyType) {
              const { data: byLocationType } = await supabase
                .from("properties")
                .select("id, title, images, price, location, property_type, rooms, street, house_number, size, floor")
                .eq("status", "active")
                .eq("location", location)
                .eq("property_type", propertyType)
                .not("id", "in", `(${Array.from(fetchedIds).join(",")})`)
                .limit(targetCount - data.length);
              
              if (byLocationType) {
                byLocationType.forEach(p => {
                  if (!fetchedIds.has(p.id) && data.length < targetCount) {
                    fetchedIds.add(p.id);
                    data.push(mapProperty(p));
                  }
                });
              }
            }

            // Query 3: Same location only
            if (data.length < targetCount && location) {
              const { data: byLocation } = await supabase
                .from("properties")
                .select("id, title, images, price, location, property_type, rooms, street, house_number, size, floor")
                .eq("status", "active")
                .eq("location", location)
                .not("id", "in", `(${Array.from(fetchedIds).join(",")})`)
                .limit(targetCount - data.length);
              
              if (byLocation) {
                byLocation.forEach(p => {
                  if (!fetchedIds.has(p.id) && data.length < targetCount) {
                    fetchedIds.add(p.id);
                    data.push(mapProperty(p));
                  }
                });
              }
            }

            // Query 4: Same property type (any location)
            if (data.length < targetCount && propertyType) {
              const { data: byType } = await supabase
                .from("properties")
                .select("id, title, images, price, location, property_type, rooms, street, house_number, size, floor")
                .eq("status", "active")
                .eq("property_type", propertyType)
                .not("id", "in", `(${Array.from(fetchedIds).join(",")})`)
                .limit(targetCount - data.length);
              
              if (byType) {
                byType.forEach(p => {
                  if (!fetchedIds.has(p.id) && data.length < targetCount) {
                    fetchedIds.add(p.id);
                    data.push(mapProperty(p));
                  }
                });
              }
            }

            // Query 5: Similar price range (±30%)
            if (data.length < targetCount && priceRange) {
              const minPrice = Math.floor(priceRange.min * 0.7);
              const maxPrice = Math.ceil(priceRange.max * 1.3);
              const { data: byPrice } = await supabase
                .from("properties")
                .select("id, title, images, price, location, property_type, rooms, street, house_number, size, floor")
                .eq("status", "active")
                .gte("price", minPrice)
                .lte("price", maxPrice)
                .not("id", "in", `(${Array.from(fetchedIds).join(",")})`)
                .limit(targetCount - data.length);
              
              if (byPrice) {
                byPrice.forEach(p => {
                  if (!fetchedIds.has(p.id) && data.length < targetCount) {
                    fetchedIds.add(p.id);
                    data.push(mapProperty(p));
                  }
                });
              }
            }

            // Query 6: Fallback - any active properties
            if (data.length < targetCount) {
              const { data: fallback } = await supabase
                .from("properties")
                .select("id, title, images, price, location, property_type, rooms, street, house_number, size, floor")
                .eq("status", "active")
                .not("id", "in", `(${Array.from(fetchedIds).join(",")})`)
                .order("created_at", { ascending: false })
                .limit(targetCount - data.length);
              
              if (fallback) {
                fallback.forEach(p => {
                  if (!fetchedIds.has(p.id) && data.length < targetCount) {
                    fetchedIds.add(p.id);
                    data.push(mapProperty(p));
                  }
                });
              }
            }
            break;
          }

          case "car": {
            const fetchedIds = new Set<string>([currentItemId]);

            // Query 1: Same manufacturer + location
            if (manufacturer && location) {
              const { data: exact } = await supabase
                .from("cars")
                .select("id, manufacturer, model, images, price, location, year, km, hand")
                .eq("status", "active")
                .eq("manufacturer", manufacturer)
                .eq("location", location)
                .neq("id", currentItemId)
                .limit(targetCount);
              
              if (exact) {
                exact.forEach(c => {
                  if (!fetchedIds.has(c.id) && data.length < targetCount) {
                    fetchedIds.add(c.id);
                    data.push(mapCar(c));
                  }
                });
              }
            }

            // Query 2: Same manufacturer
            if (data.length < targetCount && manufacturer) {
              const { data: byManufacturer } = await supabase
                .from("cars")
                .select("id, manufacturer, model, images, price, location, year, km, hand")
                .eq("status", "active")
                .eq("manufacturer", manufacturer)
                .not("id", "in", `(${Array.from(fetchedIds).join(",")})`)
                .limit(targetCount - data.length);
              
              if (byManufacturer) {
                byManufacturer.forEach(c => {
                  if (!fetchedIds.has(c.id) && data.length < targetCount) {
                    fetchedIds.add(c.id);
                    data.push(mapCar(c));
                  }
                });
              }
            }

            // Query 3: Same location
            if (data.length < targetCount && location) {
              const { data: byLocation } = await supabase
                .from("cars")
                .select("id, manufacturer, model, images, price, location, year, km, hand")
                .eq("status", "active")
                .eq("location", location)
                .not("id", "in", `(${Array.from(fetchedIds).join(",")})`)
                .limit(targetCount - data.length);
              
              if (byLocation) {
                byLocation.forEach(c => {
                  if (!fetchedIds.has(c.id) && data.length < targetCount) {
                    fetchedIds.add(c.id);
                    data.push(mapCar(c));
                  }
                });
              }
            }

            // Fallback
            if (data.length < targetCount) {
              const { data: fallback } = await supabase
                .from("cars")
                .select("id, manufacturer, model, images, price, location, year, km, hand")
                .eq("status", "active")
                .not("id", "in", `(${Array.from(fetchedIds).join(",")})`)
                .order("created_at", { ascending: false })
                .limit(targetCount - data.length);
              
              if (fallback) {
                fallback.forEach(c => {
                  if (!fetchedIds.has(c.id) && data.length < targetCount) {
                    fetchedIds.add(c.id);
                    data.push(mapCar(c));
                  }
                });
              }
            }
            break;
          }

          case "laptop": {
            const fetchedIds = new Set<string>([currentItemId]);

            // Query 1: Same brand + location
            if (brand && location) {
              const { data: exact } = await supabase
                .from("laptops")
                .select("id, brand, model, images, price, location, condition, ram, storage, processor")
                .eq("status", "active")
                .eq("brand", brand)
                .eq("location", location)
                .neq("id", currentItemId)
                .limit(targetCount);
              
              if (exact) {
                exact.forEach(l => {
                  if (!fetchedIds.has(l.id) && data.length < targetCount) {
                    fetchedIds.add(l.id);
                    data.push(mapLaptop(l));
                  }
                });
              }
            }

            // Query 2: Same brand
            if (data.length < targetCount && brand) {
              const { data: byBrand } = await supabase
                .from("laptops")
                .select("id, brand, model, images, price, location, condition, ram, storage, processor")
                .eq("status", "active")
                .eq("brand", brand)
                .not("id", "in", `(${Array.from(fetchedIds).join(",")})`)
                .limit(targetCount - data.length);
              
              if (byBrand) {
                byBrand.forEach(l => {
                  if (!fetchedIds.has(l.id) && data.length < targetCount) {
                    fetchedIds.add(l.id);
                    data.push(mapLaptop(l));
                  }
                });
              }
            }

            // Fallback
            if (data.length < targetCount) {
              const { data: fallback } = await supabase
                .from("laptops")
                .select("id, brand, model, images, price, location, condition, ram, storage, processor")
                .eq("status", "active")
                .not("id", "in", `(${Array.from(fetchedIds).join(",")})`)
                .order("created_at", { ascending: false })
                .limit(targetCount - data.length);
              
              if (fallback) {
                fallback.forEach(l => {
                  if (!fetchedIds.has(l.id) && data.length < targetCount) {
                    fetchedIds.add(l.id);
                    data.push(mapLaptop(l));
                  }
                });
              }
            }
            break;
          }

          case "secondhand": {
            const fetchedIds = new Set<string>([currentItemId]);

            // Query 1: Same category + location
            if (category && location) {
              const { data: exact } = await supabase
                .from("secondhand_items")
                .select("id, title, images, price, location, category, condition")
                .eq("status", "active")
                .eq("category", category)
                .eq("location", location)
                .neq("id", currentItemId)
                .limit(targetCount);
              
              if (exact) {
                exact.forEach(i => {
                  if (!fetchedIds.has(i.id) && data.length < targetCount) {
                    fetchedIds.add(i.id);
                    data.push(mapSecondhand(i));
                  }
                });
              }
            }

            // Query 2: Same category
            if (data.length < targetCount && category) {
              const { data: byCategory } = await supabase
                .from("secondhand_items")
                .select("id, title, images, price, location, category, condition")
                .eq("status", "active")
                .eq("category", category)
                .not("id", "in", `(${Array.from(fetchedIds).join(",")})`)
                .limit(targetCount - data.length);
              
              if (byCategory) {
                byCategory.forEach(i => {
                  if (!fetchedIds.has(i.id) && data.length < targetCount) {
                    fetchedIds.add(i.id);
                    data.push(mapSecondhand(i));
                  }
                });
              }
            }

            // Fallback
            if (data.length < targetCount) {
              const { data: fallback } = await supabase
                .from("secondhand_items")
                .select("id, title, images, price, location, category, condition")
                .eq("status", "active")
                .not("id", "in", `(${Array.from(fetchedIds).join(",")})`)
                .order("created_at", { ascending: false })
                .limit(targetCount - data.length);
              
              if (fallback) {
                fallback.forEach(i => {
                  if (!fetchedIds.has(i.id) && data.length < targetCount) {
                    fetchedIds.add(i.id);
                    data.push(mapSecondhand(i));
                  }
                });
              }
            }
            break;
          }

          case "job": {
            const fetchedIds = new Set<string>([currentItemId]);

            // Query 1: Same job type + location
            if (jobType && location) {
              const { data: exact } = await supabase
                .from("jobs")
                .select("id, title, company_name, location, job_type, salary_min, salary_max, scope")
                .eq("status", "active")
                .eq("job_type", jobType)
                .eq("location", location)
                .neq("id", currentItemId)
                .limit(targetCount);
              
              if (exact) {
                exact.forEach(j => {
                  if (!fetchedIds.has(j.id) && data.length < targetCount) {
                    fetchedIds.add(j.id);
                    data.push(mapJob(j));
                  }
                });
              }
            }

            // Query 2: Same job type
            if (data.length < targetCount && jobType) {
              const { data: byType } = await supabase
                .from("jobs")
                .select("id, title, company_name, location, job_type, salary_min, salary_max, scope")
                .eq("status", "active")
                .eq("job_type", jobType)
                .not("id", "in", `(${Array.from(fetchedIds).join(",")})`)
                .limit(targetCount - data.length);
              
              if (byType) {
                byType.forEach(j => {
                  if (!fetchedIds.has(j.id) && data.length < targetCount) {
                    fetchedIds.add(j.id);
                    data.push(mapJob(j));
                  }
                });
              }
            }

            // Fallback
            if (data.length < targetCount) {
              const { data: fallback } = await supabase
                .from("jobs")
                .select("id, title, company_name, location, job_type, salary_min, salary_max, scope")
                .eq("status", "active")
                .not("id", "in", `(${Array.from(fetchedIds).join(",")})`)
                .order("created_at", { ascending: false })
                .limit(targetCount - data.length);
              
              if (fallback) {
                fallback.forEach(j => {
                  if (!fetchedIds.has(j.id) && data.length < targetCount) {
                    fetchedIds.add(j.id);
                    data.push(mapJob(j));
                  }
                });
              }
            }
            break;
          }

          case "business": {
            const fetchedIds = new Set<string>([currentItemId]);

            // Query 1: Same category + location
            if (category && location) {
              const { data: exact } = await supabase
                .from("businesses")
                .select("id, title, images, price, location, category, business_type")
                .eq("status", "active")
                .eq("category", category)
                .eq("location", location)
                .neq("id", currentItemId)
                .limit(targetCount);
              
              if (exact) {
                exact.forEach(b => {
                  if (!fetchedIds.has(b.id) && data.length < targetCount) {
                    fetchedIds.add(b.id);
                    data.push(mapBusiness(b));
                  }
                });
              }
            }

            // Query 2: Same category
            if (data.length < targetCount && category) {
              const { data: byCategory } = await supabase
                .from("businesses")
                .select("id, title, images, price, location, category, business_type")
                .eq("status", "active")
                .eq("category", category)
                .not("id", "in", `(${Array.from(fetchedIds).join(",")})`)
                .limit(targetCount - data.length);
              
              if (byCategory) {
                byCategory.forEach(b => {
                  if (!fetchedIds.has(b.id) && data.length < targetCount) {
                    fetchedIds.add(b.id);
                    data.push(mapBusiness(b));
                  }
                });
              }
            }

            // Fallback
            if (data.length < targetCount) {
              const { data: fallback } = await supabase
                .from("businesses")
                .select("id, title, images, price, location, category, business_type")
                .eq("status", "active")
                .not("id", "in", `(${Array.from(fetchedIds).join(",")})`)
                .order("created_at", { ascending: false })
                .limit(targetCount - data.length);
              
              if (fallback) {
                fallback.forEach(b => {
                  if (!fetchedIds.has(b.id) && data.length < targetCount) {
                    fetchedIds.add(b.id);
                    data.push(mapBusiness(b));
                  }
                });
              }
            }
            break;
          }

          case "freelancer": {
            const fetchedIds = new Set<string>([currentItemId]);

            // Query 1: Same category + location
            if (category && location) {
              const { data: exact } = await supabase
                .from("freelancers")
                .select("id, full_name, title, avatar_url, hourly_rate, location, category, rating")
                .eq("availability", "available")
                .eq("category", category)
                .eq("location", location)
                .neq("id", currentItemId)
                .limit(targetCount);
              
              if (exact) {
                exact.forEach(f => {
                  if (!fetchedIds.has(f.id) && data.length < targetCount) {
                    fetchedIds.add(f.id);
                    data.push(mapFreelancer(f));
                  }
                });
              }
            }

            // Query 2: Same category
            if (data.length < targetCount && category) {
              const { data: byCategory } = await supabase
                .from("freelancers")
                .select("id, full_name, title, avatar_url, hourly_rate, location, category, rating")
                .eq("availability", "available")
                .eq("category", category)
                .not("id", "in", `(${Array.from(fetchedIds).join(",")})`)
                .limit(targetCount - data.length);
              
              if (byCategory) {
                byCategory.forEach(f => {
                  if (!fetchedIds.has(f.id) && data.length < targetCount) {
                    fetchedIds.add(f.id);
                    data.push(mapFreelancer(f));
                  }
                });
              }
            }

            // Fallback
            if (data.length < targetCount) {
              const { data: fallback } = await supabase
                .from("freelancers")
                .select("id, full_name, title, avatar_url, hourly_rate, location, category, rating")
                .eq("availability", "available")
                .not("id", "in", `(${Array.from(fetchedIds).join(",")})`)
                .order("created_at", { ascending: false })
                .limit(targetCount - data.length);
              
              if (fallback) {
                fallback.forEach(f => {
                  if (!fetchedIds.has(f.id) && data.length < targetCount) {
                    fetchedIds.add(f.id);
                    data.push(mapFreelancer(f));
                  }
                });
              }
            }
            break;
          }
        }
      } catch (error) {
        console.error("Error fetching similar items:", error);
      }

      setItems(data);
      setLoading(false);
    };

    // Helper functions for mapping data
    const mapProperty = (p: any): SimilarItem => ({
      id: p.id,
      title: p.street && p.house_number ? `${p.street} ${p.house_number}` : p.title,
      subtitle: `${p.street || ""}, ${p.location}`.trim().replace(/^,\s*/, ""),
      image: p.images?.[0] || property1,
      price: `₪ ${p.price?.toLocaleString("he-IL") || 0}`,
      location: p.location,
      details: `${p.rooms} חדרים • קומה ${p.floor || 0} • ${p.size || 0} מ"ר`,
    });

    const mapCar = (c: any): SimilarItem => ({
      id: c.id,
      title: `${c.manufacturer || ""} ${c.model}`,
      subtitle: c.location,
      image: c.images?.[0] || carImage,
      price: c.price ? `₪ ${parseFloat(c.price.replace(/,/g, "")).toLocaleString("he-IL")}` : "לא צוין מחיר",
      location: c.location,
      details: `${c.year} • ${c.km?.toLocaleString()} ק"מ • יד ${c.hand}`,
    });

    const mapLaptop = (l: any): SimilarItem => ({
      id: l.id,
      title: `${l.brand} ${l.model}`,
      subtitle: l.location,
      image: l.images?.[0] || laptopImage,
      price: `₪ ${l.price?.toLocaleString("he-IL") || 0}`,
      location: l.location,
      details: `${l.processor || ""} • ${l.ram}GB • ${l.storage}GB`,
    });

    const mapSecondhand = (i: any): SimilarItem => ({
      id: i.id,
      title: i.title,
      subtitle: i.location,
      image: i.images?.[0] || laptopImage,
      price: `₪ ${i.price?.toLocaleString("he-IL") || 0}`,
      location: i.location,
      details: `${i.category} • ${i.condition}`,
    });

    const mapJob = (j: any): SimilarItem => ({
      id: j.id,
      title: j.title,
      subtitle: j.company_name,
      image: jobImage,
      price: j.salary_min && j.salary_max 
        ? `₪ ${j.salary_min.toLocaleString("he-IL")} - ₪ ${j.salary_max.toLocaleString("he-IL")}`
        : "שכר לא צוין",
      location: j.location,
      details: `${j.job_type} • ${j.scope} • ${j.location}`,
    });

    const mapBusiness = (b: any): SimilarItem => ({
      id: b.id,
      title: b.title,
      subtitle: b.location,
      image: b.images?.[0] || jobImage,
      price: `₪ ${b.price?.toLocaleString("he-IL") || 0}`,
      location: b.location,
      details: `${b.category} • ${b.business_type}`,
    });

    const mapFreelancer = (f: any): SimilarItem => ({
      id: f.id,
      title: f.full_name,
      subtitle: f.title,
      image: f.avatar_url || jobImage,
      price: `₪ ${f.hourly_rate}/שעה`,
      location: f.location || "לא צוין",
      details: `${f.category}${f.rating ? ` • ⭐ ${f.rating}` : ""}`,
    });

    fetchSimilarItems();
  }, [itemType, currentItemId, location, propertyType, rooms, priceRange, manufacturer, brand, category, jobType]);

  const getItemLink = (id: string) => {
    const routes: Record<string, string> = {
      property: `/properties/${id}`,
      car: `/cars/${id}`,
      laptop: `/laptops/${id}`,
      secondhand: `/secondhand/${id}`,
      job: `/jobs/${id}`,
      business: `/businesses/${id}`,
      freelancer: `/freelancers/${id}`,
    };
    return routes[itemType];
  };

  const getTitle = () => {
    switch (itemType) {
      case "property": return "נכסים דומים למה שחיפשת";
      case "car": return "רכבים דומים למה שחיפשת";
      case "laptop": return "מחשבים דומים למה שחיפשת";
      case "job": return "משרות דומות למה שחיפשת";
      case "business": return "עסקים דומים למה שחיפשת";
      case "freelancer": return "פרילנסרים דומים למה שחיפשת";
      default: return "מודעות דומות למה שחיפשת";
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-foreground text-right">{getTitle()}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden border-0 shadow-sm" dir="rtl">
              <Skeleton className="aspect-[16/10] w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-6 w-24 mr-auto" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-foreground text-right">{getTitle()}</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            to={getItemLink(item.id)}
            className="block group"
          >
            <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-card h-full" dir="rtl">
              {/* Image with Heart */}
              <div className="aspect-[16/10] relative overflow-hidden bg-muted">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white rounded-full shadow-sm h-8 w-8"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </Button>
                <CloudflareImage
                  src={item.image}
                  alt={item.title}
                  preset="card"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-3 space-y-1">
                {/* Price */}
                <div className="text-right">
                  <span className="text-lg font-bold text-foreground">
                    {item.price}
                  </span>
                </div>
                
                {/* Address/Subtitle */}
                <p className="text-xs text-foreground text-right line-clamp-1">
                  {item.subtitle}
                </p>

                {/* Details */}
                <p className="text-xs text-muted-foreground text-right">
                  {item.details}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarListings;
