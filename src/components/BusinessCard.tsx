import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, TrendingUp, Users, Phone, Eye, Sparkles, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useFavorites } from "@/hooks/useFavorites";
import { CloudflareImage } from "@/components/CloudflareImage";

interface BusinessCardProps {
  id: string;
  title: string;
  description?: string;
  business_type: string;
  category: string;
  price: number;
  location: string;
  annual_revenue?: number;
  monthly_profit?: number;
  years_operating?: number;
  employees_count?: number;
  images?: string[];
  clicks_count?: number;
  is_promoted?: boolean;
  promotion_end_date?: string;
}

const BusinessCard = ({
  id,
  title,
  description,
  business_type,
  category,
  price,
  location,
  annual_revenue,
  monthly_profit,
  years_operating,
  employees_count,
  images,
  clicks_count = 0,
  is_promoted,
  promotion_end_date,
}: BusinessCardProps) => {
  const isPromoted = is_promoted && 
    promotion_end_date && 
    new Date(promotion_end_date) > new Date();
  
  const { isFavorite, toggleFavorite } = useFavorites(id, 'business');
  
  const handleClick = async () => {
    try {
      await supabase
        .from("businesses")
        .update({ clicks_count: clicks_count + 1 })
        .eq("id", id);
    } catch (error) {
      console.error("Error updating clicks:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/50 relative ${
      isPromoted ? 'ring-2 ring-primary/50 shadow-primary/10' : ''
    }`} dir="rtl">
      <Link to={`/businesses/${id}`} onClick={handleClick}>
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-muted">
          {isPromoted && (
            <Badge 
              className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg"
            >
              <Sparkles className="w-3 h-3 ml-1" />
              מקודם
            </Badge>
          )}
          {images && images.length > 0 ? (
            <CloudflareImage
              src={images[0]}
              alt={title}
              preset="card"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-primary/90 backdrop-blur-sm">
              {category}
            </Badge>
          </div>
          {years_operating && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                {years_operating} שנים
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-5">
          {/* Title & Type */}
          <div className="space-y-2 mb-4 text-right">
            <h3 className="text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span>{business_type}</span>
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 text-right">
              {description}
            </p>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {annual_revenue && (
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">מחזור שנתי</div>
                  <div className="font-semibold">{formatPrice(annual_revenue)}</div>
                </div>
              </div>
            )}
            {monthly_profit && (
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <div>
                  <div className="text-xs text-muted-foreground">רווח חודשי</div>
                  <div className="font-semibold">{formatPrice(monthly_profit)}</div>
                </div>
              </div>
            )}
            {employees_count && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">עובדים</div>
                  <div className="font-semibold">{employees_count}</div>
                </div>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 flex items-center justify-between border-t">
          <div>
            <div className="text-2xl font-bold text-primary">
              {formatPrice(price)}
            </div>
            <div className="text-xs text-muted-foreground">מחיר מבוקש</div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{clicks_count || 0}</span>
            </div>
          </div>
        </CardFooter>
      </Link>
      
      {/* Heart Button - Outside Link to prevent disappearing on hover */}
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute top-3 right-3 z-20 bg-background/90 hover:bg-background rounded-full shadow-md backdrop-blur-sm text-muted-foreground hover:text-red-500"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(e);
        }}
      >
        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
      </Button>
    </Card>
  );
};

export default BusinessCard;