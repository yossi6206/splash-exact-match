import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Laptop } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { ImageUpload } from "@/components/ImageUpload";
import { createValidatedChangeHandler, laptopValidationConfig } from "@/utils/formValidation";

const laptopSchema = z.object({
  brand: z.string().trim().min(2, "יצרן חייב להכיל לפחות 2 תווים").max(100, "יצרן ארוך מדי"),
  model: z.string().trim().min(2, "דגם חייב להכיל לפחות 2 תווים").max(200, "דגם ארוך מדי"),
  condition: z.string().min(1, "מצב המחשב חובה"),
  price: z.number().int().min(1, "מחיר חובה").max(100000, "מחיר גבוה מדי"),
  location: z.string().trim().min(2, "מיקום חובה"),
  description: z.string().trim().min(20, "תיאור חייב להכיל לפחות 20 תווים").max(10000, "תיאור ארוך מדי"),
  seller_name: z.string().trim().min(2, "שם מוכר חובה"),
  seller_phone: z.string().trim().regex(/^05\d{8}$/, "מספר טלפון לא תקין (צריך להיות 05XXXXXXXX)"),
});

const PostLaptop = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    processor: "",
    ram: "",
    storage: "",
    storage_type: "",
    screen_size: "",
    graphics_card: "",
    resolution: "",
    operating_system: "",
    weight: "",
    battery: "",
    connectivity: "",
    ports: "",
    condition: "",
    price: "",
    location: "",
    description: "",
    seller_name: "",
    seller_phone: "",
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const laptopFeatures = [
    "מסך מגע",
    "תאורת מקלדת",
    "מצלמת אינטרנט",
    "Bluetooth",
    "Wi-Fi 6",
    "USB-C",
    "HDMI",
    "חיישן טביעת אצבע",
    "גרפיקה ייעודית",
    "מעבד Intel",
    "מעבד AMD",
    "כונן SSD",
    "כונן HDD",
    "מקלדת נומרית",
    "רמקולים איכותיים",
  ];

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const handleInputChange = createValidatedChangeHandler(setFormData, formData, laptopValidationConfig);

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
      toast.error("עליך להתחבר כדי לפרסם מחשב");
      navigate("/auth");
      return;
    }

    try {
      laptopSchema.parse({
        brand: formData.brand,
        model: formData.model,
        condition: formData.condition,
        price: parseInt(formData.price),
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
      const { error } = await supabase.from("laptops").insert({
        user_id: user.id,
        brand: formData.brand,
        model: formData.model,
        processor: formData.processor || null,
        ram: formData.ram ? parseInt(formData.ram) : null,
        storage: formData.storage ? parseInt(formData.storage) : null,
        storage_type: formData.storage_type || null,
        screen_size: formData.screen_size ? parseFloat(formData.screen_size) : null,
        graphics_card: formData.graphics_card || null,
        resolution: formData.resolution || null,
        operating_system: formData.operating_system || null,
        weight: formData.weight || null,
        battery: formData.battery || null,
        connectivity: formData.connectivity || null,
        ports: formData.ports || null,
        condition: formData.condition,
        price: parseInt(formData.price),
        location: formData.location,
        description: formData.description,
        seller_name: formData.seller_name,
        seller_phone: formData.seller_phone,
        features: selectedFeatures,
        images: imageUrls,
        status: "active",
      });

      if (error) throw error;

      toast.success("המחשב פורסם בהצלחה!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error posting laptop:", error);
      toast.error("שגיאה בפרסום המחשב: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Laptop className="w-8 h-8 text-primary" />
          פרסם מחשב נייד למכירה
        </h1>
        <p className="text-muted-foreground">
          מלא את הפרטים למטה ופרסם מחשב נייד באתר
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
          <h2 className="text-xl font-bold text-foreground mb-4">פרטי המחשב</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">יצרן *</Label>
                <Select
                  value={formData.brand}
                  onValueChange={(value) => setFormData({ ...formData, brand: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר יצרן" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dell">Dell</SelectItem>
                    <SelectItem value="HP">HP</SelectItem>
                    <SelectItem value="Lenovo">Lenovo</SelectItem>
                    <SelectItem value="Apple">Apple</SelectItem>
                    <SelectItem value="Asus">Asus</SelectItem>
                    <SelectItem value="Acer">Acer</SelectItem>
                    <SelectItem value="MSI">MSI</SelectItem>
                    <SelectItem value="Microsoft">Microsoft</SelectItem>
                    <SelectItem value="אחר">אחר</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">דגם *</Label>
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                  placeholder="ThinkPad X1 Carbon"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="processor">מעבד</Label>
                <Input
                  id="processor"
                  name="processor"
                  value={formData.processor}
                  onChange={handleInputChange}
                  placeholder="Intel Core i7-12700H"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ram">זיכרון RAM (GB)</Label>
                <Select
                  value={formData.ram}
                  onValueChange={(value) => setFormData({ ...formData, ram: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר זיכרון" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 GB</SelectItem>
                    <SelectItem value="8">8 GB</SelectItem>
                    <SelectItem value="16">16 GB</SelectItem>
                    <SelectItem value="32">32 GB</SelectItem>
                    <SelectItem value="64">64 GB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storage">נפח אחסון (GB)</Label>
                <Input
                  id="storage"
                  name="storage"
                  type="number"
                  value={formData.storage}
                  onChange={handleInputChange}
                  placeholder="512"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storage_type">סוג אחסון</Label>
                <Select
                  value={formData.storage_type}
                  onValueChange={(value) => setFormData({ ...formData, storage_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SSD">SSD</SelectItem>
                    <SelectItem value="HDD">HDD</SelectItem>
                    <SelectItem value="SSD + HDD">SSD + HDD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="screen_size">גודל מסך (אינץ')</Label>
                <Select
                  value={formData.screen_size}
                  onValueChange={(value) => setFormData({ ...formData, screen_size: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר גודל" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="13.3">13.3"</SelectItem>
                    <SelectItem value="14">14"</SelectItem>
                    <SelectItem value="15.6">15.6"</SelectItem>
                    <SelectItem value="17.3">17.3"</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="graphics_card">כרטיס גרפי</Label>
                <Input
                  id="graphics_card"
                  name="graphics_card"
                  value={formData.graphics_card}
                  onChange={handleInputChange}
                  placeholder="NVIDIA RTX 3060"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resolution">רזולוציה</Label>
                <Input
                  id="resolution"
                  name="resolution"
                  value={formData.resolution}
                  onChange={handleInputChange}
                  placeholder="1920 x 1080"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operating_system">מערכת הפעלה</Label>
                <Input
                  id="operating_system"
                  name="operating_system"
                  value={formData.operating_system}
                  onChange={handleInputChange}
                  placeholder="Windows 11 Pro"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">משקל</Label>
                <Input
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="1.5 ק״ג"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="battery">סוללה</Label>
                <Input
                  id="battery"
                  name="battery"
                  value={formData.battery}
                  onChange={handleInputChange}
                  placeholder="עד 10 שעות"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="connectivity">תקשורת</Label>
                <Input
                  id="connectivity"
                  name="connectivity"
                  value={formData.connectivity}
                  onChange={handleInputChange}
                  placeholder="Wi-Fi 6, Bluetooth 5.0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ports">יציאות</Label>
              <Input
                id="ports"
                name="ports"
                value={formData.ports}
                onChange={handleInputChange}
                placeholder="2x USB-C, 2x USB 3.0, HDMI"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">מצב המחשב *</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => setFormData({ ...formData, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר מצב" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="חדש באריזה">חדש באריזה</SelectItem>
                    <SelectItem value="כמו חדש">כמו חדש</SelectItem>
                    <SelectItem value="משומש במצב מצוין">משומש במצב מצוין</SelectItem>
                    <SelectItem value="משומש במצב טוב">משומש במצב טוב</SelectItem>
                    <SelectItem value="משומש">משומש</SelectItem>
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
                  placeholder="5000"
                />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">תיאור המחשב *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="תאר את המחשב, מצבו, אחריות, אביזרים נלווים וכל פרט רלוונטי אחר..."
              />
            </div>

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
                <Label htmlFor="seller_phone">טלפון *</Label>
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
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">תכונות נוספות</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {laptopFeatures.map((feature) => (
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
            {loading ? "מפרסם..." : "פרסם מחשב"}
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

export default PostLaptop;
