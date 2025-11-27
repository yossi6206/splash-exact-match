import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Share2, MapPin, Calendar, Shield, Package, Truck, Phone, Mail, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
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

  // Mock reviews data
  const mockReviews = [
    {
      id: "1",
      userName: "דני לוי",
      rating: 5,
      title: "מחשב מעולה למפתחים",
      comment: "קניתי את המחשב לפני חודשיים והוא פשוט מדהים. הביצועים מעולים, המסך חד ומדויק, והסוללה מחזיקה כל יום עבודה. ממליץ בחום!",
      verifiedPurchase: true,
      helpfulCount: 12,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "2",
      userName: "שרה כהן",
      rating: 4,
      title: "מצוין אבל יקר",
      comment: "המחשב באיכות מעולה ועובד מהר מאוד. המסך מדהים לעבודת עיצוב. המחיר קצת גבוה אבל שווה את זה.",
      verifiedPurchase: true,
      helpfulCount: 8,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "3",
      userName: "אבי ישראלי",
      rating: 5,
      title: "שווה כל שקל!",
      comment: "עברתי מ-Windows ל-Mac והחוויה פשוט מדהימה. הכל זורם, הכל עובד. המוכר היה מקצועי ועזר לי בהעברה.",
      verifiedPurchase: false,
      helpfulCount: 15,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const reviewStats = {
    totalReviews: mockReviews.length,
    averageRating: 4.7,
    ratingDistribution: {
      5: 2,
      4: 1,
      3: 0,
      2: 0,
      1: 0
    }
  };

  const handleSubmitReview = (review: { rating: number; title: string; comment: string }) => {
    if (!user) {
      toast({
        title: "נדרשת התחברות",
        description: "יש להתחבר כדי לכתוב ביקורת",
        variant: "destructive"
      });
      return;
    }

    // TODO: Save review to database
    toast({
      title: "הביקורת נשלחה בהצלחה",
      description: "תודה על השיתוף!"
    });
  };

  const handleHelpful = (reviewId: string) => {
    if (!user) {
      toast({
        title: "נדרשת התחברות",
        description: "יש להתחבר כדי לדרג ביקורות",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "תודה על המשוב!",
      description: "דירגת ביקורת זו כמועילה"
    });
  };

  // Mock data
  const laptop = {
    id,
    title: "MacBook Pro 14 אינץ' M3 Pro",
    price: 9200,
    originalPrice: 12000,
    images: [laptopImage, laptopImage, laptopImage, laptopImage],
    condition: "כמו חדש",
    location: "תל אביב, מרכז",
    postedDate: "לפני 3 ימים",
    description: "MacBook Pro במצב מושלם, נקנה לפני 6 חודשים בלבד. כולל את כל האביזרים המקוריים - מטען, כבל ואריזה. האחריות עדיין בתוקף עד 2025. המחשב נשמר במצב מעולה, ללא שריטות או פגמים. מתאים מאוד למעצבים, מפתחים ולעבודה מקצועית כבדה.",
    specifications: {
      מעבד: "Apple M3 Pro (12-core CPU)",
      זיכרון: "18GB RAM",
      אחסון: "512GB SSD",
      מסך: '14.2" Liquid Retina XDR',
      רזולוציה: "3024 x 1964",
      כרטיס_גרפי: "18-core GPU",
      מערכת_הפעלה: "macOS Sonoma",
      משקל: "1.6 ק״ג",
      סוללה: "עד 18 שעות",
      תקשורת: "Wi-Fi 6E, Bluetooth 5.3",
      יציאות: "3x Thunderbolt 4, HDMI, SDXC, 3.5mm"
    },
    features: [
      "במצב מושלם",
      "חבילה מלאה",
      "אחריות יבואן",
      "אריזה מקורית",
      "כל האביזרים",
      "ללא שריטות"
    ],
    seller: {
      name: "יוסי כהן",
      memberSince: "2020",
      rating: 4.8,
      totalSales: 34,
      phone: "050-1234567",
      verified: true
    }
  };

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
          <span className="text-foreground">{laptop.title}</span>
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
                    src={laptop.images[selectedImage]}
                    alt={laptop.title}
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
                    {laptop.images.map((image, index) => (
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
              <h1 className="text-3xl font-bold text-foreground mb-3">{laptop.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{laptop.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{laptop.postedDate}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">תכונות ויתרונות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {laptop.features.map((feature, index) => (
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

            {/* Description */}
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

            {/* Technical Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">מפרט טכני</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0 divide-y">
                  {Object.entries(laptop.specifications).map(([key, value], index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 py-3 hover:bg-muted/50 transition-colors px-3 -mx-3 rounded"
                    >
                      <div className="text-muted-foreground font-medium">
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div className="text-foreground font-semibold">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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

            {/* Reviews Section */}
            <div className="space-y-6">
              <Tabs defaultValue="reviews" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="reviews">ביקורות ({mockReviews.length})</TabsTrigger>
                  <TabsTrigger value="write">כתוב ביקורת</TabsTrigger>
                </TabsList>
                
                <TabsContent value="reviews" className="space-y-6 mt-6">
                  <ReviewStats
                    totalReviews={reviewStats.totalReviews}
                    averageRating={reviewStats.averageRating}
                    ratingDistribution={reviewStats.ratingDistribution}
                  />
                  <ReviewsList
                    reviews={mockReviews}
                    onHelpful={handleHelpful}
                    onNotHelpful={handleHelpful}
                  />
                </TabsContent>
                
                <TabsContent value="write" className="mt-6">
                  <ReviewForm
                    onSubmit={handleSubmitReview}
                  />
                </TabsContent>
              </Tabs>
            </div>
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
                        ₪{laptop.price.toLocaleString()}
                      </span>
                      {laptop.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          ₪{laptop.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {laptop.originalPrice && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        חיסכון של ₪{(laptop.originalPrice - laptop.price).toLocaleString()}
                      </Badge>
                    )}
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
                    <Button variant="outline" className="w-full" size="lg">
                      <Mail className="ml-2 h-4 w-4" />
                      שלח מייל
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
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {laptop.seller.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{laptop.seller.name}</span>
                      {laptop.seller.verified && (
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                          מאומת
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      חבר מאז {laptop.seller.memberSince}
                    </div>
                  </div>
                </div>

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