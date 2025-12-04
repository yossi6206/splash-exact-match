import { Link } from "react-router-dom";
import { MapPin, Building2, Calendar, Home, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CloudflareImage from "./CloudflareImage";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    developer_name: string;
    location: string;
    neighborhood: string | null;
    project_type: string;
    listing_type: string;
    min_price: number | null;
    max_price: number | null;
    min_rooms: number | null;
    max_rooms: number | null;
    delivery_date: string | null;
    images: string[] | null;
    total_units: number | null;
    available_units: number | null;
    buildings_count: number | null;
    is_promoted: boolean | null;
    promotion_end_date: string | null;
  };
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const isPromoted =
    project.is_promoted &&
    project.promotion_end_date &&
    new Date(project.promotion_end_date) > new Date();

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return price.toLocaleString("he-IL");
  };

  const getPriceDisplay = () => {
    const min = formatPrice(project.min_price);
    const max = formatPrice(project.max_price);
    
    if (min && max) {
      return `₪${min} - ₪${max}`;
    } else if (min) {
      return `החל מ-₪${min}`;
    } else if (max) {
      return `עד ₪${max}`;
    }
    return "צור קשר למחיר";
  };

  const getRoomsDisplay = () => {
    const min = project.min_rooms;
    const max = project.max_rooms;
    
    if (min && max && min !== max) {
      return `${min}-${max} חדרים`;
    } else if (min || max) {
      return `${min || max} חדרים`;
    }
    return null;
  };

  return (
    <Link to={`/projects/${project.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <CloudflareImage
            src={project.images?.[0] || "/placeholder.svg"}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Badge className="bg-primary text-primary-foreground">
              {project.listing_type}
            </Badge>
            {isPromoted && (
              <Badge className="bg-amber-500 text-white">מקודם</Badge>
            )}
          </div>
          
          {/* Developer Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-black/60 text-white border-0">
              {project.developer_name}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {project.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">
              {project.neighborhood ? `${project.location}, ${project.neighborhood}` : project.location}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {project.project_type && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{project.project_type}</span>
              </div>
            )}
            {getRoomsDisplay() && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Home className="h-4 w-4" />
                <span>{getRoomsDisplay()}</span>
              </div>
            )}
            {project.delivery_date && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>אכלוס: {project.delivery_date}</span>
              </div>
            )}
            {project.buildings_count && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Layers className="h-4 w-4" />
                <span>{project.buildings_count} בניינים</span>
              </div>
            )}
          </div>

          {/* Available Units */}
          {project.available_units && project.total_units && (
            <div className="text-sm text-muted-foreground mb-3">
              <span className="text-primary font-medium">{project.available_units}</span>
              {" "}יחידות פנויות מתוך {project.total_units}
            </div>
          )}

          {/* Price */}
          <div className="pt-3 border-t">
            <p className="text-lg font-bold text-primary">
              {getPriceDisplay()}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProjectCard;
