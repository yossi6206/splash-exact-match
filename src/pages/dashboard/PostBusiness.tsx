import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { ImageUpload } from "@/components/ImageUpload";

const businessSchema = z.object({
  title: z.string().trim().min(3, "כותרת חייבת להכיל לפחות 3 תווים").max(200, "כותרת ארוכה מדי"),
  business_type: z.string().min(1, "סוג עסק חובה"),
  category: z.string().min(1, "קטגוריה חובה"),
  price: z.number().int().min(1, "מחיר חובה").max(1000000000, "מחיר גבוה מדי"),
  location: z.string().trim().min(2, "מיקום חובה"),
  description: z.string().trim().min(20, "תיאור חייב להכיל לפחות 20 תווים").max(10000, "תיאור ארוך מדי"),
  seller_name: z.string().trim().min(2, "שם מוכר חובה"),
  seller_phone: z.string().trim().regex(/^05\d{8}$/, "מספר טלפון לא תקין (צריך להיות 05XXXXXXXX)"),
});

const PostBusiness = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    business_type: "",
    category: "",
    price: "",
    location: "",
    description: "",
    annual_revenue: "",
    monthly_profit: "",
    years_operating: "",
    employees_count: "",
    lease_monthly_cost: "",
    lease_expiry_date: "",
    lease_details: "",
    reasons_for_sale: "",
    seller_name: "",
    seller_phone: "",
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [includesItems, setIncludesItems] = useState<string[]>([]);
  const [newIncludeItem, setNewIncludeItem] = useState("");

  const businessCategories = [
    "מסעדות ובתי קפה",
    "קמעונאות וסחר",
    "שירותים",
    "טכנולוגיה",
    "חינוך והדרכה",
    "בריאות ויופי",
    "ייצור ותעשייה",
    "נדל\"ן",
    "תיירות ואירוח",
    "אחר"
  ];

  const businessTypes = [
    "בעלות מלאה",
    "שותפות",
    "זיכיון",
    "סניף",
    "עסק מקוון",
    "עסק פיזי",
    "היברידי"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Validate location and seller_name - only letters (Hebrew/English), spaces, and hyphens allowed
    if (name === "location" || name === "seller_name") {
      if (value && !/^[\u0590-\u05FFa-zA-Z\s\-׳']+$/.test(value)) {
        const fieldNames: Record<string, string> = {
          location: "מיקום",
          seller_name: "שם המוכר"
        };
        toast.error(`בשדה ${fieldNames[name]} ניתן להזין רק אותיות`);
        return;
      }
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addIncludeItem = () => {
    if (newIncludeItem.trim()) {
      setIncludesItems([...includesItems, newIncludeItem.trim()]);
      setNewIncludeItem("");
    }
  };

  const removeIncludeItem = (index: number) => {
    setIncludesItems(includesItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("עליך להתחבר כדי לפרסם עסק");
      navigate("/auth");
      return;
    }

    try {
      businessSchema.parse({
        title: formData.title,
        business_type: formData.business_type,
        category: formData.category,
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
      const { error } = await supabase.from("businesses").insert({
        user_id: user.id,
        title: formData.title,
        business_type: formData.business_type,
        category: formData.category,
        price: parseInt(formData.price),
        location: formData.location,
        description: formData.description,
        annual_revenue: formData.annual_revenue ? parseInt(formData.annual_revenue) : null,
        monthly_profit: formData.monthly_profit ? parseInt(formData.monthly_profit) : null,
        years_operating: formData.years_operating ? parseInt(formData.years_operating) : null,
        employees_count: formData.employees_count ? parseInt(formData.employees_count) : null,
        lease_monthly_cost: formData.lease_monthly_cost ? parseInt(formData.lease_monthly_cost) : null,
        lease_expiry_date: formData.lease_expiry_date || null,
        lease_details: formData.lease_details || null,
        reasons_for_sale: formData.reasons_for_sale || null,
        includes: includesItems.length > 0 ? includesItems : null,
        images: imageUrls,
        seller_name: formData.seller_name,
        seller_phone: formData.seller_phone,
        status: "active",
      });

      if (error) throw error;

      toast.success("העסק פורסם בהצלחה!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error posting business:", error);
      toast.error("שגיאה בפרסום העסק: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Building2 className="w-8 h-8 text-primary" />
          פרסם עסק למכירה
        </h1>
        <p className="text-muted-foreground">
          מלא את הפרטים למטה ופרסם עסק למכירה באתר
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">תמונות *</h2>
          <p className="text-sm text-muted-foreground mb-4">
            העלה תמונות של העסק, החלל, המוצרים והציוד
          </p>
          <ImageUpload
            onImagesChange={setImageUrls}
            maxImages={10}
            existingImages={imageUrls}
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">פרטים כלליים</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">כותרת המודעה *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="מסעדה משפחתית מצליחה בלב העיר"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business_type">סוג עסק *</Label>
                <Select
                  value={formData.business_type}
                  onValueChange={(value) => setFormData({ ...formData, business_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג עסק" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">קטגוריה *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">מחיר מבוקש (₪) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="500000"
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
                  placeholder="תל אביב - יפו"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">תיאור העסק *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="תאר את העסק, הפעילות, בסיס הלקוחות, הפוטנציאל וכל פרט רלוונטי אחר..."
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">נתונים פיננסיים</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="annual_revenue">מחזור שנתי (₪)</Label>
              <Input
                id="annual_revenue"
                name="annual_revenue"
                type="number"
                value={formData.annual_revenue}
                onChange={handleInputChange}
                placeholder="1200000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly_profit">רווח חודשי ממוצע (₪)</Label>
              <Input
                id="monthly_profit"
                name="monthly_profit"
                type="number"
                value={formData.monthly_profit}
                onChange={handleInputChange}
                placeholder="30000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years_operating">שנות פעילות</Label>
              <Input
                id="years_operating"
                name="years_operating"
                type="number"
                value={formData.years_operating}
                onChange={handleInputChange}
                placeholder="5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employees_count">מספר עובדים</Label>
              <Input
                id="employees_count"
                name="employees_count"
                type="number"
                value={formData.employees_count}
                onChange={handleInputChange}
                placeholder="8"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">פרטי שכירות</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lease_monthly_cost">עלות שכירות חודשית (₪)</Label>
                <Input
                  id="lease_monthly_cost"
                  name="lease_monthly_cost"
                  type="number"
                  value={formData.lease_monthly_cost}
                  onChange={handleInputChange}
                  placeholder="15000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lease_expiry_date">תוקף חוזה שכירות</Label>
                <Input
                  id="lease_expiry_date"
                  name="lease_expiry_date"
                  value={formData.lease_expiry_date}
                  onChange={handleInputChange}
                  placeholder="עד 12/2028"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lease_details">פרטים נוספים על השכירות</Label>
              <Textarea
                id="lease_details"
                name="lease_details"
                value={formData.lease_details}
                onChange={handleInputChange}
                rows={3}
                placeholder="חוזה שכירות ל-5 שנים נוספות, אופציה להארכה, מיקום מעולה..."
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">מה כלול במכירה</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newIncludeItem}
                onChange={(e) => setNewIncludeItem(e.target.value)}
                placeholder="לדוגמה: ציוד מטבח מקצועי"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIncludeItem())}
              />
              <Button type="button" onClick={addIncludeItem} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {includesItems.length > 0 && (
              <div className="space-y-2">
                {includesItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span>{item}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIncludeItem(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">סיבות למכירה</h2>
          <div className="space-y-2">
            <Label htmlFor="reasons_for_sale">מדוע אתה מוכר את העסק?</Label>
            <Textarea
              id="reasons_for_sale"
              name="reasons_for_sale"
              value={formData.reasons_for_sale}
              onChange={handleInputChange}
              rows={4}
              placeholder="מעבר לחו״ל, פרישה, רוצה להתמקד בעסק אחר..."
            />
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

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? "מפרסם..." : "פרסם עסק"}
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

export default PostBusiness;
