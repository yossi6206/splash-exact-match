import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileHeader from "@/components/MobileHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Share2,
  Heart,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Loader2,
  Truck,
  HandshakeIcon,
  Calendar,
  Ruler,
  Weight,
  Shield,
  Package
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SellerReviewsList } from "@/components/seller-reviews/SellerReviewsList";

const SecondhandDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchItemDetails();
      incrementViewCount();
    }
  }, [id]);

  const incrementViewCount = async () => {
    if (!id) return;
    
    try {
      const { data: currentItem } = await supabase
        .from("secondhand_items")
        .select("views_count")
        .eq("id", id)
        .single();

      if (currentItem) {
        await supabase
          .from("secondhand_items")
          .update({ views_count: (currentItem.views_count || 0) + 1 })
          .eq("id", id);
      }
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const fetchItemDetails = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("secondhand_items")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching item:", error);
      toast.error("שגיאה בטעינת הפרטים");
    } else {
      setItem(data);
    }
    setLoading(false);
  };

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  const nextImage = () => {
    if (item?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
    }
  };

  const prevImage = () => {
    if (item?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader />
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader />
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">המוצר לא נמצא</h1>
          <Link to="/secondhand">
            <Button>חזרה לרשימה</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = item.images || [];

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Left Column - Images and Details */}
          <div className="space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              {images.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden group cursor-pointer" onClick={() => openGallery(0)}>
                    <img
                      src={images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-4 left-4 gap-2"
                    >
                      <Maximize2 className="h-4 w-4" />
                      צפה בגלריה
                    </Button>
                  </div>

                  {/* Thumbnail Grid */}
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 px-4 pb-4">
                      {images.slice(1, 5).map((img: string, index: number) => (
                        <div
                          key={index}
                          className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                          onClick={() => openGallery(index + 1)}
                        >
                          <img
                            src={img}
                            alt={`${item.title} - תמונה ${index + 2}`}
                            className="w-full h-full object-cover"
                          />
                          {index === 3 && images.length > 5 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                +{images.length - 5}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">אין תמונות</p>
                </div>
              )}
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">תיאור</h2>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {item.description || "אין תיאור זמין"}
              </p>
            </Card>

            {/* Item Details */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">פרטי המוצר</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">קטגוריה</span>
                    <p className="font-medium text-lg">{item.category}</p>
                  </div>
                  {item.subcategory && (
                    <div>
                      <span className="text-sm text-muted-foreground">תת-קטגוריה</span>
                      <p className="font-medium">{item.subcategory}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-muted-foreground">מצב</span>
                    <p className="font-medium">{item.condition}</p>
                  </div>
                  {item.brand && (
                    <div>
                      <span className="text-sm text-muted-foreground">מותג</span>
                      <p className="font-medium">{item.brand}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {item.size && (
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-sm text-muted-foreground">גודל/מידה</span>
                        <p className="font-medium">{item.size}</p>
                      </div>
                    </div>
                  )}
                  {item.color && (
                    <div>
                      <span className="text-sm text-muted-foreground">צבע</span>
                      <p className="font-medium">{item.color}</p>
                    </div>
                  )}
                  {item.material && (
                    <div>
                      <span className="text-sm text-muted-foreground">חומר</span>
                      <p className="font-medium">{item.material}</p>
                    </div>
                  )}
                  {item.age && (
                    <div>
                      <span className="text-sm text-muted-foreground">גיל/תקופת שימוש</span>
                      <p className="font-medium">{item.age}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Additional specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {item.year_manufactured && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm text-muted-foreground">שנת ייצור</span>
                      <p className="font-medium">{item.year_manufactured}</p>
                    </div>
                  </div>
                )}
                {item.dimensions && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm text-muted-foreground">מידות</span>
                      <p className="font-medium">{item.dimensions}</p>
                    </div>
                  </div>
                )}
                {item.weight && (
                  <div className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm text-muted-foreground">משקל</span>
                      <p className="font-medium">{item.weight}</p>
                    </div>
                  </div>
                )}
                {item.warranty && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm text-muted-foreground">אחריות</span>
                      <p className="font-medium">{item.warranty}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery and Negotiable badges */}
              {(item.delivery_available || item.negotiable) && (
                <>
                  <Separator className="my-6" />
                  <div className="flex flex-wrap gap-3">
                    {item.delivery_available && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-300 dark:border-green-700 px-4 py-2">
                        <Truck className="h-4 w-4 ml-2" />
                        משלוח זמין
                      </Badge>
                    )}
                    {item.negotiable && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border-blue-300 dark:border-blue-700 px-4 py-2">
                        <HandshakeIcon className="h-4 w-4 ml-2" />
                        ניתן למיקוח
                      </Badge>
                    )}
                  </div>
                </>
              )}

              {item.features && item.features.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <span className="text-sm text-muted-foreground mb-2 block">תכונות נוספות</span>
                    <div className="flex flex-wrap gap-2">
                      {item.features.map((feature: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          ✓ {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Right Column - Seller Info and Actions */}
          <div className="space-y-6">
            {/* Price and Title Card */}
            <Card className="p-6 sticky top-20">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{item.location}</span>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="text-3xl font-bold text-primary">
                    ₪{item.price.toLocaleString()}
                  </div>
                </div>

                <Separator />

                {/* Contact Buttons */}
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={async () => {
                      if (item.seller_phone) {
                        // Increment contacts count
                        try {
                          await supabase
                            .from("secondhand_items")
                            .update({ contacts_count: (item.contacts_count || 0) + 1 })
                            .eq("id", id);
                        } catch (error) {
                          console.error("Error updating contacts count:", error);
                        }
                        
                        window.open(`tel:${item.seller_phone}`, '_self');
                      } else {
                        toast.error("מספר טלפון לא זמין");
                      }
                    }}
                  >
                    <Phone className="ml-2 h-5 w-5" />
                    צור קשר עם המוכר
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="lg">
                      <Heart className="ml-2 h-5 w-5" />
                      שמור
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={async () => {
                        try {
                          await navigator.share({
                            title: item.title,
                            text: `${item.title} - ₪${item.price.toLocaleString()}`,
                            url: window.location.href,
                          });
                          
                          // Increment clicks count for share
                          await supabase
                            .from("secondhand_items")
                            .update({ clicks_count: (item.clicks_count || 0) + 1 })
                            .eq("id", id);
                        } catch (error) {
                          // Fallback for browsers that don't support share
                          navigator.clipboard.writeText(window.location.href);
                          toast.success("הקישור הועתק ללוח");
                        }
                      }}
                    >
                      <Share2 className="ml-2 h-5 w-5" />
                      שתף
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Seller Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold">פרטי המוכר</h3>
                  <div className="text-sm space-y-1">
                    {item.seller_name && (
                      <p>
                        <span className="text-muted-foreground">שם:</span>{" "}
                        {item.seller_name}
                      </p>
                    )}
                    {item.seller_phone && (
                      <p>
                        <span className="text-muted-foreground">טלפון:</span>{" "}
                        {item.seller_phone}
                      </p>
                    )}
                  </div>
                  {item.user_id && (
                    <Link to={`/seller/${item.user_id}`}>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        צפה בפרופיל המוכר
                      </Button>
                    </Link>
                  )}
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800 dark:text-amber-200">
                      <p className="font-semibold mb-1">טיפ בטיחות</p>
                      <p>תמיד פגשו במקום ציבורי ובדקו את המוצר לפני התשלום</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Seller Reviews Section */}
        {item.user_id && (
          <div className="mt-12">
            <SellerReviewsList sellerId={item.user_id} />
          </div>
        )}
      </main>

      {/* Image Gallery Dialog */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {images.length > 0 && (
              <>
                <img
                  src={images[currentImageIndex]}
                  alt={`${item.title} - תמונה ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />

                {images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      onClick={prevImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>

                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      onClick={nextImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default SecondhandDetails;
