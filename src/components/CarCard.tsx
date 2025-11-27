import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CarCardProps {
  car: {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    year: number;
    hand: string;
    price: number;
    features: string[];
  };
}

export const CarCard = ({ car }: CarCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white border-border">
      <Link to={`/cars/${car.id}`}>
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          {/* Image */}
          <div className="w-full sm:w-64 h-48 rounded-lg overflow-hidden flex-shrink-0">
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{car.year}</span>
                  <span>•</span>
                  <span>{car.hand}</span>
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
