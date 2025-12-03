import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CloudflareImage } from "@/components/CloudflareImage";
import { MapPin, Bed, Calendar, Gauge, Briefcase, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Default images for fallbacks
import property1 from "@/assets/property-1.jpg";
import carImage from "@/assets/item-car.jpg";
import laptopImage from "@/assets/item-laptop.jpg";
import jobImage from "@/assets/item-job.jpg";

interface SimilarListingsProps {
  itemType: "property" | "car" | "laptop" | "secondhand" | "job" | "business" | "freelancer";
  currentItemId: string;
  // Optional filters for better matching
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
  image: string;
  price: string | number;
  location: string;
  extraInfo: string;
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

      try {
        switch (itemType) {
          case "property": {
            let query = supabase
              .from("properties")
              .select("id, title, images, price, location, property_type, rooms, street, house_number")
              .eq("status", "active")
              .neq("id", currentItemId)
              .limit(6);

            // Priority: same location first
            if (location) {
              query = query.eq("location", location);
            }
            // Then same property type
            if (propertyType) {
              query = query.eq("property_type", propertyType);
            }
            // Similar rooms (±1)
            if (rooms) {
              query = query.gte("rooms", rooms - 1).lte("rooms", rooms + 1);
            }

            const { data: properties, error } = await query;
            if (!error && properties) {
              data = properties.map((p) => ({
                id: p.id,
                title: p.street && p.house_number 
                  ? `${p.street} ${p.house_number}` 
                  : p.title,
                image: p.images?.[0] || property1,
                price: `₪${p.price?.toLocaleString("he-IL") || 0}`,
                location: p.location,
                extraInfo: `${p.rooms} חדרים • ${p.property_type}`,
              }));
            }
            break;
          }

          case "car": {
            let query = supabase
              .from("cars")
              .select("id, manufacturer, model, images, price, location, year, km")
              .eq("status", "active")
              .neq("id", currentItemId)
              .limit(6);

            if (manufacturer) {
              query = query.eq("manufacturer", manufacturer);
            }
            if (location) {
              query = query.eq("location", location);
            }

            const { data: cars, error } = await query;
            if (!error && cars) {
              data = cars.map((c) => ({
                id: c.id,
                title: `${c.manufacturer || ""} ${c.model}`,
                image: c.images?.[0] || carImage,
                price: c.price ? `₪${parseFloat(c.price.replace(/,/g, "")).toLocaleString("he-IL")}` : "לא צוין מחיר",
                location: c.location,
                extraInfo: `${c.year} • ${c.km?.toLocaleString()} ק"מ`,
              }));
            }
            break;
          }

          case "laptop": {
            let query = supabase
              .from("laptops")
              .select("id, brand, model, images, price, location, condition, ram, storage")
              .eq("status", "active")
              .neq("id", currentItemId)
              .limit(6);

            if (brand) {
              query = query.eq("brand", brand);
            }
            if (location) {
              query = query.eq("location", location);
            }

            const { data: laptops, error } = await query;
            if (!error && laptops) {
              data = laptops.map((l) => ({
                id: l.id,
                title: `${l.brand} ${l.model}`,
                image: l.images?.[0] || laptopImage,
                price: `₪${l.price?.toLocaleString("he-IL") || 0}`,
                location: l.location,
                extraInfo: `${l.condition} • ${l.ram}GB RAM`,
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

            if (category) {
              query = query.eq("category", category);
            }
            if (location) {
              query = query.eq("location", location);
            }

            const { data: items, error } = await query;
            if (!error && items) {
              data = items.map((i) => ({
                id: i.id,
                title: i.title,
                image: i.images?.[0] || laptopImage,
                price: `₪${i.price?.toLocaleString("he-IL") || 0}`,
                location: i.location,
                extraInfo: `${i.category} • ${i.condition}`,
              }));
            }
            break;
          }

          case "job": {
            let query = supabase
              .from("jobs")
              .select("id, title, company_name, location, job_type, salary_min, salary_max")
              .eq("status", "active")
              .neq("id", currentItemId)
              .limit(6);

            if (jobType) {
              query = query.eq("job_type", jobType);
            }
            if (location) {
              query = query.eq("location", location);
            }

            const { data: jobs, error } = await query;
            if (!error && jobs) {
              data = jobs.map((j) => ({
                id: j.id,
                title: j.title,
                image: jobImage,
                price: j.salary_min && j.salary_max 
                  ? `₪${j.salary_min.toLocaleString("he-IL")} - ₪${j.salary_max.toLocaleString("he-IL")}`
                  : "שכר לא צוין",
                location: j.location,
                extraInfo: `${j.company_name} • ${j.job_type}`,
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

            if (category) {
              query = query.eq("category", category);
            }
            if (location) {
              query = query.eq("location", location);
            }

            const { data: businesses, error } = await query;
            if (!error && businesses) {
              data = businesses.map((b) => ({
                id: b.id,
                title: b.title,
                image: b.images?.[0] || jobImage,
                price: `₪${b.price?.toLocaleString("he-IL") || 0}`,
                location: b.location,
                extraInfo: `${b.category} • ${b.business_type}`,
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

            if (category) {
              query = query.eq("category", category);
            }
            if (location) {
              query = query.eq("location", location);
            }

            const { data: freelancers, error } = await query;
            if (!error && freelancers) {
              data = freelancers.map((f) => ({
                id: f.id,
                title: f.full_name,
                image: f.avatar_url || jobImage,
                price: `₪${f.hourly_rate}/שעה`,
                location: f.location || "לא צוין",
                extraInfo: `${f.title} • ${f.category}`,
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

  const getIcon = () => {
    switch (itemType) {
      case "property":
        return <Bed className="h-3.5 w-3.5" />;
      case "car":
        return <Gauge className="h-3.5 w-3.5" />;
      case "job":
        return <Briefcase className="h-3.5 w-3.5" />;
      case "business":
        return <Building2 className="h-3.5 w-3.5" />;
      default:
        return <Calendar className="h-3.5 w-3.5" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">מודעות דומות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[4/3] rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-right flex items-center justify-end gap-2">
            <span>מודעות דומות</span>
            <div className="h-1 w-8 bg-primary rounded-full" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>לא נמצאו מודעות דומות</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-right flex items-center justify-end gap-2">
          <span>מודעות דומות</span>
          <div className="h-1 w-8 bg-primary rounded-full" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {items.map((item, index) => (
            <Link
              key={item.id}
              to={getItemLink(item.id)}
              className="group block"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30 h-full flex flex-col">
                <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                  <CloudflareImage
                    src={item.image}
                    alt={item.title}
                    preset="card"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="font-semibold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors text-right leading-tight min-h-[2.5rem]">
                    {item.title}
                  </h3>
                  <p className="text-primary font-bold text-base mt-2 text-right">
                    {item.price}
                  </p>
                  <div className="mt-auto pt-2 border-t border-border/30">
                    <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                      <span className="line-clamp-1">{item.location}</span>
                      <MapPin className="h-3.5 w-3.5 text-primary/60 flex-shrink-0" />
                    </div>
                    <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground mt-1">
                      <span className="line-clamp-1">{item.extraInfo}</span>
                      {getIcon()}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimilarListings;
