import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Share2, MapPin, Calendar, Shield, Package, Truck, Phone, Mail, MessageSquare, Loader2, Monitor, Keyboard, Cpu, Camera, Fingerprint, HardDrive, Wifi, Cable, Calculator, Bluetooth, Check, Users, Eye, FileCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import laptopImage from "@/assets/item-laptop.jpg";
import { ReviewStats } from "@/components/reviews/ReviewStats";
import { ReviewsList } from "@/components/reviews/ReviewsList";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import AIReport from "@/components/AIReport";
import MobileHeader from "@/components/MobileHeader";
import SimilarListings from "@/components/SimilarListings";
import { ReportListingDialog } from "@/components/ReportListingDialog";
import { ShareMenu } from "@/components/ShareMenu";
import { CloudflareImage } from "@/components/CloudflareImage";

const LaptopDetails = () => {
  const { id } = useParams();
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
    
    // Increment contacts count
    await supabase
      .from("laptops")
      .update({ contacts_count: (laptop.contacts_count || 0) + 1 })
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

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <span className="hover:text-foreground cursor-pointer">יד שניה</span>
          <span className="mx-2">/</span>
          <span className="hover:text-foreground cursor-pointer">מחשבים ניידים</span>
          <span className="mx-2">/</span>
          <span className="text-foreground">{laptop.brand} {laptop.model}</span>
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
                    alt={`${laptop.brand} ${laptop.model}`}
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
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full bg-background/90 hover:bg-background backdrop-blur-sm"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Thumbnails */}
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
              </CardContent>
            </Card>

            {/* Title and Info */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-3">{laptop.brand} {laptop.model}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{laptop.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(laptop.created_at).toLocaleDateString('he-IL')}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={async () => {
                    if (!user) {
                      toast({
                        title: "נדרשת התחברות",
                        description: "יש להתחבר כדי לסמן מחשבים כמועדפים",
                        variant: "destructive"
                      });
                      return;
                    }
                    // TODO: Implement favorite toggle
                  }}
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <ShareMenu 
                  title={`${laptop.brand} ${laptop.model}`}
                  variant="outline"
                />
                <ReportListingDialog itemId={id!} itemType="laptop" />
              </div>
            </div>

            {/* Features */}
            {laptop.features && laptop.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">תכונות ויתרונות</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {laptop.features.map((feature: string, index: number) => {
                      const featureLower = feature.toLowerCase();
                      let Icon = Check;
                      
                      if (featureLower.includes('מסך מגע') || featureLower.includes('מגע')) {
                        Icon = Monitor;
                      } else if (featureLower.includes('מקלדת') || featureLower.includes('תאור') || featureLower.includes('נומר')) {
                        Icon = Keyboard;
                      } else if (featureLower.includes('מעבד') || featureLower.includes('intel') || featureLower.includes('amd') || featureLower.includes('processor')) {
                        Icon = Cpu;
                      } else if (featureLower.includes('מצלמ') || featureLower.includes('webcam') || featureLower.includes('camera')) {
                        Icon = Camera;
                      } else if (featureLower.includes('טביע') || featureLower.includes('fingerprint')) {
                        Icon = Fingerprint;
                      } else if (featureLower.includes('hdd') || featureLower.includes('כונן')) {
                        Icon = HardDrive;
                      } else if (featureLower.includes('גרפיק') || featureLower.includes('graphics') || featureLower.includes('nvidia') || featureLower.includes('amd')) {
                        Icon = Monitor;
                      } else if (featureLower.includes('hdmi')) {
                        Icon = Monitor;
                      } else if (featureLower.includes('bluetooth')) {
                        Icon = Bluetooth;
                      } else if (featureLower.includes('wifi') || featureLower.includes('wi-fi')) {
                        Icon = Wifi;
                      } else if (featureLower.includes('usb')) {
                        Icon = Cable;
                      }
                      
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

            {/* Description */}
            {laptop.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">תיאור</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                    {laptop.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Technical Specifications */}
            {(laptop.processor || laptop.ram || laptop.storage || laptop.screen_size || laptop.graphics_card || 
              laptop.resolution || laptop.operating_system || laptop.weight || laptop.battery || laptop.connectivity || laptop.ports) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">מפרט טכני</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-0 divide-y">
                    {laptop.processor && (
                      <div className="grid grid-cols-2 py-3 hover:bg-muted/50 transition-colors px-3 -mx-3 rounded">
                        <div className="text-muted-foreground font-medium">מעבד</div>
                        <div className="text-foreground font-semibold">{laptop.processor}</div>
                      </div>
                    )}
                    {laptop.ram && (
                      <div className="grid grid-cols-2 py-3 hover:bg-muted/50 transition-colors px-3 -mx-3 rounded">
                        <div className="text-muted-foreground font-medium">זיכרון RAM</div>
                        <div className="text-foreground font-semibold">{laptop.ram}GB</div>
                      </div>
                    )}
                    {laptop.storage && (
                      <div className="grid grid-cols-2 py-3 hover:bg-muted/50 transition-colors px-3 -mx-3 rounded">
                        <div className="text-muted-foreground font-medium">אחסון</div>
                        <div className="text-foreground font-semibold">{laptop.storage}GB {laptop.storage_type || 'SSD'}</div>
                      </div>
                    )}
                    {laptop.screen_size && (
                      <div className="grid grid-cols-2 py-3 hover:bg-muted/50 transition-colors px-3 -mx-3 rounded">
                        <div className="text-muted-foreground font-medium">גודל מסך</div>
                        <div className="text-foreground font-semibold">{laptop.screen_size}"</div>
                      </div>
                    )}
                    {laptop.resolution && (
                      <div className="grid grid-cols-2 py-3 hover:bg-muted/50 transition-colors px-3 -mx-3 rounded">
                        <div className="text-muted-foreground font-medium">רזולוציה</div>
                        <div className="text-foreground font-semibold">{laptop.resolution}</div>
                      </div>
                    )}
                    {laptop.graphics_card && (
                      <div className="grid grid-cols-2 py-3 hover:bg-muted/50 transition-colors px-3 -mx-3 rounded">
                        <div className="text-muted-foreground font-medium">כרטיס מסך</div>
                        <div className="text-foreground font-semibold">{laptop.graphics_card}</div>
                      </div>
                    )}
                    {laptop.operating_system && (
                      <div className="grid grid-cols-2 py-3 hover:bg-muted/50 transition-colors px-3 -mx-3 rounded">
                        <div className="text-muted-foreground font-medium">מערכת הפעלה</div>
                        <div className="text-foreground font-semibold">{laptop.operating_system}</div>
                      </div>
                    )}
                    {laptop.weight && (
                      <div className="grid grid-cols-2 py-3 hover:bg-muted/50 transition-colors px-3 -mx-3 rounded">
                        <div className="text-muted-foreground font-medium">משקל</div>
                        <div className="text-foreground font-semibold">{laptop.weight}</div>
                      </div>
                    )}
                    {laptop.battery && (
                      <div className="grid grid-cols-2 py-3 hover:bg-muted/50 transition-colors px-3 -mx-3 rounded">
                        <div className="text-muted-foreground font-medium">סוללה</div>
                        <div className="text-foreground font-semibold">{laptop.battery}</div>
                      </div>
                    )}
                    {laptop.connectivity && (
                      <div className="grid grid-cols-2 py-3 hover:bg-muted/50 transition-colors px-3 -mx-3 rounded">
                        <div className="text-muted-foreground font-medium">תקשורת</div>
                        <div className="text-foreground font-semibold">{laptop.connectivity}</div>
                      </div>
                    )}
                    {laptop.ports && (
                      <div className="grid grid-cols-2 py-3 hover:bg-muted/50 transition-colors px-3 -mx-3 rounded">
                        <div className="text-muted-foreground font-medium">יציאות</div>
                        <div className="text-foreground font-semibold">{laptop.ports}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">משלוח ואיסוף</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">משלוח עד הבית</div>
                      <div className="text-sm text-muted-foreground">
                        זמין באמצעות שירותי משלוח. עלות המשלוח מוסכמת עם המוכר.
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">איסוף עצמי</div>
                      <div className="text-sm text-muted-foreground">
                        ניתן לאסוף את המוצר ישירות מהמוכר ב{laptop.location}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:sticky lg:top-6 h-fit space-y-4">
            {/* Price Card */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Price */}
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-foreground">
                        ₪{laptop.price.toLocaleString('he-IL')}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Buttons */}
                  <div className="space-y-2">
                    {!showPhone ? (
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
                          <a href={`tel:${laptop.seller_phone}`} dir="ltr" className="flex items-center justify-center gap-2">
                            <Phone className="h-4 w-4 ml-2" />
                            <span className="font-bold">{laptop.seller_phone}</span>
                          </a>
                        </Button>
                        <Button 
                          className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
                          size="lg"
                          asChild
                        >
                      <a 
                        href={`https://wa.me/972${(laptop.seller_phone || '').replace(/^0/, '').replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                            <MessageSquare className="h-4 w-4 ml-2" />
                            שלח הודעה בוואטסאפ
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                  
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
                      if (laptop.user_id === user.id) {
                        toast({
                          title: "שגיאה",
                          description: "לא ניתן לשלוח הודעה לעצמך",
                          variant: "destructive"
                        });
                        return;
                      }
                      window.location.href = `/messages?seller=${laptop.user_id}&item=${laptop.id}`;
                    }}
                  >
                    <MessageSquare className="h-4 w-4 ml-2" />
                    שלח הודעה למוכר
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-3">פרטי המפרסם</h3>
                  {laptop.seller_name || laptop.seller_phone ? (
                    <div className="space-y-3">
                      {laptop.seller_name && (
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <span className="font-bold text-primary">{laptop.seller_name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{laptop.seller_name}</div>
                            <div className="text-sm text-muted-foreground">מפרסם פרטי</div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{laptop.location}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      צור קשר דרך הכפתורים למעלה
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-right">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  טיפים לעסקה בטוחה
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                    <span className="text-foreground/80 text-right leading-relaxed">בדקו את המוצר לפני התשלום</span>
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
              </CardContent>
            </Card>

            <AIReport itemType="laptop" itemData={{ brand: laptop.brand, model: laptop.model, price: laptop.price, condition: laptop.condition }} />

            <SimilarListings 
              itemType="laptop"
              currentItemId={id!}
              location={laptop.location}
              brand={laptop.brand}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LaptopDetails;