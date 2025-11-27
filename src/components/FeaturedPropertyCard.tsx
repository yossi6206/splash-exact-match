import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <Link to={`/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-card border-border group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={property.image} 
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Badge className="bg-background/90 text-foreground border-0">
              דירת {property.rooms} חדרים
            </Badge>
            <Badge className="bg-background/90 text-foreground border-0">
              {property.condition}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">
            {property.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
            {property.subtitle}
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-foreground">
                {property.price === "7,800" ? "₪7,800" : `₪${property.price}`}
              </div>
              <div className="text-xs text-muted-foreground">{property.location}</div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default FeaturedPropertyCard;
