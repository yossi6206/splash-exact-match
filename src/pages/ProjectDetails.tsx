import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Building2,
  Calendar,
  Home,
  Layers,
  Phone,
  Mail,
  Globe,
  Car,
  Package,
  ChevronRight,
  ChevronLeft,
  Share2,
  Flag,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import CloudflareImage from "@/components/CloudflareImage";
import { ShareMenu } from "@/components/ShareMenu";
import { ReportListingDialog } from "@/components/ReportListingDialog";
import { supabase } from "@/integrations/supabase/client";

interface Project {
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
  description: string | null;
  images: string[] | null;
  features: string[] | null;
  amenities: string[] | null;
  total_units: number | null;
  available_units: number | null;
  floors_count: number | null;
  buildings_count: number | null;
  parking_included: boolean | null;
  storage_included: boolean | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  website_url: string | null;
  created_at: string;
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      setProject(data);

      // Increment views
      if (data) {
        await supabase
          .from("projects")
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq("id", id);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return price.toLocaleString("he-IL");
  };

  const getPriceDisplay = () => {
    if (!project) return "";
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

  const images = project?.images || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Header />
        <MobileHeader />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full rounded-lg mb-6" />
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Header />
        <MobileHeader />
        <div className="container mx-auto px-4 py-16 text-center">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">הפרויקט לא נמצא</h1>
          <p className="text-muted-foreground mb-4">
            הפרויקט שחיפשת אינו קיים או שהוסר
          </p>
          <Link to="/projects">
            <Button>חזרה לפרויקטים</Button>
          </Link>
        </div>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      <Header />
      <MobileHeader />

      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">
            ראשי
          </Link>
          <ChevronLeft className="h-4 w-4" />
          <Link to="/projects" className="hover:text-primary">
            פרויקטים חדשים
          </Link>
          <ChevronLeft className="h-4 w-4" />
          <span className="text-foreground">{project.title}</span>
        </nav>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="relative h-[300px] md:h-[500px] rounded-xl overflow-hidden mb-6">
            <CloudflareImage
              src={images[currentImageIndex]}
              alt={project.title}
              className="w-full h-full object-cover"
            />

            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={prevImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={nextImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentImageIndex
                          ? "bg-white w-6"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Badge className="bg-primary text-primary-foreground">
                {project.listing_type}
              </Badge>
              <Badge variant="secondary">{project.project_type}</Badge>
            </div>
          </div>
        )}

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === currentImageIndex
                    ? "border-primary"
                    : "border-transparent"
                }`}
              >
                <CloudflareImage
                  src={img}
                  alt={`${project.title} - ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Developer */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {project.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-2">
                מבית {project.developer_name}
              </p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>
                  {project.neighborhood
                    ? `${project.location}, ${project.neighborhood}`
                    : project.location}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.buildings_count && (
                <Card>
                  <CardContent className="p-4 text-center">
                    <Layers className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="font-bold text-lg">{project.buildings_count}</p>
                    <p className="text-sm text-muted-foreground">בניינים</p>
                  </CardContent>
                </Card>
              )}
              {project.floors_count && (
                <Card>
                  <CardContent className="p-4 text-center">
                    <Building2 className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="font-bold text-lg">{project.floors_count}</p>
                    <p className="text-sm text-muted-foreground">קומות</p>
                  </CardContent>
                </Card>
              )}
              {project.total_units && (
                <Card>
                  <CardContent className="p-4 text-center">
                    <Home className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="font-bold text-lg">{project.total_units}</p>
                    <p className="text-sm text-muted-foreground">יחידות</p>
                  </CardContent>
                </Card>
              )}
              {project.delivery_date && (
                <Card>
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="font-bold text-lg">{project.delivery_date}</p>
                    <p className="text-sm text-muted-foreground">אכלוס</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Description */}
            {project.description && (
              <Card>
                <CardHeader>
                  <CardTitle>על הפרויקט</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>מאפיינים</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            {project.amenities && project.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    מתקנים ושירותים
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {project.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Included */}
            {(project.parking_included || project.storage_included) && (
              <Card>
                <CardHeader>
                  <CardTitle>כלול במחיר</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {project.parking_included && (
                      <div className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-primary" />
                        <span>חניה</span>
                      </div>
                    )}
                    {project.storage_included && (
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        <span>מחסן</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-1">
                    טווח מחירים
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-primary">
                    {getPriceDisplay()}
                  </p>
                  {project.min_rooms && project.max_rooms && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {project.min_rooms === project.max_rooms
                        ? `${project.min_rooms} חדרים`
                        : `${project.min_rooms}-${project.max_rooms} חדרים`}
                    </p>
                  )}
                </div>

                {project.available_units && project.total_units && (
                  <div className="bg-muted rounded-lg p-4 mb-6 text-center">
                    <p className="text-2xl font-bold text-primary">
                      {project.available_units}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      יחידות פנויות מתוך {project.total_units}
                    </p>
                  </div>
                )}

                <Separator className="my-4" />

                {/* Contact Info */}
                <div className="space-y-3">
                  {project.contact_name && (
                    <p className="font-medium text-center">
                      {project.contact_name}
                    </p>
                  )}

                  {project.contact_phone && (
                    <a
                      href={`tel:${project.contact_phone}`}
                      className="flex items-center justify-center gap-2 w-full"
                    >
                      <Button className="w-full gap-2">
                        <Phone className="h-4 w-4" />
                        {project.contact_phone}
                      </Button>
                    </a>
                  )}

                  {project.contact_email && (
                    <a
                      href={`mailto:${project.contact_email}`}
                      className="flex items-center justify-center gap-2 w-full"
                    >
                      <Button variant="outline" className="w-full gap-2">
                        <Mail className="h-4 w-4" />
                        שלח מייל
                      </Button>
                    </a>
                  )}

                  {project.website_url && (
                    <a
                      href={project.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full"
                    >
                      <Button variant="outline" className="w-full gap-2">
                        <Globe className="h-4 w-4" />
                        אתר הפרויקט
                      </Button>
                    </a>
                  )}
                </div>

                <Separator className="my-4" />

                {/* Actions */}
                <div className="flex gap-2">
                  <ShareMenu
                    title={project.title}
                    url={window.location.href}
                  />
                  <ReportListingDialog
                    itemId={project.id}
                    itemType="project"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default ProjectDetails;
