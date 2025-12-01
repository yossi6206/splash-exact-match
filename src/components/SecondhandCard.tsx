import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Truck, HandshakeIcon, Calendar, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";

interface SecondhandCardProps {
  item: {
    id: string | number;
    image?: string;
    images?: string[];
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
    delivery_available?: boolean;
    negotiable?: boolean;
    year_manufactured?: number;
    dimensions?: string;
    weight?: string;
    user_id?: string;
    seller_name?: string;
    clicks_count?: number;
  };
}

export const SecondhandCard = ({ item }: SecondhandCardProps) => {
  const displayImage = item.images && item.images.length > 0 ? item.images[0] : item.image;
  const { isFavorite, toggleFavorite } = useFavorites(String(item.id), 'secondhand');
  
  const handleClick = async () => {
    // Increment clicks count when user clicks on the card
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase
        .from("secondhand_items")
        .update({ clicks_count: (item.clicks_count || 0) + 1 })
        .eq("id", String(item.id));
    } catch (error) {
      console.error("Error updating clicks count:", error);
    }
  };
  
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-card border" dir="rtl">
      <Link to={`/secondhand/item/${String(item.id)}`} onClick={handleClick}>
        <div className="relative">
          {/* Image */}
          <div className="aspect-[4/3] overflow-hidden bg-muted">
            {displayImage ? (
              <img 
                src={displayImage} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <span className="text-muted-foreground">אין תמונה</span>
              </div>
            )}
          </div>
          
          {/* Favorite Button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute top-3 right-3 bg-background/90 hover:bg-background rounded-full shadow-md backdrop-blur-sm"
            onClick={toggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>

          {/* Badges - Top Left */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge className="bg-background/90 hover:bg-background text-foreground border backdrop-blur-sm">
              {item.condition}
            </Badge>
            {item.delivery_available && (
              <Badge className="bg-green-500/90 text-white border-0 backdrop-blur-sm flex items-center gap-1">
                <Truck className="h-3 w-3" />
                משלוח
              </Badge>
            )}
            {item.negotiable && (
              <Badge className="bg-blue-500/90 text-white border-0 backdrop-blur-sm flex items-center gap-1">
                <HandshakeIcon className="h-3 w-3" />
                מיקוח
              </Badge>
            )}
          </div>

          {/* Category Badge - Bottom Left */}
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
              {item.category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <div className="text-right">
            <h3 className="font-bold text-lg text-foreground line-clamp-2 mb-1">
              {item.title}
            </h3>
            {item.subcategory && (
              <p className="text-sm text-muted-foreground">
                {item.subcategory}
              </p>
            )}
          </div>

          {/* Details Grid */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {item.brand && (
                <Badge variant="outline" className="text-xs">
                  {item.brand}
                </Badge>
              )}
              {item.size && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Ruler className="h-3 w-3" />
                  {item.size}
                </Badge>
              )}
              {item.year_manufactured && (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {item.year_manufactured}
                </Badge>
              )}
            </div>

            {/* Color & Material Tags */}
            <div className="flex flex-wrap gap-1.5">
              {item.color && (
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-muted/70 text-foreground border-0"
                >
                  צבע: {item.color}
                </Badge>
              )}
              {item.material && (
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-muted/70 text-foreground border-0"
                >
                  חומר: {item.material}
                </Badge>
              )}
              {item.age && (
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-muted/70 text-foreground border-0"
                >
                  {item.age}
                </Badge>
              )}
            </div>
          </div>

          {/* Additional Details */}
          {(item.dimensions || item.weight) && (
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {item.dimensions && <span>📏 {item.dimensions}</span>}
              {item.weight && <span>⚖️ {item.weight}</span>}
            </div>
          )}

          {/* Features */}
          {item.features && item.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.features.slice(0, 2).map((feature, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-primary/10 text-primary border-0"
                >
                  ✓ {feature}
                </Badge>
              ))}
              {item.features.length > 2 && (
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-primary/10 text-primary border-0"
                >
                  +{item.features.length - 2} עוד
                </Badge>
              )}
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{item.location}</span>
          </div>

          {/* Seller Link */}
          {item.user_id && item.seller_name && (
            <div 
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Link to={`/seller/${item.user_id}`} className="flex items-center gap-1">
                <span>מוכר: {item.seller_name}</span>
              </Link>
            </div>
          )}
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
