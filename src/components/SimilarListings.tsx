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

      try {
        switch (itemType) {
          case "property": {
            let query = supabase
              .from("properties")
              .select("id, title, images, price, location, property_type, rooms, street, house_number, size, floor")
              .eq("status", "active")
              .neq("id", currentItemId)
              .limit(6);

            if (location) query = query.eq("location", location);
            if (propertyType) query = query.eq("property_type", propertyType);
            if (rooms) query = query.gte("rooms", rooms - 1).lte("rooms", rooms + 1);

            const { data: properties, error } = await query;
            if (!error && properties) {
              data = properties.map((p) => ({
                id: p.id,
                title: p.street && p.house_number ? `${p.street} ${p.house_number}` : p.title,
                subtitle: `${p.street || ""}, ${p.location}`.trim().replace(/^,\s*/, ""),
                image: p.images?.[0] || property1,
                price: `₪ ${p.price?.toLocaleString("he-IL") || 0}`,
                location: p.location,
                details: `${p.rooms} חדרים • קומה ${p.floor || 0} • ${p.size || 0} מ"ר`,
              }));
            }
            break;
          }

          case "car": {
            let query = supabase
              .from("cars")
              .select("id, manufacturer, model, images, price, location, year, km, hand")
              .eq("status", "active")
              .neq("id", currentItemId)
              .limit(6);

            if (manufacturer) query = query.eq("manufacturer", manufacturer);
            if (location) query = query.eq("location", location);

            const { data: cars, error } = await query;
            if (!error && cars) {
              data = cars.map((c) => ({
                id: c.id,
                title: `${c.manufacturer || ""} ${c.model}`,
                subtitle: c.location,
                image: c.images?.[0] || carImage,
                price: c.price ? `₪ ${parseFloat(c.price.replace(/,/g, "")).toLocaleString("he-IL")}` : "לא צוין מחיר",
                location: c.location,
                details: `${c.year} • ${c.km?.toLocaleString()} ק"מ • יד ${c.hand}`,
              }));
            }
            break;
          }

          case "laptop": {
            let query = supabase
              .from("laptops")
              .select("id, brand, model, images, price, location, condition, ram, storage, processor")
              .eq("status", "active")
              .neq("id", currentItemId)
              .limit(6);

            if (brand) query = query.eq("brand", brand);
            if (location) query = query.eq("location", location);

            const { data: laptops, error } = await query;
            if (!error && laptops) {
              data = laptops.map((l) => ({
                id: l.id,
                title: `${l.brand} ${l.model}`,
                subtitle: l.location,
                image: l.images?.[0] || laptopImage,
                price: `₪ ${l.price?.toLocaleString("he-IL") || 0}`,
                location: l.location,
                details: `${l.processor || ""} • ${l.ram}GB • ${l.storage}GB`,
              }));
            }
            break;
          }

          case "secondhand": {
            let query = supabase
              .from("secondhand_items")
              .select("id, title, images, price, location, category, condition")
              .eq("status", "active")
              .neq("id", currentItemId)
              .limit(6);

            if (category) query = query.eq("category", category);
            if (location) query = query.eq("location", location);

            const { data: items, error } = await query;
            if (!error && items) {
              data = items.map((i) => ({
                id: i.id,
                title: i.title,
                subtitle: i.location,
                image: i.images?.[0] || laptopImage,
                price: `₪ ${i.price?.toLocaleString("he-IL") || 0}`,
                location: i.location,
                details: `${i.category} • ${i.condition}`,
              }));
            }
            break;
          }

          case "job": {
            let query = supabase
              .from("jobs")
              .select("id, title, company_name, location, job_type, salary_min, salary_max, scope")
              .eq("status", "active")
              .neq("id", currentItemId)
              .limit(6);

            if (jobType) query = query.eq("job_type", jobType);
            if (location) query = query.eq("location", location);

            const { data: jobs, error } = await query;
            if (!error && jobs) {
              data = jobs.map((j) => ({
                id: j.id,
                title: j.title,
                subtitle: j.company_name,
                image: jobImage,
                price: j.salary_min && j.salary_max 
                  ? `₪ ${j.salary_min.toLocaleString("he-IL")} - ₪ ${j.salary_max.toLocaleString("he-IL")}`
                  : "שכר לא צוין",
                location: j.location,
                details: `${j.job_type} • ${j.scope} • ${j.location}`,
              }));
            }
            break;
          }

          case "business": {
            let query = supabase
              .from("businesses")
              .select("id, title, images, price, location, category, business_type")
              .eq("status", "active")
              .neq("id", currentItemId)
              .limit(6);

            if (category) query = query.eq("category", category);
            if (location) query = query.eq("location", location);

            const { data: businesses, error } = await query;
            if (!error && businesses) {
              data = businesses.map((b) => ({
                id: b.id,
                title: b.title,
                subtitle: b.location,
                image: b.images?.[0] || jobImage,
                price: `₪ ${b.price?.toLocaleString("he-IL") || 0}`,
                location: b.location,
                details: `${b.category} • ${b.business_type}`,
              }));
            }
            break;
          }

          case "freelancer": {
            let query = supabase
              .from("freelancers")
              .select("id, full_name, title, avatar_url, hourly_rate, location, category, rating")
              .eq("availability", "available")
              .neq("id", currentItemId)
              .limit(6);

            if (category) query = query.eq("category", category);
            if (location) query = query.eq("location", location);

            const { data: freelancers, error } = await query;
            if (!error && freelancers) {
              data = freelancers.map((f) => ({
                id: f.id,
                title: f.full_name,
                subtitle: f.title,
                image: f.avatar_url || jobImage,
                price: `₪ ${f.hourly_rate}/שעה`,
                location: f.location || "לא צוין",
                details: `${f.category}${f.rating ? ` • ⭐ ${f.rating}` : ""}`,
              }));
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

    fetchSimilarItems();
  }, [itemType, currentItemId, location, propertyType, rooms, manufacturer, brand, category, jobType]);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
