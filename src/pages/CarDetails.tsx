import { useState } from "react";
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

const CarDetails = () => {
  const [mainImage, setMainImage] = useState(carImage1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  
  const images = [carImage1, carImage1, carImage1];

  const carDetails = {
    model: "ב מ וו סדרה 7",
    description: "Luxury 740Le פלאג-אין אוט' 5 דל 2.0 (258 כ\"ס)",
    year: 2019,
    km: 48000,
    hand: 2,
    location: "כפר קאסם",
    price: "לא ציין מחיר",
    features: [
      "סטט בתקופה",
      "גלגל מגנזיום",
      "בקרת שיוט מרחק",
      "מצלמות היקפיות",
      "חיישני חניה",
      "תיבת הילוכים אוטומטית"
    ]
  };

  const handleAnalyze = async () => {
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
                  תמונה 1 מתוך 10
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
                <h1 className="text-3xl font-bold text-foreground mb-2">ב מ וו סדרה 7</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Luxury 740Le פלאג-אין אוט' 5 דל 2.0 (258 כ"ס)
                </p>

                {/* Key Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                    <Gauge className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">ק״מ</div>
                      <div className="font-bold text-foreground">48,000</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                    <Hand className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">יד</div>
                      <div className="font-bold text-foreground">2</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">שנה</div>
                      <div className="font-bold text-foreground">2019</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">מיקום</div>
                      <div className="font-bold text-foreground">כפר קאסם</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="border-t border-border pt-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">תיאור</h2>
                  <p className="text-foreground leading-relaxed">
                    רכב במצב מצוין מאוד שמור מאוד, טופול על יד החברה תמיד במוסך , הרכב לנהג יחיד ללא ידיים טובנים 
                    תיירה פרטית, ללא תאונות, נבדק עפ שדרוג.
                  </p>
                </div>

                {/* Features */}
                <div className="border-t border-border pt-6 mt-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">ציוד ואבזור</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      "סטט בתקופה",
                      "גלגל מגנזיום",
                      "בקרת שיוט מרחק",
                      "מצלמות היקפיות",
                      "חיישני חניה",
                      "תיבת הילוכים אוטומטית",
                    ].map((feature, index) => (
                      <Badge key={index} variant="secondary" className="justify-center py-2">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            {/* Price Card */}
            <Card className="mb-6 border-border">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-foreground mb-2">לא ציון מחיר</div>
                  <p className="text-sm text-muted-foreground">
                    מוכנים ברבית מתאימה לקבוצות יד 2 +
                  </p>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-lg font-semibold gap-2"
                  >
                    <Phone className="h-5 w-5" />
                    הצעת מספר טלפון
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-lg font-semibold gap-2 border-2"
                  >
                    <MessageSquare className="h-5 w-5" />
                    שליחת הודעה
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
                  <p>פורסם ב 26/11/25</p>
                  <p>דווח על מודעה 41484453</p>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card className="border-border mb-6">
              <CardContent className="p-6">
                <h3 className="font-bold text-foreground mb-4">על המוכר</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="font-bold text-primary">M</span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">משה כהן</div>
                    <div className="text-sm text-muted-foreground">חבר מזה 2019</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  צפה במודעות נוספות
                </Button>
              </CardContent>
            </Card>

            {/* AI Report */}
            <Card className="border-border bg-gradient-to-br from-blue-50/50 to-purple-50/50">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="font-bold text-foreground mb-3 flex items-center justify-center gap-2">
                  דוח AI מקצועי
                  <Sparkles className="h-5 w-5 text-primary" />
                </h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  קבל ניתוח מקצועי מבוסס AI על מצב הרכב, המחיר והמלצות לרכישה
                </p>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      מייצר דוח...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      צור דוח AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
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
