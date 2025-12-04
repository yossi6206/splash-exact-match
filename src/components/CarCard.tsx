import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import { CloudflareImage } from "@/components/CloudflareImage";

interface CarCardProps {
  car: {
    id: number | string;
    image: string;
    title: string;
    subtitle: string;
    manufacturer?: string | null;
    model?: string;
    year: number;
    hand: string;
    km?: number;
    fuel_type?: string | null;
    transmission?: string | null;
    condition?: string | null;
    color?: string | null;
    test_until?: string | null;
    price: number;
    location?: string;
    features: string[];
    clicks_count?: number;
    is_promoted?: boolean;
    promotion_end_date?: string;
  };
}

export const CarCard = ({ car }: CarCardProps) => {
  const carId = typeof car.id === 'string' ? car.id : car.id.toString();
  const isPromoted = car.is_promoted && 
    car.promotion_end_date && 
    new Date(car.promotion_end_date) > new Date();
  
  const { isFavorite, toggleFavorite } = useFavorites(carId, 'car');
  
  const handleClick = async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase
        .from("cars")
        .update({ clicks_count: (car.clicks_count || 0) + 1 })
        .eq("id", carId);
    } catch (error) {
      console.error("Error updating clicks count:", error);
    }
  };
  
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow bg-white border-border relative ${
      isPromoted ? 'ring-2 ring-primary/50 shadow-primary/10' : ''
    }`} dir="rtl">
      <Link to={`/cars/${carId}`} onClick={handleClick}>
        <div className="flex flex-col sm:flex-row-reverse gap-4 p-4">
          {/* Image */}
          <div className="w-full sm:w-64 h-48 rounded-lg overflow-hidden flex-shrink-0 relative">
            {isPromoted && (
              <Badge 
                className="absolute top-2 left-2 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg"
              >
                <Sparkles className="w-3 h-3 ml-1" />
                מקודם
              </Badge>
            )}
            
            {/* Heart Button on Image */}
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute top-2 right-2 z-20 bg-background/90 hover:bg-background rounded-full shadow-md backdrop-blur-sm text-muted-foreground hover:text-red-500"
              onClick={toggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            
            <CloudflareImage 
              src={car.image} 
              alt={car.title}
              preset="card"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <div className="mb-3 text-right">
              <h3 className="text-xl font-bold text-foreground mb-1">{car.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{car.subtitle}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                <span>{car.year}</span>
                <span>•</span>
                <span>{car.hand}</span>
                {car.km && (
                  <>
                    <span>•</span>
                    <span>{car.km.toLocaleString()} ק״מ</span>
                  </>
                )}
                {car.location && (
                  <>
                    <span>•</span>
                    <span>{car.location}</span>
                  </>
                )}
                {car.color && (
                  <>
                    <span>•</span>
                    <span>{car.color}</span>
                  </>
                )}
                {car.test_until && (
                  <>
                    <span>•</span>
                    <span>טסט: {(() => {
                      const date = new Date(car.test_until);
                      return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                    })()}</span>
                  </>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-4">
              {car.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="bg-muted text-foreground">
                  {feature}
                </Badge>
              ))}
            </div>

            {/* Price */}
            <div className="mt-auto text-right">
              <div className="text-3xl font-bold text-foreground">
                ₪{car.price.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};
