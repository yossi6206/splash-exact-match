import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Car, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { ImageUpload } from "@/components/ImageUpload";
import { createValidatedChangeHandler, carValidationConfig, createPriceChangeHandler, parsePriceToNumber } from "@/utils/formValidation";
import { getManufacturers, getModelsForManufacturer } from "@/data/carManufacturersModels";

const carSchema = z.object({
  manufacturer: z.string().trim().min(2, "יצרן חובה"),
  model: z.string().trim().min(2, "דגם חייב להכיל לפחות 2 תווים").max(200, "דגם ארוך מדי"),
  year: z.number().int().min(1900, "שנה לא תקינה").max(new Date().getFullYear() + 1, "שנה לא תקינה"),
  km: z.number().int().min(0, "קילומטראז' לא יכול להיות שלילי").max(5000000, "קילומטראז' גבוה מדי"),
  hand: z.number().int().min(0, "יד לא יכולה להיות שלילית").max(20, "יד גבוהה מדי"),
  fuel_type: z.string().min(1, "סוג דלק חובה"),
  transmission: z.string().min(1, "תיבת הילוכים חובה"),
  vehicle_type: z.string().min(1, "סוג רכב חובה"),
  condition: z.string().min(1, "מצב הרכב חובה"),
  price: z.string().trim().min(1, "מחיר חובה"),
  location: z.string().trim().min(2, "מיקום חובה"),
  description: z.string().trim().min(20, "תיאור חייב להכיל לפחות 20 תווים").max(10000, "תיאור ארוך מדי"),
  seller_name: z.string().trim().min(2, "שם מוכר חובה"),
  seller_phone: z.string().trim().regex(/^05\d{8}$/, "מספר טלפון לא תקין (צריך להיות 05XXXXXXXX)"),
});

const PostCar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    manufacturer: "",
    model: "",
    year: "",
    km: "",
    hand: "",
    fuel_type: "",
    transmission: "",
    vehicle_type: "",
    condition: "",
    category: "",
    price: "",
    location: "",
    description: "",
    seller_name: "",
    seller_phone: "",
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [isCustomModel, setIsCustomModel] = useState(false);
  
  const carFeatures = [
    "מזגן אוטומטי",
    "מערכת ניווט",
    "חיישני חניה",
    "מצלמה אחורית",
    "חישוקי מגנזיום",
    "גג פנורמי",
    "מושבים מחוממים",
    "בקרת שיוט",
    "Bluetooth",
    "מערכת בידור",
    "USB ו-AUX",
    "כניסה ללא מפתח",
    "התנעה ללא מפתח",
    "מושבי עור",
    "הגה מחומם",
  ];

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Get manufacturers list
  const manufacturers = useMemo(() => getManufacturers(), []);
  
  // Get models based on selected manufacturer
  const availableModels = useMemo(() => {
    if (!formData.manufacturer) return [];
    return getModelsForManufacturer(formData.manufacturer);
  }, [formData.manufacturer]);

  const handleManufacturerChange = (value: string) => {
    setFormData({ ...formData, manufacturer: value, model: "" });
    setIsCustomModel(false);
  };

  const handleModelChange = (value: string) => {
    if (value === "__custom__") {
      setIsCustomModel(true);
      setFormData({ ...formData, model: "" });
    } else {
      setIsCustomModel(false);
      setFormData({ ...formData, model: value });
    }
  };

  const handleInputChange = createValidatedChangeHandler(setFormData, formData, carValidationConfig);

  const handlePriceChange = createPriceChangeHandler(setFormData, formData);

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
      toast.error("עליך להתחבר כדי לפרסם רכב");
      navigate("/auth");
      return;
    }

    // Validate required numeric fields
    const yearNum = formData.year ? parseInt(formData.year) : NaN;
    const kmNum = formData.km ? parseInt(formData.km) : NaN;
    const handNum = formData.hand ? parseInt(formData.hand) : NaN;

    if (isNaN(yearNum)) {
      toast.error("שנת ייצור חובה");
      return;
    }
    if (isNaN(kmNum)) {
      toast.error("קילומטראז' חובה");
      return;
    }
    if (isNaN(handNum)) {
      toast.error("יד חובה");
      return;
    }

    try {
      carSchema.parse({
        manufacturer: formData.manufacturer,
        model: formData.model,
        year: yearNum,
        km: kmNum,
        hand: handNum,
        fuel_type: formData.fuel_type,
        transmission: formData.transmission,
        vehicle_type: formData.vehicle_type,
        condition: formData.condition,
        price: formData.price,
        location: formData.location,
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
      const { error } = await supabase.from("cars").insert({
        user_id: user.id,
        manufacturer: formData.manufacturer,
        model: formData.model,
        year: yearNum,
        km: kmNum,
        hand: handNum,
        fuel_type: formData.fuel_type,
        transmission: formData.transmission,
        vehicle_type: formData.vehicle_type || "רכב פרטי",
        condition: formData.condition,
        category: formData.category || null,
        price: formData.price,
        location: formData.location,
        description: formData.description,
        features: selectedFeatures,
        images: imageUrls,
        status: "active",
        seller_name: formData.seller_name,
        seller_phone: formData.seller_phone,
      });

      if (error) throw error;

      toast.success("הרכב פורסם בהצלחה!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error posting car:", error);
      toast.error("שגיאה בפרסום הרכב: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Car className="w-8 h-8 text-primary" />
          פרסם רכב למכירה
        </h1>
        <p className="text-muted-foreground">
          מלא את הפרטים למטה ופרסם רכב למכירה באתר
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
          <h2 className="text-xl font-bold text-foreground mb-4">פרטי הרכב</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturer">יצרן *</Label>
                <Select
                  value={formData.manufacturer}
                  onValueChange={handleManufacturerChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר יצרן" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {manufacturers.map((manufacturer) => (
                      <SelectItem key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">דגם הרכב *</Label>
                {isCustomModel ? (
                  <div className="flex gap-2">
                    <Input
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      placeholder="הזן שם דגם"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setIsCustomModel(false);
                        setFormData({ ...formData, model: "" });
                      }}
                      title="חזור לרשימה"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Select
                    value={formData.model}
                    onValueChange={handleModelChange}
                    disabled={!formData.manufacturer}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.manufacturer ? "בחר דגם" : "בחר יצרן קודם"} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {availableModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                      {formData.manufacturer && (
                        <SelectItem value="__custom__" className="text-primary font-medium border-t mt-1 pt-2">
                          אחר - הזנה ידנית
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">שנת ייצור *</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  placeholder="2020"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuel_type">סוג דלק *</Label>
                <Select
                  value={formData.fuel_type}
                  onValueChange={(value) => setFormData({ ...formData, fuel_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג דלק" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="בנזין">בנזין</SelectItem>
                    <SelectItem value="דיזל">דיזל</SelectItem>
                    <SelectItem value="היבריד">היבריד</SelectItem>
                    <SelectItem value="חשמלי">חשמלי</SelectItem>
                    <SelectItem value="היבריד פלאג-אין">היבריד פלאג-אין</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transmission">תיבת הילוכים *</Label>
                <Select
                  value={formData.transmission}
                  onValueChange={(value) => setFormData({ ...formData, transmission: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר תיבה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="אוטומט">אוטומט</SelectItem>
                    <SelectItem value="ידני">ידני</SelectItem>
                    <SelectItem value="רובוטרון">רובוטרון</SelectItem>
                    <SelectItem value="טיפטרוניק">טיפטרוניק</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="km">קילומטראז' *</Label>
                <Input
                  id="km"
                  name="km"
                  type="number"
                  value={formData.km}
                  onChange={handleInputChange}
                  required
                  placeholder="50000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hand">יד *</Label>
                <Select
                  value={formData.hand}
                  onValueChange={(value) => setFormData({ ...formData, hand: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר יד" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">יד ראשונה</SelectItem>
                    <SelectItem value="1">יד שנייה</SelectItem>
                    <SelectItem value="2">יד שלישית</SelectItem>
                    <SelectItem value="3">יד רביעית</SelectItem>
                    <SelectItem value="4">יד חמישית ומעלה</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle_type">סוג רכב *</Label>
                <Select
                  value={formData.vehicle_type}
                  onValueChange={(value) => setFormData({ ...formData, vehicle_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג רכב" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="רכב פרטי">רכב פרטי</SelectItem>
                    <SelectItem value="רכב מסחרי">רכב מסחרי</SelectItem>
                    <SelectItem value="משאית">משאית</SelectItem>
                    <SelectItem value="אופנוע">אופנוע</SelectItem>
                    <SelectItem value="קטנוע">קטנוע</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">מצב הרכב *</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData({ ...formData, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר מצב" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="רכב חדש">רכב חדש</SelectItem>
                    <SelectItem value="רכב משומש">רכב משומש</SelectItem>
                    <SelectItem value="במצב מצוין">במצב מצוין</SelectItem>
                    <SelectItem value="במצב טוב">במצב טוב</SelectItem>
                    <SelectItem value="דרוש תיקונים">דרוש תיקונים</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">קטגוריה</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="אופנועים חדשים">אופנועים חדשים</SelectItem>
                    <SelectItem value="אופנועים משומשים">אופנועים משומשים</SelectItem>
                    <SelectItem value="אביזרים - גלגלים וחישוקים">אביזרים - גלגלים וחישוקים</SelectItem>
                    <SelectItem value="אביזרים - מערכות שמע">אביזרים - מערכות שמע</SelectItem>
                    <SelectItem value="אביזרים - אביזרי קישוט">אביזרים - אביזרי קישוט</SelectItem>
                    <SelectItem value="אביזרים - ציוד בטיחות">אביזרים - ציוד בטיחות</SelectItem>
                    <SelectItem value="שירותים - מוסכים">שירותים - מוסכים</SelectItem>
                    <SelectItem value="שירותים - מכוני שירות">שירותים - מכוני שירות</SelectItem>
                    <SelectItem value="שירותים - גרירה">שירותים - גרירה</SelectItem>
                    <SelectItem value="שירותים - ביטוח רכב">שירותים - ביטוח רכב</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">מחיר *</Label>
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handlePriceChange}
                  required
                  placeholder="150,000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">מיקום *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="תל אביב"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">תיאור הרכב *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="תאר את הרכב, מצבו, היסטוריית שירות וכל פרט רלוונטי אחר..."
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">פרטי המוכר</h2>
          <div className="space-y-4">
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
                <Label htmlFor="seller_phone">טלפון ליצירת קשר *</Label>
                <Input
                  id="seller_phone"
                  name="seller_phone"
                  value={formData.seller_phone}
                  onChange={handleInputChange}
                  required
                  placeholder="0501234567"
                  type="tel"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">אבזור ותוספות</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {carFeatures.map((feature) => (
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
            {loading ? "מפרסם..." : "פרסם רכב"}
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

export default PostCar;
