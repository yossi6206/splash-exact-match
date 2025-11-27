import { Card } from "@/components/ui/card";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface FeaturedPropertyCardProps {
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
    features: string[];
  };
}

const FeaturedPropertyCard = ({ property }: FeaturedPropertyCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-card border-border group relative">
      <Link to={`/properties/${property.id}`}>
        {/* Image with Navigation Arrows */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={property.image} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white hover:bg-white/90 rounded-full shadow-md"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="h-5 w-5 text-foreground" />
          </Button>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white hover:bg-white/90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
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
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white hover:bg-white/90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 text-center">
          <div className="text-2xl font-bold text-foreground mb-2">
            ₪{property.price}
          </div>
          <div className="text-sm text-muted-foreground mb-1">
            {property.location}
          </div>
          <div className="text-sm text-muted-foreground">
            {property.rooms} חדרים
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default FeaturedPropertyCard;
