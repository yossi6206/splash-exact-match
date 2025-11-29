import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SecondhandCardProps {
  item: {
    id: number;
    image: string;
    title: string;
    category: string;
    subcategory?: string;
    condition: string;
    price: number;
    location: string;
    brand?: string;
    size?: string;
    color?: string;
    material?: string;
    age?: string;
    features?: string[];
  };
}

export const SecondhandCard = ({ item }: SecondhandCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-card border">
      <Link to={`/secondhand/${item.id}`}>
        <div className="relative">
          {/* Image */}
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          
          {/* Favorite Button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute top-3 left-3 bg-background/90 hover:bg-background rounded-full shadow-md backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>

          {/* Condition Badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-background/90 hover:bg-background text-foreground border backdrop-blur-sm">
              {item.condition}
            </Badge>
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-3 right-3">
            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
              {item.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <div>
            <h3 className="font-bold text-lg text-foreground line-clamp-2 mb-1">
              {item.title}
            </h3>
            {item.subcategory && (
              <p className="text-sm text-muted-foreground">
                {item.subcategory}
              </p>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {item.brand && <span>• {item.brand}</span>}
            {item.size && <span>• מידה {item.size}</span>}
            {item.color && <span>• {item.color}</span>}
            {item.material && <span>• {item.material}</span>}
            {item.age && <span>• גיל {item.age}</span>}
          </div>

          {/* Features */}
          {item.features && item.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.features.slice(0, 2).map((feature, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-muted/50 text-foreground border-0"
                >
                  {feature}
                </Badge>
              ))}
              {item.features.length > 2 && (
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-muted/50 text-foreground border-0"
                >
                  +{item.features.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{item.location}</span>
          </div>

          {/* Price */}
          <div className="pt-2 border-t">
            <div className="text-2xl font-bold text-foreground">
              ₪{item.price.toLocaleString()}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};
