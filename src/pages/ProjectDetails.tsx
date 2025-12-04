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
  Sparkles,
  CheckCircle2,
  Users,
  Clock,
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

  const getRoomsDisplay = () => {
    if (!project) return null;
    if (project.min_rooms && project.max_rooms) {
      if (project.min_rooms === project.max_rooms) {
        return `${project.min_rooms} חדרים`;
      }
      return `${project.min_rooms}-${project.max_rooms} חדרים`;
    }
    return null;
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
          <Skeleton className="h-[500px] w-full rounded-2xl mb-6" />
          <Skeleton className="h-10 w-1/2 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <Skeleton className="h-96 w-full rounded-xl" />
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
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="bg-muted/30 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Building2 className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-3">הפרויקט לא נמצא</h1>
          <p className="text-muted-foreground mb-6 text-lg">
            הפרויקט שחיפשת אינו קיים או שהוסר מהמערכת
          </p>
          <Link to="/projects">
            <Button size="lg" className="px-8">
              חזרה לפרויקטים
            </Button>
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
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">ראשי</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronLeft className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/projects">פרויקטים חדשים</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronLeft className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>{project.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Image Gallery */}
        {images.length > 0 && (
          <div className="relative h-[350px] md:h-[550px] rounded-2xl overflow-hidden mb-6 shadow-xl">
            <CloudflareImage
              src={images[currentImageIndex]}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Badges */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1 shadow-lg">
                {project.listing_type}
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1 shadow-lg bg-background/90 backdrop-blur-sm">
                {project.project_type}
              </Badge>
            </div>

            {/* Title on Image */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="flex items-center gap-2 text-white/90 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm md:text-base">
                  {project.neighborhood
                    ? `${project.location}, ${project.neighborhood}`
                    : project.location}
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                {project.title}
              </h1>
              <p className="text-white/80 text-base md:text-lg">
                מבית <span className="font-semibold text-white">{project.developer_name}</span>
              </p>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg h-12 w-12"
                  onClick={prevImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg h-12 w-12"
                  onClick={nextImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                {/* Image Counter */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        )}

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden transition-all duration-200 ${
                  idx === currentImageIndex
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
                    : "opacity-70 hover:opacity-100"
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.buildings_count && (
                <Card className="border-0 shadow-md bg-gradient-to-br from-background to-muted/30">
                  <CardContent className="p-5 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                      <Layers className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-bold text-2xl">{project.buildings_count}</p>
                    <p className="text-sm text-muted-foreground">בניינים</p>
                  </CardContent>
                </Card>
              )}
              {project.floors_count && (
                <Card className="border-0 shadow-md bg-gradient-to-br from-background to-muted/30">
                  <CardContent className="p-5 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-bold text-2xl">{project.floors_count}</p>
                    <p className="text-sm text-muted-foreground">קומות</p>
                  </CardContent>
                </Card>
              )}
              {project.total_units && (
                <Card className="border-0 shadow-md bg-gradient-to-br from-background to-muted/30">
                  <CardContent className="p-5 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                      <Home className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-bold text-2xl">{project.total_units}</p>
                    <p className="text-sm text-muted-foreground">יחידות דיור</p>
                  </CardContent>
                </Card>
              )}
              {project.delivery_date && (
                <Card className="border-0 shadow-md bg-gradient-to-br from-background to-muted/30">
                  <CardContent className="p-5 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-3 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-bold text-xl">{project.delivery_date}</p>
                    <p className="text-sm text-muted-foreground">מועד אכלוס</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Description */}
            {project.description && (
              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Building2 className="h-5 w-5 text-primary" />
                    אודות הפרויקט
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-base">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    מאפייני הפרויקט
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {project.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                      >
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            {project.amenities && project.amenities.length > 0 && (
              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Sparkles className="h-5 w-5 text-primary" />
                    מתקנים ושירותים
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {project.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
                      >
                        <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Included in Price */}
            {(project.parking_included || project.storage_included) && (
              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className="bg-muted/30 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Package className="h-5 w-5 text-primary" />
                    כלול במחיר
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-4">
                    {project.parking_included && (
                      <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
                        <Car className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-700">חניה</span>
                      </div>
                    )}
                    {project.storage_included && (
                      <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
                        <Package className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-700">מחסן</span>
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
            <Card className="sticky top-20 border-0 shadow-xl overflow-hidden">
              {/* Price Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
                <p className="text-sm opacity-90 mb-1">טווח מחירים</p>
                <p className="text-2xl md:text-3xl font-bold">
                  {getPriceDisplay()}
                </p>
                {getRoomsDisplay() && (
                  <p className="text-sm opacity-90 mt-2">
                    {getRoomsDisplay()}
                  </p>
                )}
              </div>

              <CardContent className="p-6 space-y-5">
                {/* Available Units */}
                {project.available_units && project.total_units && (
                  <div className="bg-muted/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">יחידות פנויות</span>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">{project.available_units}</span>
                      <span className="text-muted-foreground">מתוך {project.total_units}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(project.available_units / project.total_units) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {project.delivery_date && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">מועד אכלוס משוער</p>
                      <p className="font-semibold">{project.delivery_date}</p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Contact Info */}
                <div className="space-y-3">
                  {project.contact_name && (
                    <div className="text-center pb-2">
                      <p className="text-sm text-muted-foreground">איש קשר</p>
                      <p className="font-semibold text-lg">{project.contact_name}</p>
                    </div>
                  )}

                  {project.contact_phone && (
                    <a href={`tel:${project.contact_phone}`}>
                      <Button className="w-full gap-2 h-12 text-base shadow-lg" size="lg">
                        <Phone className="h-5 w-5" />
                        {project.contact_phone}
                      </Button>
                    </a>
                  )}

                  {project.contact_email && (
                    <a href={`mailto:${project.contact_email}`}>
                      <Button variant="outline" className="w-full gap-2 h-11" size="lg">
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
                    >
                      <Button variant="outline" className="w-full gap-2 h-11" size="lg">
                        <Globe className="h-4 w-4" />
                        אתר הפרויקט
                      </Button>
                    </a>
                  )}
                </div>

                <Separator />

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
