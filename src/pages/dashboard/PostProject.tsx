import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Building } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { ImageUpload } from "@/components/ImageUpload";
import { createValidatedChangeHandler, parsePriceToNumber } from "@/utils/formValidation";

const projectSchema = z.object({
  title: z.string().trim().min(5, "שם הפרויקט חייב להכיל לפחות 5 תווים"),
  developer_name: z.string().trim().min(2, "שם היזם/קבלן חובה"),
  location: z.string().trim().min(2, "עיר/אזור חובה"),
  project_type: z.string().min(1, "סוג פרויקט חובה"),
  listing_type: z.string().min(1, "סוג עסקה חובה"),
  description: z.string().trim().min(20, "תיאור חייב להכיל לפחות 20 תווים").max(10000, "תיאור ארוך מדי"),
  contact_name: z.string().trim().min(2, "שם איש קשר חובה"),
  contact_phone: z.string().trim().regex(/^05\d{8}$/, "מספר טלפון לא תקין (צריך להיות 05XXXXXXXX)"),
});

const projectValidationConfig = {
  developer_name: "letters" as const,
  location: "letters" as const,
  neighborhood: "letters" as const,
  contact_name: "letters" as const,
  contact_phone: "phone" as const,
};

const PostProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    developer_name: "",
    location: "",
    neighborhood: "",
    project_type: "מגורים",
    listing_type: "מכירה",
    min_price: "",
    max_price: "",
    min_rooms: "",
    max_rooms: "",
    total_units: "",
    available_units: "",
    floors_count: "",
    buildings_count: "",
    delivery_date: "",
    description: "",
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    website_url: "",
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [parkingIncluded, setParkingIncluded] = useState(false);
  const [storageIncluded, setStorageIncluded] = useState(false);
  
  const projectFeatures = [
    "לובי מפואר",
    "קונסיירז׳",
    "בית חכם",
    "תקן ירוק",
    "נוף לים",
    "נוף להרים",
    "גישה לרכבת",
    "גימור יוקרתי",
    "תקרות גבוהות",
    "מרפסות גדולות",
    "עיצוב מודרני",
  ];

  const projectAmenities = [
    "בריכה",
    "חדר כושר",
    "ספא",
    "גן משחקים",
    "גינה קהילתית",
    "מועדון דיירים",
    "חניון תת קרקעי",
    "אבטחה 24/7",
    "שבילי אופניים",
    "פארק",
  ];

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const handleInputChange = createValidatedChangeHandler(setFormData, formData, projectValidationConfig);
  
  const handlePriceChange = (fieldName: 'min_price' | 'max_price') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setFormData(prev => ({ ...prev, [fieldName]: formatted }));
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("עליך להתחבר כדי לפרסם פרויקט");
      navigate("/auth");
      return;
    }

    try {
      projectSchema.parse({
        title: formData.title,
        developer_name: formData.developer_name,
        location: formData.location,
        project_type: formData.project_type,
        listing_type: formData.listing_type,
        description: formData.description,
        contact_name: formData.contact_name,
        contact_phone: formData.contact_phone,
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
      const { error } = await supabase.from("projects").insert({
        user_id: user.id,
        title: formData.title,
        developer_name: formData.developer_name,
        location: formData.location,
        neighborhood: formData.neighborhood || null,
        project_type: formData.project_type,
        listing_type: formData.listing_type,
        min_price: formData.min_price ? parsePriceToNumber(formData.min_price) : null,
        max_price: formData.max_price ? parsePriceToNumber(formData.max_price) : null,
        min_rooms: formData.min_rooms ? parseFloat(formData.min_rooms) : null,
        max_rooms: formData.max_rooms ? parseFloat(formData.max_rooms) : null,
        total_units: formData.total_units ? parseInt(formData.total_units) : null,
        available_units: formData.available_units ? parseInt(formData.available_units) : null,
        floors_count: formData.floors_count ? parseInt(formData.floors_count) : null,
        buildings_count: formData.buildings_count ? parseInt(formData.buildings_count) : null,
        delivery_date: formData.delivery_date || null,
        description: formData.description,
        images: imageUrls,
        features: selectedFeatures,
        amenities: selectedAmenities,
        parking_included: parkingIncluded,
        storage_included: storageIncluded,
        contact_name: formData.contact_name,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email || null,
        website_url: formData.website_url || null,
        status: "active",
      });

      if (error) throw error;

      toast.success("הפרויקט פורסם בהצלחה!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error posting project:", error);
      toast.error("שגיאה בפרסום הפרויקט: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Building className="w-8 h-8 text-primary" />
          פרסם פרויקט חדש
        </h1>
        <p className="text-muted-foreground">
          פרסם פרויקט בנייה חדש מקבלן או יזם
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">תמונות הפרויקט *</h2>
          <ImageUpload
            onImagesChange={setImageUrls}
            maxImages={10}
            existingImages={imageUrls}
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">פרטי הפרויקט</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">שם הפרויקט *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="פארק תל אביב"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="developer_name">שם היזם / קבלן *</Label>
                <Input
                  id="developer_name"
                  name="developer_name"
                  value={formData.developer_name}
                  onChange={handleInputChange}
                  required
                  placeholder="אזורים"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project_type">סוג פרויקט *</Label>
                <Select
                  value={formData.project_type}
                  onValueChange={(value) => setFormData({ ...formData, project_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג פרויקט" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="מגורים">מגורים</SelectItem>
                    <SelectItem value="מסחרי">מסחרי</SelectItem>
                    <SelectItem value="משרדים">משרדים</SelectItem>
                    <SelectItem value="מעורב">מעורב (מגורים + מסחרי)</SelectItem>
                    <SelectItem value="תעשייה">תעשייה</SelectItem>
                    <SelectItem value="מעונות סטודנטים">מעונות סטודנטים</SelectItem>
                    <SelectItem value="דיור מוגן">דיור מוגן</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="listing_type">סוג עסקה *</Label>
                <Select
                  value={formData.listing_type}
                  onValueChange={(value) => setFormData({ ...formData, listing_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג עסקה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="מכירה">מכירה</SelectItem>
                    <SelectItem value="השכרה">השכרה</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">עיר *</Label>
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
                <Label htmlFor="neighborhood">שכונה</Label>
                <Input
                  id="neighborhood"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  placeholder="פארק הירקון"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_price">מחיר מינימום (₪)</Label>
                <Input
                  id="min_price"
                  name="min_price"
                  value={formData.min_price}
                  onChange={handlePriceChange('min_price')}
                  placeholder="2,500,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_price">מחיר מקסימום (₪)</Label>
                <Input
                  id="max_price"
                  name="max_price"
                  value={formData.max_price}
                  onChange={handlePriceChange('max_price')}
                  placeholder="5,500,000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_rooms">חדרים מ-</Label>
                <Input
                  id="min_rooms"
                  name="min_rooms"
                  type="number"
                  step="0.5"
                  value={formData.min_rooms}
                  onChange={handleInputChange}
                  placeholder="3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_rooms">חדרים עד</Label>
                <Input
                  id="max_rooms"
                  name="max_rooms"
                  type="number"
                  step="0.5"
                  value={formData.max_rooms}
                  onChange={handleInputChange}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_units">סה"כ יחידות</Label>
                <Input
                  id="total_units"
                  name="total_units"
                  type="number"
                  value={formData.total_units}
                  onChange={handleInputChange}
                  placeholder="200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="available_units">יחידות פנויות</Label>
                <Input
                  id="available_units"
                  name="available_units"
                  type="number"
                  value={formData.available_units}
                  onChange={handleInputChange}
                  placeholder="45"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buildings_count">מספר בניינים</Label>
                <Input
                  id="buildings_count"
                  name="buildings_count"
                  type="number"
                  value={formData.buildings_count}
                  onChange={handleInputChange}
                  placeholder="3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floors_count">מספר קומות</Label>
                <Input
                  id="floors_count"
                  name="floors_count"
                  type="number"
                  value={formData.floors_count}
                  onChange={handleInputChange}
                  placeholder="25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery_date">מועד אכלוס משוער</Label>
                <Input
                  id="delivery_date"
                  name="delivery_date"
                  value={formData.delivery_date}
                  onChange={handleInputChange}
                  placeholder="Q4 2025"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">תיאור הפרויקט *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="תאר את הפרויקט, המיקום, הייחודיות, סוגי הדירות וכל פרט רלוונטי אחר..."
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">כלול בדירה</h2>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="parking"
                checked={parkingIncluded}
                onCheckedChange={(checked) => setParkingIncluded(!!checked)}
              />
              <Label htmlFor="parking" className="cursor-pointer">חניה</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="storage"
                checked={storageIncluded}
                onCheckedChange={(checked) => setStorageIncluded(!!checked)}
              />
              <Label htmlFor="storage" className="cursor-pointer">מחסן</Label>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">מאפייני הפרויקט</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {projectFeatures.map((feature) => (
              <div key={feature} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={feature}
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={() => handleFeatureToggle(feature)}
                />
                <Label htmlFor={feature} className="text-sm font-normal cursor-pointer">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">מתקנים ושירותים</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {projectAmenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={amenity}
                  checked={selectedAmenities.includes(amenity)}
                  onCheckedChange={() => handleAmenityToggle(amenity)}
                />
                <Label htmlFor={amenity} className="text-sm font-normal cursor-pointer">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">פרטי איש קשר</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_name">שם איש קשר *</Label>
                <Input
                  id="contact_name"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleInputChange}
                  required
                  placeholder="שם מלא"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">טלפון נייד *</Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  required
                  placeholder="0501234567"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email">אימייל</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  placeholder="example@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_url">אתר הפרויקט</Label>
                <Input
                  id="website_url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleInputChange}
                  placeholder="https://project-website.co.il"
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? "מפרסם..." : "פרסם פרויקט"}
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

export default PostProject;