import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Heart, Home, MapPin, Bed, Square, Calendar, Shield, Phone, MessageSquare, Loader2, Maximize2, ChevronLeft, ChevronRight, ParkingCircle, Wind, Building2, Warehouse, DoorOpen, Trees, Sparkles, CheckCircle2, Users, Eye, FileCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AIReport from "@/components/AIReport";
import MobileHeader from "@/components/MobileHeader";
import SoldPropertiesInArea from "@/components/SoldPropertiesInArea";
import { ReportListingDialog } from "@/components/ReportListingDialog";
import { ShareMenu } from "@/components/ShareMenu";
import { supabase } from "@/integrations/supabase/client";
import property1 from "@/assets/property-1.jpg";
import { CloudflareImage } from "@/components/CloudflareImage";

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching property:", error);
        toast({
          title: "שגיאה",
          description: "לא ניתן לטעון את פרטי הנכס",
          variant: "destructive"
        });
      } else {
        setProperty(data);
        
        // Increment view count
        await supabase
          .from("properties")
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq("id", id);
      }
      setLoading(false);
    };

    fetchProperty();
  }, [id, toast]);

  const handleFavorite = () => {
    if (!user) {
      toast({
        title: "נדרשת התחברות",
        description: "יש להתחבר כדי לשמור נכסים מועדפים",
        variant: "destructive"
      });
      return;
    }
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "הוסר מהמועדפים" : "נוסף למועדפים",
      description: isFavorite ? "הנכס הוסר מרשימת המועדפים" : "הנכס נוסף לרשימת המועדפים"
    });
  };

  const handleContactClick = async () => {
    if (!id || !property) return;
    
    // Increment contacts count
    await supabase
      .from("properties")
      .update({ contacts_count: (property.contacts_count || 0) + 1 })
      .eq("id", id);
  };

  const handleShowPhone = async () => {
    setShowPhone(true);
    await handleContactClick();
  };

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <MobileHeader />
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <MobileHeader />
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">הנכס לא נמצא</h1>
          <p className="text-muted-foreground">המודעה שחיפשת אינה קיימת או הוסרה</p>
        </div>
        <Footer />
      </div>
    );
  }

  const images = property.images && property.images.length > 0 ? property.images : [property1];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="aspect-video relative overflow-hidden rounded-lg group cursor-pointer" onClick={() => openGallery(0)}>
            <CloudflareImage 
              src={images[0]} 
              alt={property.title}
              preset="hero"
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Button variant="secondary" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="h-4 w-4 ml-2" />
                צפה בגלריה
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {images.slice(1, 5).map((img, i) => (
              <div 
                key={i} 
                className="aspect-video relative overflow-hidden rounded-lg bg-muted group cursor-pointer"
                onClick={() => openGallery(i + 1)}
              >
                <CloudflareImage 
                  src={img} 
                  alt={`תמונה ${i + 2}`}
                  preset="card"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Maximize2 className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image Gallery Dialog */}
        <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
          <DialogContent className="max-w-4xl p-0">
            <div className="relative bg-black">
              <CloudflareImage 
                src={images[currentImageIndex]} 
                alt={`תמונה ${currentImageIndex + 1}`}
                preset="full"
                className="w-full h-[70vh] object-contain"
              />
              {images.length > 1 && (
                <>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={nextImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={prevImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Title and Actions */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {property.location}{property.street ? `, ${property.street}` : ''}{property.house_number ? ` ${property.house_number}` : ''}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{property.property_type} • {property.rooms} חדרים</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleFavorite}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
                </Button>
                <ShareMenu 
                  title={property.title}
                  variant="outline"
                />
                <ReportListingDialog itemId={id!} itemType="property" />
              </div>
            </div>

            {/* Key Info */}
            <Card className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">חדרים</div>
                    <div className="font-semibold">{property.rooms}</div>
                  </div>
                </div>
                {property.size && (
                  <div className="flex items-center gap-3">
                    <Square className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">מ"ר</div>
                      <div className="font-semibold">{property.size}</div>
                    </div>
                  </div>
                )}
                {property.floor && (
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">קומה</div>
                      <div className="font-semibold">{property.floor}{property.total_floors ? `/${property.total_floors}` : ''}</div>
                    </div>
                  </div>
                )}
                {property.year && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">שנת בנייה</div>
                      <div className="font-semibold">{property.year}</div>
                    </div>
                  </div>
                )}
              </div>
            </Card>


            {/* Features */}
            {property.features && property.features.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">תכונות</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.features.map((feature: string, index: number) => {
                    const featureLower = feature.toLowerCase();
                    let Icon = CheckCircle2;
                    
                    if (featureLower.includes('חניה') || featureLower.includes('parking')) {
                      Icon = ParkingCircle;
                    } else if (featureLower.includes('מעלית') || featureLower.includes('elevator')) {
                      Icon = Building2;
                    } else if (featureLower.includes('מיזוג') || featureLower.includes('air') || featureLower.includes('ac')) {
                      Icon = Wind;
                    } else if (featureLower.includes('מרפסת') || featureLower.includes('balcony')) {
                      Icon = DoorOpen;
                    } else if (featureLower.includes('ממד') || featureLower.includes('safe') || featureLower.includes('shelter')) {
                      Icon = Shield;
                    } else if (featureLower.includes('מחסן') || featureLower.includes('storage')) {
                      Icon = Warehouse;
                    } else if (featureLower.includes('גינה') || featureLower.includes('garden') || featureLower.includes('נוף')) {
                      Icon = Trees;
                    } else if (featureLower.includes('משופצ') || featureLower.includes('חדש') || featureLower.includes('renovated')) {
                      Icon = Sparkles;
                    } else if (featureLower.includes('נגיש') || featureLower.includes('accessible')) {
                      Icon = Building2;
                    } else if (featureLower.includes('סורגים') || featureLower.includes('bars')) {
                      Icon = Shield;
                    }
                    
                    return (
                      <div key={index} className="flex items-center gap-2.5 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-foreground/80 text-right text-sm">{feature}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* Sold Properties in Area */}
            <SoldPropertiesInArea 
              currentPropertyLocation={property.location}
              currentPropertyId={property.id}
            />
          </div>

          {/* Sidebar - Contact Card */}
          <div className="lg:sticky lg:top-6 h-fit space-y-6">
            <Card className="p-6">
              <div className="mb-6">
                <div className="text-3xl font-bold text-foreground mb-1">
                  ₪{property.price.toLocaleString('he-IL')}
                </div>
                <div className="text-sm text-muted-foreground">מחיר מבוקש</div>
              </div>

              <div className="space-y-3">
                {property.seller_phone ? (
                  !showPhone ? (
                    <Button className="w-full" size="lg" onClick={handleShowPhone}>
                      <Phone className="ml-2 h-4 w-4" />
                      הצג מספר טלפון
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        className="w-full" 
                        size="lg"
                        asChild
                      >
                        <a href={`tel:${property.seller_phone}`} dir="ltr" className="flex items-center justify-center gap-2">
                          <Phone className="h-4 w-4 ml-2" />
                          <span className="font-bold">{property.seller_phone}</span>
                        </a>
                      </Button>
                      <Button 
                        className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
                        size="lg"
                        asChild
                      >
                        <a 
                          href={`https://wa.me/972${property.seller_phone.replace(/^0/, '').replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="h-4 w-4 ml-2" />
                          שלח הודעה בוואטסאפ
                        </a>
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">המוכר לא השאיר מספר טלפון</p>
                  </div>
                )}
                
                <Button
                  className="w-full"
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    if (!user) {
                      toast({
                        title: "נדרשת התחברות",
                        description: "יש להתחבר כדי לשלוח הודעות",
                        variant: "destructive"
                      });
                      return;
                    }
                    if (property.user_id === user.id) {
                      toast({
                        title: "שגיאה",
                        description: "לא ניתן לשלוח הודעה לעצמך",
                        variant: "destructive"
                      });
                      return;
                    }
                    window.location.href = `/messages?seller=${property.user_id}&item=${property.id}`;
                  }}
                >
                  <MessageSquare className="h-4 w-4 ml-2" />
                  שלח הודעה למוכר
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">פרטי המפרסם</h3>
                {property.seller_name || property.seller_phone ? (
                  <div className="space-y-3">
                    {property.seller_name && (
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <span className="font-bold text-primary">{property.seller_name.charAt(0)}</span>
                        </div>
                      <div>
                        <div className="font-semibold text-foreground">{property.seller_name}</div>
                        <div className="text-sm text-muted-foreground">מפרסם פרטי</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{property.location}</span>
                  </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    צור קשר דרך הכפתורים למעלה
                  </div>
                )}
              </div>
            </Card>

            {/* Safety Tips */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4 text-right">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">טיפים לעסקה בטוחה</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-background flex items-center justify-center">
                      <Users className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-foreground/80 text-right leading-relaxed">פגשו במקום ציבורי ובטוח</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-background flex items-center justify-center">
                      <Eye className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-foreground/80 text-right leading-relaxed">בדקו את הנכס לפני התשלום</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-background flex items-center justify-center">
                      <AlertCircle className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-foreground/80 text-right leading-relaxed">אל תשלמו מראש ללא בדיקה</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-background flex items-center justify-center">
                      <FileCheck className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-foreground/80 text-right leading-relaxed">דרשו אישור עסקה בכתב</span>
                  </li>
                </ul>
              </div>
            </Card>

            <AIReport itemType="property" itemData={property} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetails;