import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Award, MessageCircle, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useFavorites } from "@/hooks/useFavorites";

interface FreelancerCardProps {
  id: string;
  full_name: string;
  avatar_url?: string;
  title: string;
  bio?: string;
  skills: string[];
  hourly_rate: number;
  rating: number;
  total_reviews: number;
  location?: string;
  category: string;
  user_id: string;
}

const FreelancerCard = ({
  id,
  full_name,
  avatar_url,
  title,
  bio,
  skills,
  hourly_rate,
  rating,
  total_reviews,
  location,
  category,
  user_id,
}: FreelancerCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isOnline } = useOnlineStatus(user_id);
  const { isFavorite, toggleFavorite } = useFavorites(id, 'freelancer');

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const handleClick = async () => {
    try {
      await supabase
        .from("freelancers")
        .update({ clicks_count: (await supabase.from("freelancers").select("clicks_count").eq("id", id).single()).data?.clicks_count || 0 + 1 })
        .eq("id", id);
    } catch (error) {
      console.error("Error updating clicks:", error);
    }
  };

  const handleChatClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "נדרשת התחברות",
        description: "אנא התחבר כדי לשלוח הודעה לבעל המקצוע",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    // Increment contacts count
    try {
      const { data: currentData } = await supabase
        .from("freelancers")
        .select("contacts_count")
        .eq("id", id)
        .single();
      
      await supabase
        .from("freelancers")
        .update({ contacts_count: (currentData?.contacts_count || 0) + 1 })
        .eq("id", id);
    } catch (error) {
      console.error("Error updating contacts:", error);
    }

    // Navigate to messages page with freelancer info
    navigate("/messages", { 
      state: { 
        freelancerId: id,
        freelancerName: full_name,
        freelancerAvatar: avatar_url
      }
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-border bg-card group h-full relative" dir="rtl">
      <Link to={`/freelancers/${id}`} className="block" onClick={handleClick}>
        <CardContent className="p-6 space-y-4">
          {/* Avatar and Online Status */}
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <Avatar className="h-16 w-16 ring-2 ring-primary/10">
                <AvatarImage src={avatar_url} alt={full_name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(full_name)}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-card rounded-full ${
                isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`} />
            </div>
            
            <div className="flex-1 min-w-0 text-right">
              <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors truncate">
                {full_name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{title}</p>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{rating.toFixed(1)}</span>
                    <span>({total_reviews || 0})</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {bio && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed text-right">
              {bio}
            </p>
          )}

          {/* Category Badge */}
          <Badge variant="secondary" className="w-fit">
            {category}
          </Badge>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{skills.length - 3}
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  ₪{hourly_rate.toLocaleString()} לשעה
                </p>
              </div>
            </div>
            
            <Button 
              size="sm" 
              className="px-3 h-7 text-xs gap-1.5"
              onClick={handleChatClick}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              צ'אט
            </Button>
          </div>
        </CardContent>
      </Link>
      
      {/* Heart Button - Outside Link to prevent disappearing on hover */}
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute top-6 left-6 z-10 text-muted-foreground hover:text-red-500 hover:bg-background/80 backdrop-blur-sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(e);
        }}
      >
        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
      </Button>
    </Card>
  );
};

export default FreelancerCard;
