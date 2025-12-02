import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, Share2, Phone, MessageSquare, MapPin, Calendar, Gauge, Hand, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import carImage1 from "@/assets/item-car.jpg";
import AIReport from "@/components/AIReport";
import MobileHeader from "@/components/MobileHeader";
import FinanceCalculator from "@/components/FinanceCalculator";

interface CarData {
  id: string;
  manufacturer: string | null;
  model: string;
  description: string | null;
  year: number;
  km: number;
  hand: number;
  fuel_type: string | null;
  transmission: string | null;
  vehicle_type: string | null;
  condition: string | null;
  category: string | null;
  location: string;
  price: string | null;
  features: string[] | null;
  images: string[] | null;
  status: string;
  created_at: string;
  user_id: string;
  seller_name: string | null;
  seller_phone: string | null;
  views_count?: number;
  clicks_count?: number;
  contacts_count?: number;
}

const CarDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [carData, setCarData] = useState<CarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(carImage1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [showPhone, setShowPhone] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch car data from Supabase
  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching car:", error);
        toast({
          title: "שגיאה",
          description: "לא ניתן לטעון את פרטי הרכב",
          variant: "destructive"
        });
      } else {
        setCarData(data);
        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0]);
        }
        
        // Increment view count
        await supabase
          .from("cars")
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq("id", id);
      }
      setLoading(false);
    };

    fetchCar();
  }, [id, toast]);

  const images = carData?.images || [carImage1];

  const carDetails = carData ? {
    manufacturer: carData.manufacturer || "לא צוין",
    model: carData.model,
    description: carData.description || "",
    year: carData.year,
    km: carData.km,
    hand: carData.hand,
    fuel_type: carData.fuel_type || "לא צוין",
    transmission: carData.transmission || "לא צוין",
    vehicle_type: carData.vehicle_type || "רכב פרטי",
    condition: carData.condition || "לא צוין",
    location: carData.location,
    price: carData.price || "לא ציין מחיר",
    features: carData.features || []
  } : null;

  const handleAnalyze = async () => {
    if (!carDetails) return;
    
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-car', {
        body: { carDetails }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "שגיאה",
          description: data.error,
          variant: "destructive"
        });
        return;
      }

      setAnalysis(data.analysis);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Error analyzing car:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעת יצירת הדוח. אנא נסה שוב.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleContactClick = async () => {
    if (!id || !carData) return;
    
    // Increment contacts count
    await supabase
      .from("cars")
      .update({ contacts_count: (carData.contacts_count || 0) + 1 })
      .eq("id", id);
  };

  const handleShowPhone = async () => {
    setShowPhone(true);
    await handleContactClick();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!carData || !carDetails) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">הרכב לא נמצא</h1>
          <p className="text-muted-foreground">המודעה שחיפשת אינה קיימת או הוסרה</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Main Content */}
          <div>
            {/* Image Gallery */}
            <div className="mb-6">
              <div className="relative rounded-2xl overflow-hidden mb-4 bg-muted">
                <img 
                  src={mainImage} 
                  alt="רכב"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                <Button 
                  variant="outline"
                  size="icon" 
                  className="rounded-full border-2"
                  onClick={async () => {
                    if (!user) {
                      toast({
                        title: "נדרשת התחברות",
                        description: "יש להתחבר כדי לסמן רכבים כמועדפים",
                        variant: "destructive"
                      });
                      return;
                    }
                    // TODO: Implement favorite toggle
                  }}
                >
                  <Heart className="h-5 w-5" />
                </Button>
                  <Button 
                    size="icon" 
                    className="bg-white/90 hover:bg-white text-foreground rounded-full"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
                <Badge className="absolute bottom-4 right-4 bg-foreground/80 text-background text-sm px-4 py-2">
                  תמונה 1 מתוך {images.length}
                </Badge>
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-3 gap-3">
                {images.map((img, index) => (
                  <div 
                    key={index}
                    onClick={() => setMainImage(img)}
                    className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img 
                      src={img} 
                      alt={`תמונה ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Car Details */}
            <Card className="mb-6 border-border">
              <CardContent className="p-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {carDetails.manufacturer} {carDetails.model}
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  {carDetails.description}
                </p>

                {/* Key Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                    <Gauge className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">ק״מ</div>
                      <div className="font-bold text-foreground">{carDetails.km.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                    <Hand className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">יד</div>
                      <div className="font-bold text-foreground">{carDetails.hand}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">שנה</div>
                      <div className="font-bold text-foreground">{carDetails.year}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">מיקום</div>
                      <div className="font-bold text-foreground">{carDetails.location}</div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-sm text-muted-foreground mb-1">סוג דלק</div>
                    <div className="font-bold text-foreground">{carDetails.fuel_type}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-sm text-muted-foreground mb-1">תיבת הילוכים</div>
                    <div className="font-bold text-foreground">{carDetails.transmission}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-sm text-muted-foreground mb-1">מצב</div>
                    <div className="font-bold text-foreground">{carDetails.condition}</div>
                  </div>
                </div>

                {/* Description */}
                {carDetails.description && (
                  <div className="border-t border-border pt-6">
                    <h2 className="text-xl font-bold text-foreground mb-4">תיאור</h2>
                    <p className="text-foreground leading-relaxed">
                      {carDetails.description}
                    </p>
                  </div>
                )}

                {/* Features */}
                {carDetails.features && carDetails.features.length > 0 && (
                  <div className="border-t border-border pt-6 mt-6">
                    <h2 className="text-xl font-bold text-foreground mb-4">ציוד ואבזור</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {carDetails.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="justify-center py-2">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            {/* Price Card */}
            <Card className="mb-6 border-border">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {carDetails.price === "לא ציין מחיר" || !carDetails.price 
                      ? "לא ציין מחיר" 
                      : `${parseFloat(carDetails.price.replace(/,/g, "")).toLocaleString('he-IL')} ₪`}
                  </div>
                  {carDetails.price && carDetails.price !== "לא ציין מחיר" && (
                    <p className="text-sm text-muted-foreground">
                      ניתן למשא ומתן
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  {carData.seller_phone ? (
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
                          <a href={`tel:${carData.seller_phone}`} dir="ltr" className="flex items-center justify-center gap-2">
                            <Phone className="h-4 w-4 ml-2" />
                            <span className="font-bold">{carData.seller_phone}</span>
                          </a>
                        </Button>
                        <Button 
                          className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
                          size="lg"
                          asChild
                        >
                          <a 
                            href={`https://wa.me/972${carData.seller_phone.replace(/^0/, '').replace(/\D/g, '')}`}
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
                      if (carData.user_id === user.id) {
                        toast({
                          title: "שגיאה",
                          description: "לא ניתן לשלוח הודעה לעצמך",
                          variant: "destructive"
                        });
                        return;
                      }
                      window.location.href = `/messages?seller=${carData.user_id}&item=${carData.id}`;
                    }}
                  >
                    <MessageSquare className="h-4 w-4 ml-2" />
                    שלח הודעה למוכר
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-3">פרטי המפרסם</h3>
                  {carData.seller_name || carData.seller_phone ? (
                    <div className="space-y-3">
                      {carData.seller_name && (
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <span className="font-bold text-primary">{carData.seller_name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{carData.seller_name}</div>
                            <div className="text-sm text-muted-foreground">מפרסם פרטי</div>
                          </div>
                        </div>
                      )}
                      {carData.seller_phone && showPhone && (
                        <div className="pt-3 border-t border-border">
                          <div className="text-sm text-muted-foreground mb-1">טלפון</div>
                          <a 
                            href={`tel:${carData.seller_phone}`}
                            className="text-lg font-bold text-foreground hover:text-primary transition-colors"
                            dir="ltr"
                          >
                            {carData.seller_phone}
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      צור קשר דרך הכפתורים למעלה
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Finance Calculator */}
            {carDetails.price && carDetails.price !== "לא ציין מחיר" && (
              <div className="mb-6">
                <FinanceCalculator 
                  carPrice={parseFloat(carDetails.price.replace(/,/g, ""))} 
                />
              </div>
            )}

            {/* AI Report */}
            <AIReport itemType="car" itemData={carDetails} />
          </div>
        </div>
      </main>

      <Footer />

      {/* AI Analysis Dialog */}
      <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
              דוח AI מקצועי
            </DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {analysis}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarDetails;
