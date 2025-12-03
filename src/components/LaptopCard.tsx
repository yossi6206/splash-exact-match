import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import { CloudflareImage } from "@/components/CloudflareImage";

interface LaptopCardProps {
  laptop: {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    price: number;
    condition: string;
    location: string;
    features: string[];
    clicks_count?: number;
  };
}

export const LaptopCard = ({ laptop }: LaptopCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites(laptop.id, 'laptop');
  
  const handleClick = async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase
        .from("laptops")
        .update({ clicks_count: (laptop.clicks_count || 0) + 1 })
        .eq("id", String(laptop.id));
    } catch (error) {
      console.error("Error updating clicks count:", error);
    }
  };
  
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-card border relative" dir="rtl">
      <Link to={`/laptops/${laptop.id}`} onClick={handleClick}>
        <div className="relative">
          {/* Image */}
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <CloudflareImage 
              src={laptop.image} 
              alt={laptop.title}
              preset="card"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Condition Badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-background/90 hover:bg-background text-foreground border backdrop-blur-sm">
              {laptop.condition}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <div className="text-right">
            <h3 className="font-bold text-lg text-foreground line-clamp-1 mb-1">
              {laptop.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
              {laptop.subtitle}
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-1.5">
            {laptop.features.slice(0, 2).map((feature, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-muted/50 text-foreground border-0"
              >
                {feature}
              </Badge>
            ))}
            {laptop.features.length > 2 && (
              <Badge 
                variant="secondary" 
                className="text-xs bg-muted/50 text-foreground border-0"
              >
                +{laptop.features.length - 2}
              </Badge>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{laptop.location}</span>
          </div>

          {/* Price */}
          <div className="pt-2 border-t">
            <div className="text-2xl font-bold text-foreground">
              ₪{laptop.price.toLocaleString()}
            </div>
          </div>
        </div>
      </Link>
      
      {/* Heart Button - Outside Link to prevent disappearing on hover */}
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute top-3 right-3 z-20 bg-background/90 hover:bg-background rounded-full shadow-md backdrop-blur-sm text-muted-foreground hover:text-red-500"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(e);
        }}
      >
        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
      </Button>
    </Card>
  );
};