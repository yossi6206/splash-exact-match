import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Building2, MapPin, Calendar, Home, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CloudflareImage from "./CloudflareImage";

interface Project {
  id: string;
  title: string;
  developer_name: string;
  location: string;
  min_price: number | null;
  max_price: number | null;
  min_rooms: number | null;
  max_rooms: number | null;
  delivery_date: string | null;
  images: string[] | null;
  project_type: string;
  listing_type: string;
  available_units: number | null;
}

const FeaturedProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(4);

      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return price.toLocaleString("he-IL");
  };

  const getPriceDisplay = (minPrice: number | null, maxPrice: number | null) => {
    if (minPrice && maxPrice) {
      return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)} ₪`;
    } else if (minPrice) {
      return `החל מ-${formatPrice(minPrice)} ₪`;
    } else if (maxPrice) {
      return `עד ${formatPrice(maxPrice)} ₪`;
    }
    return "לא צוין מחיר";
  };

  const getRoomsDisplay = (minRooms: number | null, maxRooms: number | null) => {
    if (minRooms && maxRooms && minRooms !== maxRooms) {
      return `${minRooms}-${maxRooms} חדרים`;
    } else if (minRooms) {
      return `${minRooms} חדרים`;
    } else if (maxRooms) {
      return `${maxRooms} חדרים`;
    }
    return null;
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-background relative overflow-hidden">
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-10 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Building2 className="w-6 h-6 md:w-7 md:h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                פרויקטים חדשים
              </h2>
              <p className="text-muted-foreground text-sm md:text-base mt-1">
                הזדמנויות השקעה ומגורים בפרויקטים חדשים
              </p>
            </div>
          </div>
          <Link
            to="/projects"
            className="group flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/20"
          >
            לכל הפרויקטים
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {projects.map((project) => (
            <Link key={project.id} to={`/projects/${project.id}`}>
              <Card className="group h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card/80 backdrop-blur-sm hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <CloudflareImage
                    src={project.images?.[0] || "/placeholder.svg"}
                    alt={project.title}
                    displayWidth={400}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Badge className="bg-primary text-primary-foreground shadow-md">
                      {project.listing_type === "למכירה" ? "למכירה" : project.listing_type === "להשכרה" ? "להשכרה" : "מסחרי"}
                    </Badge>
                    {project.available_units && (
                      <Badge variant="secondary" className="bg-white/90 text-foreground shadow-md">
                        {project.available_units} יחידות
                      </Badge>
                    )}
                  </div>

                  {/* Developer Name */}
                  <div className="absolute bottom-3 right-3 left-3">
                    <span className="text-white text-sm font-medium drop-shadow-lg">
                      {project.developer_name}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-foreground text-lg line-clamp-1 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary/70" />
                      <span className="truncate">{project.location}</span>
                    </div>
                    
                    {getRoomsDisplay(project.min_rooms, project.max_rooms) && (
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-primary/70" />
                        <span>{getRoomsDisplay(project.min_rooms, project.max_rooms)}</span>
                      </div>
                    )}
                    
                    {project.delivery_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary/70" />
                        <span>אכלוס: {project.delivery_date}</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="pt-2 border-t border-border/50">
                    <span className="font-bold text-primary text-lg">
                      {getPriceDisplay(project.min_price, project.max_price)}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
