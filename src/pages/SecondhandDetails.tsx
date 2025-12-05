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
  Package,
  MessageSquare,
  Users,
  Eye,
  FileCheck
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SellerReviewsList } from "@/components/seller-reviews/SellerReviewsList";
import { useAuth } from "@/contexts/AuthContext";
import { ReportListingDialog } from "@/components/ReportListingDialog";
import { ShareMenu } from "@/components/ShareMenu";
import AIReport from "@/components/AIReport";
import SimilarListings from "@/components/SimilarListings";
import { CardContent } from "@/components/ui/card";
import { CloudflareImage } from "@/components/CloudflareImage";

// Helper component for displaying detail items
const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 bg-primary/10 rounded-lg">
      {icon}
    </div>
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  </div>
);

// Parse features array to extract category-specific data
const parseFeatureData = (features: string[] | null): Record<string, string> => {
  if (!features) return {};
  const data: Record<string, string> = {};
  
  features.forEach(feature => {
    // Try to parse key:value format (e.g., "מעבד: Intel i7")
    if (feature.includes(':')) {
      const [key, ...valueParts] = feature.split(':');
      data[key.trim()] = valueParts.join(':').trim();
    }
  });
  
  return data;
};

// Render category-specific details based on category/subcategory
const renderCategorySpecificDetails = (item: any) => {
  const category = item.category;
  const subcategory = item.subcategory;
  const parsedFeatures = parseFeatureData(item.features);
  
  // Computer-specific fields
  if (category === 'מחשבים' || category === 'אלקטרוניקה') {
    const computerFields = [
      { key: 'מעבד', label: 'מעבד' },
      { key: 'processor', label: 'מעבד' },
      { key: 'RAM', label: 'זיכרון RAM' },
      { key: 'ram', label: 'זיכרון RAM' },
      { key: 'זיכרון', label: 'זיכרון RAM' },
      { key: 'אחסון', label: 'אחסון' },
      { key: 'storage', label: 'אחסון' },
      { key: 'כרטיס מסך', label: 'כרטיס מסך' },
      { key: 'graphics', label: 'כרטיס מסך' },
      { key: 'מסך', label: 'גודל מסך' },
      { key: 'screen', label: 'גודל מסך' },
      { key: 'מערכת הפעלה', label: 'מערכת הפעלה' },
      { key: 'os', label: 'מערכת הפעלה' },
      { key: 'סוללה', label: 'סוללה' },
      { key: 'battery', label: 'סוללה' },
      { key: 'רזולוציה', label: 'רזולוציה' },
      { key: 'resolution', label: 'רזולוציה' },
      { key: 'חיבורים', label: 'חיבורים' },
      { key: 'ports', label: 'יציאות' },
    ];
    
    const displayFields = computerFields.filter(f => parsedFeatures[f.key]);
    
    if (displayFields.length > 0) {
      return (
        <>
          <Separator className="my-6" />
          <h3 className="text-lg font-semibold mb-4">מפרט טכני</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayFields.map((field, idx) => (
              <div key={idx} className="bg-muted/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground">{field.label}</div>
                <div className="font-semibold">{parsedFeatures[field.key]}</div>
              </div>
            ))}
          </div>
        </>
      );
    }
  }
  
  // Phone-specific fields
  if (category === 'מכשירים סלולריים' || subcategory?.includes('טלפון') || subcategory?.includes('סמארטפון')) {
    const phoneFields = [
      { key: 'נפח אחסון', label: 'נפח אחסון' },
      { key: 'storage', label: 'נפח אחסון' },
      { key: 'מסך', label: 'גודל מסך' },
      { key: 'screen', label: 'גודל מסך' },
      { key: 'סוללה', label: 'סוללה' },
      { key: 'battery', label: 'סוללה' },
      { key: 'מצלמה', label: 'מצלמה' },
      { key: 'camera', label: 'מצלמה' },
      { key: 'RAM', label: 'זיכרון RAM' },
    ];
    
    const displayFields = phoneFields.filter(f => parsedFeatures[f.key]);
    
    if (displayFields.length > 0) {
      return (
        <>
          <Separator className="my-6" />
          <h3 className="text-lg font-semibold mb-4">מפרט טכני</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayFields.map((field, idx) => (
              <div key={idx} className="bg-muted/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground">{field.label}</div>
                <div className="font-semibold">{parsedFeatures[field.key]}</div>
              </div>
            ))}
          </div>
        </>
      );
    }
  }
  
  // Furniture-specific fields
  if (category === 'ריהוט') {
    const furnitureFields = [
      { key: 'סוג ריפוד', label: 'סוג ריפוד' },
      { key: 'מספר מושבים', label: 'מספר מושבים' },
      { key: 'גודל מיטה', label: 'גודל מיטה' },
      { key: 'צורת שולחן', label: 'צורת שולחן' },
      { key: 'סוג כיסא', label: 'סוג כיסא' },
    ];
    
    const displayFields = furnitureFields.filter(f => parsedFeatures[f.key]);
    
    if (displayFields.length > 0) {
      return (
        <>
          <Separator className="my-6" />
          <h3 className="text-lg font-semibold mb-4">פרטי הריהוט</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayFields.map((field, idx) => (
              <div key={idx} className="bg-muted/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground">{field.label}</div>
                <div className="font-semibold">{parsedFeatures[field.key]}</div>
              </div>
            ))}
          </div>
        </>
      );
    }
  }
  
  // Sports equipment fields
  if (category === 'ספורט ופנאי') {
    const sportsFields = [
      { key: 'סוג אופניים', label: 'סוג אופניים' },
      { key: 'גודל גלגלים', label: 'גודל גלגלים' },
      { key: 'הספק מנוע', label: 'הספק מנוע' },
      { key: 'טווח נסיעה', label: 'טווח נסיעה' },
    ];
    
    const displayFields = sportsFields.filter(f => parsedFeatures[f.key]);
    
    if (displayFields.length > 0) {
      return (
        <>
          <Separator className="my-6" />
          <h3 className="text-lg font-semibold mb-4">מפרט טכני</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayFields.map((field, idx) => (
              <div key={idx} className="bg-muted/50 rounded-lg p-3">
                <div className="text-sm text-muted-foreground">{field.label}</div>
                <div className="font-semibold">{parsedFeatures[field.key]}</div>
              </div>
            ))}
          </div>
        </>
      );
    }
  }
  
  // If there are any parsed features that weren't displayed, show them generically
  const remainingFeatures = Object.entries(parsedFeatures).filter(([key]) => 
    !['מעבד', 'processor', 'RAM', 'ram', 'זיכרון', 'אחסון', 'storage', 'כרטיס מסך', 'graphics', 
      'מסך', 'screen', 'מערכת הפעלה', 'os', 'סוללה', 'battery', 'רזולוציה', 'resolution', 
      'חיבורים', 'ports', 'נפח אחסון', 'מצלמה', 'camera', 'סוג ריפוד', 'מספר מושבים',
      'גודל מיטה', 'צורת שולחן', 'סוג כיסא', 'סוג אופניים', 'גודל גלגלים', 'הספק מנוע', 'טווח נסיעה'
    ].includes(key)
  );
  
  if (remainingFeatures.length > 0) {
    return (
      <>
        <Separator className="my-6" />
        <h3 className="text-lg font-semibold mb-4">פרטים נוספים</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {remainingFeatures.map(([key, value], idx) => (
            <div key={idx} className="bg-muted/50 rounded-lg p-3">
              <div className="text-sm text-muted-foreground">{key}</div>
              <div className="font-semibold">{value}</div>
            </div>
          ))}
        </div>
      </>
    );
  }
  
  return null;
};

const SecondhandDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

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
    <div className="min-h-screen bg-background pb-20 md:pb-0">
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
                    <CloudflareImage
                      src={images[0]}
                      alt={item.title}
                      preset="hero"
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
                          <CloudflareImage
                            src={img}
                            alt={`${item.title} - תמונה ${index + 2}`}
                            preset="thumbnail"
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
              <h2 className="text-2xl font-bold mb-6">פרטי המוצר</h2>
              
              {/* Basic Info Section */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {/* Category */}
                <DetailItem 
                  icon={<Package className="h-5 w-5 text-primary" />}
                  label="קטגוריה"
                  value={item.category}
                />

                {/* Subcategory */}
                {item.subcategory && (
                  <DetailItem 
                    icon={<FileCheck className="h-5 w-5 text-primary" />}
                    label="תת-קטגוריה"
                    value={item.subcategory}
                  />
                )}

                {/* Condition */}
                <DetailItem 
                  icon={<Shield className="h-5 w-5 text-primary" />}
                  label="מצב"
                  value={item.condition}
                />

                {/* Brand */}
                {item.brand && (
                  <DetailItem 
                    icon={<Users className="h-5 w-5 text-primary" />}
                    label="מותג/יצרן"
                    value={item.brand}
                  />
                )}

                {/* Size */}
                {item.size && (
                  <DetailItem 
                    icon={<Ruler className="h-5 w-5 text-primary" />}
                    label="גודל/דגם"
                    value={item.size}
                  />
                )}

                {/* Color */}
                {item.color && (
                  <DetailItem 
                    icon={<Eye className="h-5 w-5 text-primary" />}
                    label="צבע"
                    value={item.color}
                  />
                )}

                {/* Material */}
                {item.material && (
                  <DetailItem 
                    icon={<Package className="h-5 w-5 text-primary" />}
                    label="חומר"
                    value={item.material}
                  />
                )}

                {/* Age */}
                {item.age && (
                  <DetailItem 
                    icon={<Calendar className="h-5 w-5 text-primary" />}
                    label="גיל המוצר"
                    value={item.age}
                  />
                )}

                {/* Year Manufactured */}
                {item.year_manufactured && (
                  <DetailItem 
                    icon={<Calendar className="h-5 w-5 text-primary" />}
                    label="שנת ייצור"
                    value={item.year_manufactured.toString()}
                  />
                )}

                {/* Dimensions */}
                {item.dimensions && (
                  <DetailItem 
                    icon={<Ruler className="h-5 w-5 text-primary" />}
                    label="מידות"
                    value={item.dimensions}
                  />
                )}

                {/* Weight */}
                {item.weight && (
                  <DetailItem 
                    icon={<Weight className="h-5 w-5 text-primary" />}
                    label="משקל"
                    value={item.weight}
                  />
                )}

                {/* Warranty */}
                {item.warranty && (
                  <DetailItem 
                    icon={<Shield className="h-5 w-5 text-primary" />}
                    label="אחריות"
                    value={item.warranty}
                  />
                )}

                {/* Delivery Available */}
                {item.delivery_available && (
                  <DetailItem 
                    icon={<Truck className="h-5 w-5 text-primary" />}
                    label="משלוח"
                    value="זמין"
                  />
                )}

                {/* Negotiable */}
                {item.negotiable && (
                  <DetailItem 
                    icon={<HandshakeIcon className="h-5 w-5 text-primary" />}
                    label="מחיר"
                    value="ניתן למיקוח"
                  />
                )}
              </div>

              {/* Category-Specific Details */}
              {renderCategorySpecificDetails(item)}

              {/* Features */}
              {item.features && item.features.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="text-lg font-semibold mb-3">תכונות נוספות</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.features.map((feature: string, index: number) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          ✓ {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </Card>

            {/* Similar Listings - Desktop */}
            <div className="hidden lg:block mt-8">
              <SimilarListings 
                itemType="secondhand"
                currentItemId={id!}
                location={item.location}
                category={item.category}
                priceRange={{ min: item.price, max: item.price }}
              />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Title and Location */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-right">{item.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground justify-end">
                <span className="text-right">{item.location}</span>
                <MapPin className="h-4 w-4 flex-shrink-0" />
              </div>
              <div className="flex gap-2 justify-end">
                <ReportListingDialog itemId={id!} itemType="secondhand" />
                <ShareMenu 
                  title={item.title}
                  variant="outline"
                />
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={async () => {
                    if (!user) {
                      toast.error("יש להתחבר כדי לסמן מוצרים כמועדפים");
                      return;
                    }
                    // TODO: Implement favorite toggle
                  }}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Price and Contact Card */}
            <Card>
              <CardContent className="p-6">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-foreground mb-2">
                    ₪{item.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">מחיר מבוקש</div>
                </div>

                <Separator className="mb-6" />

                {/* Contact Buttons */}
                <div className="space-y-2">
                  {!showPhone ? (
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={async () => {
                        if (item.seller_phone) {
                          setShowPhone(true);
                          // Increment contacts count
                          try {
                            await supabase
                              .from("secondhand_items")
                              .update({ contacts_count: (item.contacts_count || 0) + 1 })
                              .eq("id", id);
                          } catch (error) {
                            console.error("Error updating contacts count:", error);
                          }
                        } else {
                          toast.error("מספר טלפון לא זמין");
                        }
                      }}
                    >
                      <Phone className="ml-2 h-5 w-5" />
                      הצג מספר טלפון
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        className="w-full" 
                        size="lg"
                        asChild
                      >
                        <a href={`tel:${item.seller_phone}`} dir="ltr" className="flex items-center justify-center gap-2">
                          <Phone className="h-4 w-4 ml-2" />
                          <span className="font-bold">{item.seller_phone}</span>
                        </a>
                      </Button>
                      <Button 
                        className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white"
                        size="lg"
                        asChild
                      >
                        <a 
                          href={`https://wa.me/972${(item.seller_phone || '').replace(/^0/, '').replace(/\D/g, '')}`}
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
                  
                  <Button 
                    className="w-full"
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      if (!user) {
                        toast.error("יש להתחבר כדי לשלוח הודעות");
                        return;
                      }
                      if (item.user_id === user.id) {
                        toast.error("לא ניתן לשלוח הודעה לעצמך");
                        return;
                      }
                      window.location.href = `/messages?seller=${item.user_id}&item=${item.id}`;
                    }}
                  >
                    <MessageSquare className="h-4 w-4 ml-2" />
                    שלח הודעה למוכר
                  </Button>
                </div>

                {/* Seller Info */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-3 text-right">פרטי המפרסם</h3>
                  {item.seller_name ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-primary">{item.seller_name.charAt(0)}</span>
                      </div>
                      <div className="text-right flex-1">
                        <div className="font-semibold text-foreground">{item.seller_name}</div>
                        <div className="text-sm text-muted-foreground">מפרסם פרטי</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-right">
                      צור קשר דרך הכפתורים למעלה
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <MapPin className="h-4 w-4" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Report */}
            <AIReport itemType="secondhand" itemData={item} />

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
              </div>
            </Card>
          </div>
        </div>

        {/* Similar Listings - minimal spacing */}
        <div className="mt-4">
          <SimilarListings 
            itemType="secondhand"
            currentItemId={id!}
            location={item.location}
            category={item.category}
            priceRange={{ min: item.price, max: item.price }}
          />
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
