import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock } from "lucide-react";
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
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-6">
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage src={avatar_url} alt={full_name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(full_name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg mb-1 truncate group-hover:text-primary transition-colors">
              {full_name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
              {title}
            </p>
            
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({total_reviews} ביקורות)
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {bio}
          </p>
        )}

        {/* Category Badge */}
        <Badge variant="secondary" className="mb-3">
          {category}
        </Badge>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.slice(0, 4).map((skill, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs"
            >
              {skill}
            </Badge>
          ))}
          {skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{skills.length - 4}
            </Badge>
          )}
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0 flex items-center justify-between">
        {/* Hourly Rate */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div>
            <span className="font-bold text-lg text-primary">₪{hourly_rate}</span>
            <span className="text-sm text-muted-foreground">/שעה</span>
          </div>
        </div>

        {/* Contact Button */}
        <Button asChild size="sm">
          <Link to={`/freelancers/${id}`}>
            צור קשר
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FreelancerCard;
