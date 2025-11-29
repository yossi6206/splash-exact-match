import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Share2, MapPin, Calendar, Shield, Package, Truck, Phone, Mail, MessageSquare, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import laptopImage from "@/assets/item-laptop.jpg";
import { ReviewStats } from "@/components/reviews/ReviewStats";
import { ReviewsList } from "@/components/reviews/ReviewsList";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import AIReport from "@/components/AIReport";
import MobileHeader from "@/components/MobileHeader";

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
                  <img
                    src={images[selectedImage]}
                    alt={`${laptop.brand} ${laptop.model}`}
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
                        <img
                          src={image}
                          alt={`תמונה ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Title and Info */}
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

            {/* Features */}
            {laptop.features && laptop.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">תכונות ויתרונות</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {laptop.features.map((feature: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
                      >
                        <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
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
            {(laptop.processor || laptop.ram || laptop.storage || laptop.screen_size || laptop.graphics_card) && (
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
                    {laptop.graphics_card && (
                      <div className="grid grid-cols-2 py-3 hover:bg-muted/50 transition-colors px-3 -mx-3 rounded">
                        <div className="text-muted-foreground font-medium">כרטיס מסך</div>
                        <div className="text-foreground font-semibold">{laptop.graphics_card}</div>
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
                    <Button className="w-full" size="lg">
                      <Phone className="ml-2 h-4 w-4" />
                      צור קשר טלפוני
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <MessageSquare className="ml-2 h-4 w-4" />
                      שלח הודעה
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">פרטי המוכר</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {laptop.seller_name || laptop.seller_phone ? (
                  <div className="space-y-3">
                    {laptop.seller_name && (
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                          {laptop.seller_name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{laptop.seller_name}</div>
                          <div className="text-sm text-muted-foreground">מוכר פרטי</div>
                        </div>
                      </div>
                    )}
                    {laptop.seller_phone && (
                      <div className="pt-3 border-t border-border">
                        {!showPhone ? (
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setShowPhone(true)}
                          >
                            <Phone className="h-4 w-4 ml-2" />
                            הצג מספר טלפון
                          </Button>
                        ) : (
                          <>
                            <div className="text-sm text-muted-foreground mb-1">טלפון</div>
                            <a href={`tel:${laptop.seller_phone}`} className="text-lg font-bold text-primary hover:underline" dir="ltr">
                              {laptop.seller_phone}
                            </a>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      M
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">מוכר פרטי</div>
                      <div className="text-sm text-muted-foreground">צור קשר דרך הטופס</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">דירוג</span>
                    <span className="font-semibold">⭐ {laptop.seller.rating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">מכירות</span>
                    <span className="font-semibold">{laptop.seller.totalSales} עסקאות</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  צפה בפרופיל המוכר
                </Button>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  טיפים לעסקה בטוחה
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>פגשו במקום ציבורי ובטוח</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>בדקו את המוצר לפני התשלום</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>אל תשלמו מראש ללא בדיקה</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>דרשו אישור עסקה בכתב</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <AIReport itemType="laptop" itemData={laptop} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LaptopDetails;