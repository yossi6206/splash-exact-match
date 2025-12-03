import { Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudflareImage } from "@/components/CloudflareImage";

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
        <CloudflareImage
          src={image}
          alt={title}
          preset="card"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 md:top-3 md:left-3 bg-background/90 hover:bg-background rounded-full shadow-md h-8 w-8 md:h-10 md:w-10"
        >
          <Heart className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
        {timeAgo && (
          <Badge className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-background/95 text-foreground hover:bg-background text-xs">
            {timeAgo}
          </Badge>
        )}
      </div>
      <div className="p-3 md:p-4 bg-background">
        <div className="flex items-start justify-between mb-1.5 md:mb-2">
          <Badge variant="secondary" className="text-[10px] md:text-xs font-medium">
            {category}
          </Badge>
        </div>
        <h3 className="text-sm md:text-base font-semibold text-foreground mb-1.5 md:mb-2 line-clamp-2 text-right">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3 md:h-4 md:w-4" />
            <span className="text-xs md:text-sm">{location}</span>
          </div>
          <div className="text-base md:text-xl font-bold text-foreground">{price} ₪</div>
        </div>
      </div>
    </Card>
  );
};

export default RecommendedCard;
