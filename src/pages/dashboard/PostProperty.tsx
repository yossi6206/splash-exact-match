import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Home } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { ImageUpload } from "@/components/ImageUpload";
import { createValidatedChangeHandler, propertyValidationConfig } from "@/utils/formValidation";

const propertySchema = z.object({
  listing_type: z.enum(["למכירה", "להשכרה"], { required_error: "סוג מודעה חובה" }),
  property_type: z.string().min(1, "סוג נכס חובה"),
  rooms: z.number().int().min(0, "מספר חדרים לא תקין").max(50, "מספר חדרים גבוה מדי"),
  size: z.number().int().min(1, "שטח חייב להיות חיובי").max(10000, "שטח גבוה מדי").optional(),
  floor: z.number().int().min(-5, "קומה לא תקינה").max(200, "קומה גבוהה מדי"),
  price: z.number().int().min(1, "מחיר חובה").max(1000000000, "מחיר גבוה מדי"),
  location: z.string().trim().min(2, "עיר/אזור חובה"),
  street: z.string().trim().min(2, "רחוב חובה"),
  house_number: z.string().trim().min(1, "מס׳ בית חובה"),
  description: z.string().trim().min(20, "תיאור חייב להכיל לפחות 20 תווים").max(10000, "תיאור ארוך מדי"),
  seller_name: z.string().trim().min(2, "שם מוכר חובה"),
  seller_phone: z.string().trim().regex(/^05\d{8}$/, "מספר טלפון לא תקין (צריך להיות 05XXXXXXXX)"),
});

const PostProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    listing_type: "למכירה",
    property_type: "",
    rooms: "",
    size: "",
    floor: "",
    total_floors: "",
    year: "",
    price: "",
    location: "",
    street: "",
    house_number: "",
    condition: "",
    description: "",
    seller_name: "",
    seller_phone: "",
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const propertyFeatures = [
    "חניה",
    "מעלית",
    "מרפסת",
    "נגיש לנכים",
    "מיזוג",
    "מחסן",
    "ממ״ד",
    "סורגים",
    "משופצת",
    "מטבח כשר",
    "בריכה",
    "גינה",
    "מרוהטת",
    "כיווני אוויר טובים",
    "שמורה היטב",
  ];

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const handleInputChange = createValidatedChangeHandler(setFormData, formData, propertyValidationConfig);

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("עליך להתחבר כדי לפרסם נכס");
      navigate("/auth");
      return;
    }

    try {
      propertySchema.parse({
        listing_type: formData.listing_type,
        property_type: formData.property_type,
        rooms: parseInt(formData.rooms),
        size: formData.size ? parseInt(formData.size) : undefined,
        floor: parseInt(formData.floor),
        price: parseInt(formData.price),
        location: formData.location,
        street: formData.street,
        house_number: formData.house_number,
        description: formData.description,
        seller_name: formData.seller_name,
        seller_phone: formData.seller_phone,
      });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        toast.error(validationError.errors[0].message);
        return;
      }
    }

    if (imageUrls.length === 0) {
      toast.error("נא להעלות לפחות תמונה אחת");
      return;
    }

    setLoading(true);

    try {
      const generatedTitle = `${formData.street} ${formData.house_number}`;
      const { error } = await supabase.from("properties").insert({
        user_id: user.id,
        title: generatedTitle,
        listing_type: formData.listing_type,
        property_type: formData.property_type,
        rooms: parseInt(formData.rooms),
        size: formData.size ? parseInt(formData.size) : null,
        floor: formData.floor ? parseInt(formData.floor) : null,
        total_floors: formData.total_floors ? parseInt(formData.total_floors) : null,
        year: formData.year ? parseInt(formData.year) : null,
        price: parseInt(formData.price),
        location: formData.location,
        street: formData.street,
        house_number: formData.house_number,
        condition: formData.condition || null,
        description: formData.description,
        features: selectedFeatures,
        parking: selectedFeatures.includes("חניה"),
        elevator: selectedFeatures.includes("מעלית"),
        balcony: selectedFeatures.includes("מרפסת"),
        accessible: selectedFeatures.includes("נגיש לנכים"),
        images: imageUrls,
        seller_name: formData.seller_name,
        seller_phone: formData.seller_phone,
        status: "active",
      });

      if (error) throw error;

      toast.success("הנכס פורסם בהצלחה!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error posting property:", error);
      toast.error("שגיאה בפרסום הנכס: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Home className="w-8 h-8 text-primary" />
          פרסם נכס למכירה / השכרה
        </h1>
        <p className="text-muted-foreground">
          מלא את הפרטים למטה ופרסם נכס באתר
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">תמונות *</h2>
          <ImageUpload
            onImagesChange={setImageUrls}
            maxImages={8}
            existingImages={imageUrls}
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">פרטי הנכס</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="listing_type">סוג מודעה *</Label>
              <Select
                value={formData.listing_type}
                onValueChange={(value) => setFormData({ ...formData, listing_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג מודעה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="למכירה">למכירה</SelectItem>
                  <SelectItem value="להשכרה">להשכרה</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="property_type">סוג נכס *</Label>
                <Select
                  value={formData.property_type}
                  onValueChange={(value) => setFormData({ ...formData, property_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג נכס" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="דירה">דירה</SelectItem>
                    <SelectItem value="דירת גן">דירת גן</SelectItem>
                    <SelectItem value="בית פרטי">בית פרטי</SelectItem>
                    <SelectItem value="דופלקס">דופלקס</SelectItem>
                    <SelectItem value="פנטהאוז">פנטהאוז</SelectItem>
                    <SelectItem value="סטודיו">סטודיו</SelectItem>
                    <SelectItem value="משרד">משרד</SelectItem>
                    <SelectItem value="חנות">חנות</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rooms">מספר חדרים *</Label>
                <Input
                  id="rooms"
                  name="rooms"
                  type="number"
                  step="0.5"
                  value={formData.rooms}
                  onChange={handleInputChange}
                  required
                  placeholder="3.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">שטח (מ״ר)</Label>
                <Input
                  id="size"
                  name="size"
                  type="number"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floor">קומה *</Label>
                <Input
                  id="floor"
                  name="floor"
                  type="number"
                  value={formData.floor}
                  onChange={handleInputChange}
                  required
                  placeholder="3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_floors">מתוך כמה קומות</Label>
                <Input
                  id="total_floors"
                  name="total_floors"
                  type="number"
                  value={formData.total_floors}
                  onChange={handleInputChange}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">שנת בנייה</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="2015"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">מצב הנכס</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData({ ...formData, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר מצב" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="חדש">חדש</SelectItem>
                    <SelectItem value="משופץ">משופץ</SelectItem>
                    <SelectItem value="במצב טוב">במצב טוב</SelectItem>
                    <SelectItem value="דרוש שיפוץ">דרוש שיפוץ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">מחיר (₪) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="1500000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">עיר / אזור *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="תל אביב - יפו"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street">רחוב *</Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                  placeholder="רוטשילד"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="house_number">מס׳ בית *</Label>
                <Input
                  id="house_number"
                  name="house_number"
                  value={formData.house_number}
                  onChange={handleInputChange}
                  required
                  placeholder="15"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">תיאור הנכס *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="תאר את הנכס, המיקום, השכונה, קרבה לשירותים וכל פרט רלוונטי אחר..."
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">פרטי המוכר</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seller_name">שם המוכר *</Label>
              <Input
                id="seller_name"
                name="seller_name"
                value={formData.seller_name}
                onChange={handleInputChange}
                required
                placeholder="שם מלא"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seller_phone">טלפון נייד *</Label>
              <Input
                id="seller_phone"
                name="seller_phone"
                value={formData.seller_phone}
                onChange={handleInputChange}
                required
                placeholder="0501234567"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">אבזור ומאפיינים</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {propertyFeatures.map((feature) => (
              <div key={feature} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={feature}
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={() => handleFeatureToggle(feature)}
                />
                <Label
                  htmlFor={feature}
                  className="text-sm font-normal cursor-pointer"
                >
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? "מפרסם..." : "פרסם נכס"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            ביטול
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostProperty;
