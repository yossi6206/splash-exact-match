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
      <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/20 cursor-pointer">
        <CardContent className="p-5">
          {/* Header with Avatar and Basic Info */}
          <div className="flex items-start gap-4 mb-4 pb-4 border-b">
            <Avatar className="w-14 h-14 ring-2 ring-primary/10 shrink-0">
              <AvatarImage src={avatar_url} alt={full_name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(full_name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg mb-1 truncate text-foreground">
                {full_name}
              </h3>
              <p className="text-sm font-medium text-primary mb-2 line-clamp-1">
                {title}
              </p>
              
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">
                    ({total_reviews})
                  </span>
                </div>
                
                {location && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {bio && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {bio}
              </p>
            </div>
          )}

          {/* Category Badge */}
          <div className="mb-3">
            <Badge variant="secondary" className="font-medium">
              <Award className="w-3 h-3 mr-1" />
              {category}
            </Badge>
          </div>

          {/* Skills Section */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">מיומנויות עיקריות:</p>
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 5).map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs px-2 py-0.5 bg-background"
                >
                  {skill}
                </Badge>
              ))}
              {skills.length > 5 && (
                <Badge 
                  variant="outline" 
                  className="text-xs px-2 py-0.5 font-semibold bg-primary/5 text-primary border-primary/20"
                >
                  +{skills.length - 5} נוספות
                </Badge>
              )}
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-4 border-t mt-auto">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-2xl font-bold text-foreground">₪{hourly_rate}</span>
              <span className="text-sm text-muted-foreground">/שעה</span>
            </div>
            <Button 
              size="sm" 
              className="px-4"
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
