import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow bg-white border-border ${
      isPromoted ? 'ring-2 ring-primary/50 shadow-primary/10' : ''
    }`}>
      <Link to={`/cars/${carId}`} onClick={handleClick}>
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          {/* Image */}
          <div className="w-full sm:w-64 h-48 rounded-lg overflow-hidden flex-shrink-0 relative">
            {isPromoted && (
              <Badge 
                className="absolute top-2 right-2 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg"
              >
                <Sparkles className="w-3 h-3 ml-1" />
                מקודם
              </Badge>
            )}
            <img 
              src={car.image} 
              alt={car.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <div>
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
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent">
                <Heart className="h-5 w-5" />
              </Button>
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
            <div className="mt-auto">
              <div className="text-3xl font-bold text-foreground">
                {car.price.toLocaleString()} ₪
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};
