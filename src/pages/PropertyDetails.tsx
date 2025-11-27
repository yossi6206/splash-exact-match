import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Share2, Home, MapPin, Bed, Square, Calendar, Shield } from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data - בפועל יגיע מהשרת
  const property = {
    id,
    title: "דירת 4 חדרים מרווחת בנווה צדק",
    price: "2,450,000",
    location: "תל אביב, נווה צדק",
    rooms: 4,
    size: 120,
    floor: 3,
    totalFloors: 5,
    propertyType: "דירה",
    condition: "משופץ",
    images: [property1],
    description: "דירה מרווחת ומוארת בלב נווה צדק, משופצת ברמה גבוהה. הדירה כוללת סלון גדול, מטבח מעוצב, 3 חדרי שינה, 2 חדרי רחצה ומרפסת שמש.",
    features: [
      "מעלית",
      "חניה",
      "מרפסת",
      "מחסן",
      "ממ\"ד",
      "כניסה נפרדת"
    ],
    year: 2018
  };

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <img 
              src={property.images[0]} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-video relative overflow-hidden rounded-lg bg-muted">
                <img 
                  src={property.images[0]} 
                  alt={`תמונה ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
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
                <div className="flex items-center gap-3">
                  <Square className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">מ"ר</div>
                    <div className="font-semibold">{property.size}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">קומה</div>
                    <div className="font-semibold">{property.floor}/{property.totalFloors}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">שנה</div>
                    <div className="font-semibold">{property.year}</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">תיאור הנכס</h2>
              <p className="text-foreground/80 leading-relaxed">{property.description}</p>
            </Card>

            {/* Features */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">תכונות</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar - Contact Card */}
          <div className="lg:sticky lg:top-6 h-fit">
            <Card className="p-6">
              <div className="mb-6">
                <div className="text-3xl font-bold text-foreground mb-1">
                  ₪{property.price}
                </div>
                <div className="text-sm text-muted-foreground">מחיר מבוקש</div>
              </div>

              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  צור קשר
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  שלח הודעה
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-3">פרטי המפרסם</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">שם</span>
                    <span className="font-medium">יוסי כהן</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">טלפון</span>
                    <span className="font-medium">050-1234567</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetails;