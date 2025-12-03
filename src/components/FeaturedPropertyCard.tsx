import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CloudflareImage } from "@/components/CloudflareImage";

interface FeaturedPropertyCardProps {
  property: {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    propertyType: string;
    condition: string;
    price: number | string;
    location: string;
    rooms: number;
    size: number;
    floor: number;
    features: string[];
    clicks_count?: number;
    listing_type?: string;
    street?: string;
    house_number?: string;
  };
}

const FeaturedPropertyCard = ({ property }: FeaturedPropertyCardProps) => {
  const handleClick = async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase
        .from("properties")
        .update({ clicks_count: (property.clicks_count || 0) + 1 })
        .eq("id", String(property.id));
    } catch (error) {
      console.error("Error updating clicks count:", error);
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-card border-border group relative">
      <Link to={`/properties/${property.id}`} onClick={handleClick}>
        {/* Image with Navigation Arrows */}
        <div className="relative h-40 md:h-48 lg:h-64 overflow-hidden">
          <CloudflareImage 
            src={property.image} 
            alt={property.title}
            preset="card"
            className="w-full h-full object-cover"
          />
          
          {/* Listing Type Badge */}
          {property.listing_type && (
            <Badge className="absolute top-2 right-2 md:top-3 md:right-3 z-20 bg-primary text-primary-foreground font-semibold">
              {property.listing_type}
            </Badge>
          )}
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 md:top-3 md:left-3 bg-white hover:bg-white/90 rounded-full shadow-md h-8 w-8 md:h-10 md:w-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="h-4 w-4 md:h-5 md:w-5 text-foreground" />
          </Button>

          {/* Navigation Arrows - Hidden on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 bg-white hover:bg-white/90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 bg-white hover:bg-white/90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-3 md:p-4 text-right" dir="rtl">
          <h3 className="text-base md:text-lg font-bold text-foreground mb-1 truncate">
            {property.street && property.house_number ? `${property.street} ${property.house_number}` : property.title}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mb-0.5 truncate">
            {property.propertyType}, {property.location}
          </p>
          <p className="text-xs md:text-sm text-muted-foreground mb-2">
            {property.rooms} חדרים • קומה {property.floor} • {property.size} מ"ר
          </p>
          <div className="text-xl md:text-2xl font-bold text-foreground">
            {property.price ? `₪${Number(property.price).toLocaleString()}` : 'לא צוין מחיר'}
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default FeaturedPropertyCard;
