import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CloudflareImage } from "@/components/CloudflareImage";
import { MapPin } from "lucide-react";
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
  condition?: string;
  badges?: string[];
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
              .select("id, title, images, price, location, property_type, rooms, street, house_number, size, condition, features")
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
                subtitle: `${p.rooms} חדרים • ${p.size || 0} מ"ר • ${p.property_type}`,
                image: p.images?.[0] || property1,
                price: `₪${p.price?.toLocaleString("he-IL") || 0}`,
                location: p.location,
                condition: p.condition || undefined,
                badges: p.features?.slice(0, 3) || [],
              }));
            }
            break;
          }

          case "car": {
            let query = supabase
              .from("cars")
              .select("id, manufacturer, model, images, price, location, year, km, hand, condition, features")
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
                subtitle: `${c.year} • ${c.km?.toLocaleString()} ק"מ • יד ${c.hand}`,
                image: c.images?.[0] || carImage,
                price: c.price ? `₪${parseFloat(c.price.replace(/,/g, "")).toLocaleString("he-IL")}` : "לא צוין מחיר",
                location: c.location,
                condition: c.condition || undefined,
                badges: c.features?.slice(0, 3) || [],
              }));
            }
            break;
          }

          case "laptop": {
            let query = supabase
              .from("laptops")
              .select("id, brand, model, images, price, location, condition, ram, storage, processor, features")
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
                subtitle: `${l.processor || ""} ${l.ram}GB ${l.storage}GB`.trim(),
                image: l.images?.[0] || laptopImage,
                price: `₪${l.price?.toLocaleString("he-IL") || 0}`,
                location: l.location,
                condition: l.condition || undefined,
                badges: l.features?.slice(0, 3) || [],
              }));
            }
            break;
          }

          case "secondhand": {
            let query = supabase
              .from("secondhand_items")
              .select("id, title, images, price, location, category, condition, brand, features")
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
                subtitle: `${i.category}${i.brand ? ` • ${i.brand}` : ""}`,
                image: i.images?.[0] || laptopImage,
                price: `₪${i.price?.toLocaleString("he-IL") || 0}`,
                location: i.location,
                condition: i.condition || undefined,
                badges: i.features?.slice(0, 3) || [],
              }));
            }
            break;
          }

          case "job": {
            let query = supabase
              .from("jobs")
              .select("id, title, company_name, location, job_type, salary_min, salary_max, scope, benefits")
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
                subtitle: `${j.company_name} • ${j.job_type} • ${j.scope}`,
                image: jobImage,
                price: j.salary_min && j.salary_max 
                  ? `₪${j.salary_min.toLocaleString("he-IL")} - ₪${j.salary_max.toLocaleString("he-IL")}`
                  : "שכר לא צוין",
                location: j.location,
                badges: j.benefits?.slice(0, 3) || [],
              }));
            }
            break;
          }

          case "business": {
            let query = supabase
              .from("businesses")
              .select("id, title, images, price, location, category, business_type, years_operating, includes")
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
                subtitle: `${b.category} • ${b.business_type}${b.years_operating ? ` • ${b.years_operating} שנים` : ""}`,
                image: b.images?.[0] || jobImage,
                price: `₪${b.price?.toLocaleString("he-IL") || 0}`,
                location: b.location,
                badges: b.includes?.slice(0, 3) || [],
              }));
            }
            break;
          }

          case "freelancer": {
            let query = supabase
              .from("freelancers")
              .select("id, full_name, title, avatar_url, hourly_rate, location, category, rating, skills")
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
                subtitle: `${f.title} • ${f.category}${f.rating ? ` • ⭐ ${f.rating}` : ""}`,
                image: f.avatar_url || jobImage,
                price: `₪${f.hourly_rate}/שעה`,
                location: f.location || "לא צוין",
                badges: f.skills?.slice(0, 3) || [],
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

  const SectionHeader = () => (
    <div className="flex items-center gap-3">
      <div className="h-10 w-1.5 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
      <div>
        <h2 className="text-2xl font-bold text-foreground">מודעות דומות</h2>
        <p className="text-sm text-muted-foreground">פריטים נוספים שעשויים לעניין אותך</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <SectionHeader />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden" dir="rtl">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2 justify-center">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-24 mx-auto" />
                <Skeleton className="h-8 w-32 mx-auto" />
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
    <div className="space-y-6">
      <SectionHeader />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Link
            key={item.id}
            to={getItemLink(item.id)}
            className="block group"
          >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-card border-border h-full" dir="rtl">
              {/* Image */}
              <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                {item.condition && (
                  <Badge className="absolute top-3 right-3 z-10 bg-background/95 text-foreground border-0 shadow-sm">
                    {item.condition}
                  </Badge>
                )}
                <CloudflareImage
                  src={item.image}
                  alt={item.title}
                  preset="card"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                {/* Title */}
                <h3 className="text-lg font-bold text-foreground text-center group-hover:text-primary transition-colors line-clamp-1">
                  {item.title}
                </h3>
                
                {/* Subtitle */}
                <p className="text-sm text-muted-foreground text-center line-clamp-1">
                  {item.subtitle}
                </p>

                {/* Badges */}
                {item.badges && item.badges.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {item.badges.map((badge, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs bg-muted/50 border-border"
                      >
                        {badge}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Location */}
                <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground pt-2 border-t border-border/50">
                  <MapPin className="h-4 w-4" />
                  <span>{item.location}</span>
                </div>

                {/* Price */}
                <div className="text-center pt-2">
                  <span className="text-2xl font-bold text-foreground">
                    {item.price}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarListings;
