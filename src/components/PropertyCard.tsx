import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PropertyCardProps {
  image: string;
  price: string;
  location: string;
  rooms: number;
}

const PropertyCard = ({ image, price, location, rooms }: PropertyCardProps) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={location}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 left-3 bg-background/90 hover:bg-background rounded-full shadow-md"
        >
          <Heart className="h-5 w-5" />
        </Button>
      </div>
      <div className="p-4 bg-background">
        <div className="text-2xl font-bold text-foreground mb-1">{price} ₪</div>
        <div className="text-sm text-foreground/70 mb-1">{location}</div>
        <div className="text-sm text-foreground/60">{rooms} חדרים</div>
      </div>
    </Card>
  );
};

export default PropertyCard;
