import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Award } from "lucide-react";
import { Link } from "react-router-dom";

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
}: FreelancerCardProps) => {
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  return (
    <Link to={`/freelancers/${id}`} className="block">
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.01] border hover:border-primary/20 cursor-pointer">
        <CardContent className="p-3.5">
          {/* Header with Avatar and Basic Info */}
          <div className="flex items-start gap-3 mb-3 pb-3 border-b">
            <Avatar className="w-11 h-11 ring-2 ring-primary/10 shrink-0">
              <AvatarImage src={avatar_url} alt={full_name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                {getInitials(full_name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base mb-0.5 truncate text-foreground">
                {full_name}
              </h3>
              <p className="text-xs font-medium text-primary mb-1.5 line-clamp-1">
                {title}
              </p>
              
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({total_reviews})</span>
                </div>
                
                {location && (
                  <div className="flex items-center gap-0.5 text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio Section - condensed */}
          {bio && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2.5">
              {bio}
            </p>
          )}

          {/* Category Badge */}
          <div className="mb-2.5">
            <Badge variant="secondary" className="text-xs py-0 h-5">
              <Award className="w-2.5 h-2.5 mr-1" />
              {category}
            </Badge>
          </div>

          {/* Skills Section */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 4).map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-[10px] px-1.5 py-0 h-5 bg-background"
                >
                  {skill}
                </Badge>
              ))}
              {skills.length > 4 && (
                <Badge 
                  variant="outline" 
                  className="text-[10px] px-1.5 py-0 h-5 font-semibold bg-primary/5 text-primary border-primary/20"
                >
                  +{skills.length - 4}
                </Badge>
              )}
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-2.5 border-t">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-lg font-bold text-foreground">₪{hourly_rate}</span>
              <span className="text-xs text-muted-foreground">/שעה</span>
            </div>
            <Button 
              size="sm" 
              className="px-3 h-7 text-xs"
              onClick={(e) => e.preventDefault()}
            >
              צור קשר
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FreelancerCard;
