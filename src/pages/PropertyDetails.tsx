import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Home, MapPin, Bed, Square, Calendar, Shield, Phone, MessageSquare, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AIReport from "@/components/AIReport";
import MobileHeader from "@/components/MobileHeader";
import { supabase } from "@/integrations/supabase/client";
import property1 from "@/assets/property-1.jpg";

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");

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
        
        // Set main image when property loads
        const images = data.images && data.images.length > 0 ? data.images : [property1];
        setMainImage(images[0]);
        
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
        <div className="mb-6">
          <div className="relative rounded-2xl overflow-hidden mb-4 bg-muted">
            <img 
              src={mainImage || images[0]} 
              alt={property.title}
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Button 
                variant="outline"
                size="icon" 
                className="rounded-full border-2"
                onClick={handleFavorite}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button 
                size="icon" 
                className="bg-white/90 hover:bg-white text-foreground rounded-full"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            <Badge className="absolute bottom-4 right-4 bg-foreground/80 text-background text-sm px-4 py-2">
              תמונה {images.indexOf(mainImage) + 1} מתוך {images.length}
            </Badge>
          </div>
          
          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {images.map((img, index) => (
                <div 
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`relative rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity ${
                    mainImage === img ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`תמונה ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Title and Actions */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{property.location}</span>
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
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
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

            {/* Description */}
            {property.description && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">תיאור הנכס</h2>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{property.description}</p>
              </Card>
            )}

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">תכונות</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar - Contact Card */}
          <div className="lg:sticky lg:top-6 h-fit">
            <Card className="p-6">
              <div className="mb-6">
                <div className="text-3xl font-bold text-foreground mb-1">
                  ₪{property.price.toLocaleString('he-IL')}
                </div>
                <div className="text-sm text-muted-foreground">מחיר מבוקש</div>
              </div>

              <div className="space-y-3">
                <Button className="w-full" size="lg" onClick={handleContactClick}>
                  <Phone className="ml-2 h-4 w-4" />
                  צור קשר
                </Button>
                <Button variant="outline" className="w-full" size="lg" onClick={handleContactClick}>
                  <MessageSquare className="ml-2 h-4 w-4" />
                  שלח הודעה
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
                    {property.seller_phone && (
                      <div className="pt-3 border-t border-border">
                        {!showPhone ? (
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={handleShowPhone}
                          >
                            <Phone className="h-4 w-4 ml-2" />
                            הצג מספר טלפון
                          </Button>
                        ) : (
                          <>
                            <div className="text-sm text-muted-foreground mb-1">טלפון</div>
                            <a href={`tel:${property.seller_phone}`} className="text-lg font-bold text-primary hover:underline" dir="ltr">
                              {property.seller_phone}
                            </a>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    צור קשר דרך הכפתורים למעלה
                  </div>
                )}
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