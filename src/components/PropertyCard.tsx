import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import { CloudflareImage } from "@/components/CloudflareImage";

interface PropertyCardProps {
  property: {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    propertyType: string;
    condition: string;
    price: string;
    location: string;
    rooms: number;
    size: number;
    floor: number;
    year?: number;
    features: string[] | null;
    clicks_count?: number;
    is_promoted?: boolean;
    promotion_end_date?: string;
    listing_type?: string;
  };
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const isPromoted = property.is_promoted && 
    property.promotion_end_date && 
    new Date(property.promotion_end_date) > new Date();

  const { isFavorite, toggleFavorite } = useFavorites(property.id, 'property');

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
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow bg-white border-border relative ${
      isPromoted ? 'ring-2 ring-primary/50 shadow-primary/10' : ''
    }`} dir="rtl">
      <Link to={`/properties/${property.id}`} onClick={handleClick}>
        <div className="flex flex-col sm:flex-row-reverse p-2">
          {/* Image */}
          <div className="w-full sm:w-72 h-48 sm:h-auto sm:self-stretch overflow-hidden flex-shrink-0 relative rounded-lg">
            {isPromoted && (
              <div className="absolute top-2 left-2 z-10">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
                  <Sparkles className="w-3 h-3 ml-1" />
                  מקודם
                </Badge>
              </div>
            )}
            
            {/* Heart Button on Image */}
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute top-3 right-3 z-20 bg-background/90 hover:bg-background rounded-full shadow-md backdrop-blur-sm text-muted-foreground hover:text-red-500 h-9 w-9"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(e);
              }}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            
            <CloudflareImage 
              src={property.image} 
              alt={property.title}
              preset="card"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col p-4">
            <div className="mb-3 text-right">
              <h3 className="text-lg font-bold text-foreground mb-1">
                {property.listing_type && `${property.listing_type} • `}{property.propertyType} • {property.rooms} חד' • קומה {property.floor} • {property.size} מ"ר
              </h3>
              <p className="text-sm text-muted-foreground">{property.location}</p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <Badge variant="secondary" className="bg-muted text-foreground text-xs">
                {property.rooms} חדרים
              </Badge>
              <Badge variant="secondary" className="bg-muted text-foreground text-xs">
                {property.size} מ"ר
              </Badge>
              {property.features && property.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="secondary" className="bg-muted text-foreground text-xs">
                  {feature}
                </Badge>
              ))}
              {property.features && property.features.length > 3 && (
                <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                  +{property.features.length - 3}
                </Badge>
              )}
            </div>

            {/* Price */}
            <div className="mt-auto text-right">
              <div className="text-3xl font-bold text-foreground">
                ₪{property.price}
              </div>
              <div className="text-sm text-muted-foreground">{property.location}</div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default PropertyCard;
