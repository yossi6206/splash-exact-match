import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RecommendedCard from "./RecommendedCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Calendar } from "lucide-react";
import { CloudflareImage } from "@/components/CloudflareImage";
import itemPhone from "@/assets/item-phone.jpg";
import itemLaptop from "@/assets/item-laptop.jpg";
import itemCar from "@/assets/item-car.jpg";

const staticItems = [
  {
    id: 1,
    image: itemPhone,
    title: "iPhone 14 Pro Max 256GB כחול - מצב מצוין",
    price: "4,200",
    location: "תל אביב",
    category: "יד שניה",
    timeAgo: "לפני שעה",
  },
  {
    id: 2,
    image: itemLaptop,
    title: "מחשב נייד גיימינג ASUS ROG - RTX 4060",
    price: "6,500",
    location: "ירושלים",
    category: "יד שניה",
    timeAgo: "לפני 3 שעות",
  },
  {
    id: 3,
    image: itemCar,
    title: "מאזדה 3 2020 אוטומט - יד ראשונה",
    price: "85,000",
    location: "חיפה",
    category: "רכב",
    timeAgo: "לפני יום",
  },
];

const RecommendedItems = () => {
  const { data: projects } = useQuery({
    queryKey: ["homepage-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(2);
      
      if (error) throw error;
      return data;
    },
  });

  const formatPrice = (price: number | null) => {
    if (!price) return "לא צוין";
    return price.toLocaleString("he-IL");
  };

  return (
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
            מומלצים עבורך
          </h2>
          <a 
            href="#" 
            className="text-sm md:text-base font-semibold text-primary hover:text-primary/80 transition-colors duration-200 flex items-center gap-2"
          >
            צפה בכל
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
          {/* Static items */}
          {staticItems.map((item) => (
            <RecommendedCard key={item.id} {...item} />
          ))}
          
          {/* Dynamic projects */}
          {projects?.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group h-full">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <CloudflareImage
                    src={project.images?.[0] || "/placeholder.svg"}
                    alt={project.title}
                    preset="card"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px]">
                    פרויקט חדש
                  </Badge>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-foreground line-clamp-2 mb-1">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
                    <MapPin className="h-3 w-3" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
                    <Building2 className="h-3 w-3" />
                    <span>{project.developer_name}</span>
                  </div>
                  {project.delivery_date && (
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
                      <Calendar className="h-3 w-3" />
                      <span>אכלוס: {project.delivery_date}</span>
                    </div>
                  )}
                  <div className="text-primary font-bold text-sm">
                    {project.min_price && project.max_price ? (
                      `₪${formatPrice(project.min_price)} - ₪${formatPrice(project.max_price)}`
                    ) : project.min_price ? (
                      `החל מ-₪${formatPrice(project.min_price)}`
                    ) : (
                      "צור קשר למחיר"
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedItems;
