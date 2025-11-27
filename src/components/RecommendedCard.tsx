import { Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecommendedCardProps {
  image: string;
  title: string;
  price: string;
  location: string;
  category: string;
  timeAgo?: string;
}

const RecommendedCard = ({ 
  image, 
  title, 
  price, 
  location, 
  category,
  timeAgo 
}: RecommendedCardProps) => {
  return (
    <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 left-3 bg-background/90 hover:bg-background rounded-full shadow-md"
        >
          <Heart className="h-5 w-5" />
        </Button>
        {timeAgo && (
          <Badge className="absolute bottom-3 right-3 bg-background/95 text-foreground hover:bg-background">
            {timeAgo}
          </Badge>
        )}
      </div>
      <div className="p-4 bg-background">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className="text-xs font-medium">
            {category}
          </Badge>
        </div>
        <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2 text-right">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{location}</span>
          </div>
          <div className="text-xl font-bold text-foreground">{price} ₪</div>
        </div>
      </div>
    </Card>
  );
};

export default RecommendedCard;
