import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, MapPin, Calendar, Shield, Phone, MessageSquare, Loader2, Monitor, Keyboard, Cpu, Camera, Fingerprint, HardDrive, Wifi, Cable, Bluetooth, Check, Eye, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import laptopImage from "@/assets/item-laptop.jpg";
import AIReport from "@/components/AIReport";
import MobileHeader from "@/components/MobileHeader";
import SimilarListings from "@/components/SimilarListings";
import { ReportListingDialog } from "@/components/ReportListingDialog";
import { ShareMenu } from "@/components/ShareMenu";
import { CloudflareImage } from "@/components/CloudflareImage";
import { getLaptopTitle } from "@/utils/titleUtils";

// Helper to get icon for feature
const getFeatureIcon = (feature: string) => {
  const featureLower = feature.toLowerCase();
  
  if (featureLower.includes('מסך מגע') || featureLower.includes('מגע')) return Monitor;
  if (featureLower.includes('מקלדת') || featureLower.includes('תאור') || featureLower.includes('נומר')) return Keyboard;
  if (featureLower.includes('מעבד') || featureLower.includes('intel') || featureLower.includes('amd') || featureLower.includes('processor')) return Cpu;
  if (featureLower.includes('מצלמ') || featureLower.includes('webcam') || featureLower.includes('camera')) return Camera;
  if (featureLower.includes('טביע') || featureLower.includes('fingerprint')) return Fingerprint;
  if (featureLower.includes('hdd') || featureLower.includes('ssd') || featureLower.includes('כונן') || featureLower.includes('אחסון')) return HardDrive;
  if (featureLower.includes('גרפיק') || featureLower.includes('graphics') || featureLower.includes('nvidia') || featureLower.includes('hdmi')) return Monitor;
  if (featureLower.includes('bluetooth')) return Bluetooth;
  if (featureLower.includes('wifi') || featureLower.includes('wi-fi')) return Wifi;
  if (featureLower.includes('usb') || featureLower.includes('יציא')) return Cable;
  
  return Check;
};

// Spec row component
const SpecRow = ({ label, value }: { label: string; value: string | number | null | undefined }) => {
  if (!value) return null;
  return (
    <div className="grid grid-cols-2 py-3 hover:bg-muted/50 transition-colors px-3 -mx-3 rounded">
      <div className="text-muted-foreground font-medium">{label}</div>
      <div className="text-foreground font-semibold">{value}</div>
    </div>
  );
};

const LaptopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [laptop, setLaptop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchLaptop = async () => {
      if (!id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from("laptops")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching laptop:", error);
        toast({
          title: "שגיאה",
          description: "לא ניתן לטעון את פרטי המחשב",
          variant: "destructive"
        });
      } else {
        setLaptop(data);
        
        // Increment view count
        await supabase
          .from("laptops")
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq("id", id);
      }
      setLoading(false);
    };

    fetchLaptop();
  }, [id, toast]);

  const handleFavorite = () => {
    if (!user) {
      toast({
        title: "נדרשת התחברות",
        description: "יש להתחבר כדי לשמור מוצרים מועדפים",
        variant: "destructive"
      });
      return;
    }
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "הוסר מהמועדפים" : "נוסף למועדפים",
      description: isFavorite ? "המוצר הוסר מרשימת המועדפים" : "המוצר נוסף לרשימת המועדפים"
    });
  };

  const handleContactClick = async () => {
    if (!id || !laptop) return;
    
    await supabase
      .from("laptops")
      .update({ contacts_count: (laptop.contacts_count || 0) + 1 })
      .eq("id", id);
  };

  const handleShowPhone = async () => {
    setShowPhone(true);
    await handleContactClick();
  };

  const handleSendMessage = () => {
    if (!user) {
      toast({
        title: "נדרשת התחברות",
        description: "יש להתחבר כדי לשלוח הודעה למוכר",
        variant: "destructive"
      });
      return;
    }
    navigate(`/messages?seller=${laptop.user_id}&item=${id}&type=laptop`);
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

  if (!laptop) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <MobileHeader />
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">המחשב לא נמצא</h1>
          <p className="text-muted-foreground">המודעה שחיפשת אינה קיימת או הוסרה</p>
        </div>
        <Footer />
      </div>
    );
  }

  const images = laptop.images && laptop.images.length > 0 ? laptop.images : [laptopImage];
  const laptopTitle = getLaptopTitle(laptop.brand, laptop.model);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <span className="hover:text-foreground cursor-pointer" onClick={() => navigate('/')}>ראשי</span>
          <span className="mx-2">/</span>
          <span className="hover:text-foreground cursor-pointer" onClick={() => navigate('/laptops')}>מחשבים ניידים</span>
          <span className="mx-2">/</span>
          <span className="text-foreground">{laptopTitle}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          {/* Left Column - Main Content */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* Main Image */}
                <div className="relative aspect-[4/3] bg-muted">
                  <CloudflareImage
                    src={images[selectedImage]}
                    alt={laptopTitle}
                    preset="hero"
                    className="w-full h-full object-contain p-8"
                  />
                  {/* Condition Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">
                      {laptop.condition}
                    </Badge>
                  </div>
                  {/* Action Buttons */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full bg-background/90 hover:bg-background backdrop-blur-sm"
                      onClick={handleFavorite}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
                    </Button>
                    <ShareMenu title={laptopTitle} variant="secondary" />
                  </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="p-4 border-t bg-card">
                    <div className="grid grid-cols-4 gap-2">
                      {images.map((image: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === index
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <CloudflareImage
                            src={image}
                            alt={`תמונה ${index + 1}`}
                            preset="thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Title and Info */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-3">{laptopTitle}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{laptop.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(laptop.created_at).toLocaleDateString('he-IL')}</span>
                  </div>
                  {laptop.views_count > 0 && (
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{laptop.views_count} צפיות</span>
                    </div>
                  )}
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
                <ShareMenu title={laptopTitle} variant="outline" />
                <ReportListingDialog itemId={id!} itemType="laptop" />
              </div>
            </div>

            {/* Features & Benefits - תכונות ויתרונות */}
            {laptop.features && laptop.features.length > 0 && (
              <Card>
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    תכונות ויתרונות
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {laptop.features.map((feature: string, index: number) => {
                      const Icon = getFeatureIcon(feature);
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-right">{feature}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description - תיאור */}
            {laptop.description && (
              <Card>
                <CardHeader className="bg-gradient-to-r from-secondary/10 to-accent/10">
                  <CardTitle className="text-xl">תיאור</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                    {laptop.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Technical Specifications - מפרט טכני */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/10">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-primary" />
                  מפרט טכני
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-0 divide-y">
                  <SpecRow label="יצרן" value={laptop.brand} />
                  <SpecRow label="דגם" value={laptop.model} />
                  <SpecRow label="מעבד" value={laptop.processor} />
                  <SpecRow label="זיכרון RAM" value={laptop.ram ? `${laptop.ram}GB` : null} />
                  <SpecRow label="אחסון" value={laptop.storage ? `${laptop.storage}GB ${laptop.storage_type || 'SSD'}` : null} />
                  <SpecRow label="סוג אחסון" value={laptop.storage_type} />
                  <SpecRow label="גודל מסך" value={laptop.screen_size ? `${laptop.screen_size}"` : null} />
                  <SpecRow label="רזולוציה" value={laptop.resolution} />
                  <SpecRow label="כרטיס גרפי" value={laptop.graphics_card} />
                  <SpecRow label="מערכת הפעלה" value={laptop.operating_system} />
                  <SpecRow label="משקל" value={laptop.weight} />
                  <SpecRow label="סוללה" value={laptop.battery} />
                  <SpecRow label="קישוריות" value={laptop.connectivity} />
                  <SpecRow label="יציאות" value={laptop.ports} />
                  <SpecRow label="מצב" value={laptop.condition} />
                </div>
              </CardContent>
            </Card>

            {/* AI Report */}
            <AIReport
              itemType="laptop"
              itemData={{
                title: laptopTitle,
                brand: laptop.brand,
                model: laptop.model,
                price: laptop.price,
                condition: laptop.condition,
                processor: laptop.processor,
                ram: laptop.ram,
                storage: laptop.storage,
                screen_size: laptop.screen_size,
                graphics_card: laptop.graphics_card,
                description: laptop.description
              }}
            />

            {/* Similar Listings */}
            <SimilarListings
              itemType="laptop"
              currentItemId={id!}
              location={laptop.location}
              brand={laptop.brand}
              priceRange={{ min: laptop.price * 0.7, max: laptop.price * 1.3 }}
            />

            {/* Safety Tips */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <Shield className="h-5 w-5" />
                  טיפים לרכישה בטוחה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    בדוק את המחשב פיזית לפני הרכישה
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    וודא שכל הרכיבים עובדים כראוי (מסך, מקלדת, סוללה)
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    בקש להראות קבלה או אחריות אם קיימת
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    השווה מחירים באתרים אחרים לפני הרכישה
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="sticky top-24">
              <CardHeader className="bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-t-lg">
                <div className="text-center">
                  <div className="text-4xl font-bold">
                    ₪{laptop.price?.toLocaleString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {/* Seller Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">פרטי המוכר</h3>
                  {laptop.seller_name && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium text-foreground">{laptop.seller_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{laptop.location}</span>
                  </div>
                </div>

                <Separator />

                {/* Contact Options */}
                <div className="space-y-3">
                  {laptop.seller_phone ? (
                    <>
                      {showPhone ? (
                        <div className="space-y-2">
                          <a 
                            href={`tel:${laptop.seller_phone}`}
                            className="w-full"
                          >
                            <Button className="w-full" size="lg">
                              <Phone className="ml-2 h-5 w-5" />
                              {laptop.seller_phone}
                            </Button>
                          </a>
                          <a 
                            href={`https://wa.me/972${laptop.seller_phone.slice(1)}?text=היי, ראיתי את המודעה שלך ב-SecondHandPro: ${laptopTitle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                          >
                            <Button variant="outline" className="w-full bg-green-500 hover:bg-green-600 text-white border-green-500" size="lg">
                              <MessageSquare className="ml-2 h-5 w-5" />
                              WhatsApp
                            </Button>
                          </a>
                        </div>
                      ) : (
                        <Button onClick={handleShowPhone} className="w-full" size="lg">
                          <Phone className="ml-2 h-5 w-5" />
                          הצג מספר טלפון
                        </Button>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      המוכר לא השאיר מספר טלפון
                    </p>
                  )}

                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    onClick={handleSendMessage}
                  >
                    <MessageSquare className="ml-2 h-5 w-5" />
                    שלח הודעה למוכר
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LaptopDetails;
