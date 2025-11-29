import { useState } from "react";
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

const carSchema = z.object({
  model: z.string().trim().min(2, "דגם חייב להכיל לפחות 2 תווים").max(200, "דגם ארוך מדי"),
  year: z.number().int().min(1900, "שנה לא תקינה").max(new Date().getFullYear() + 1, "שנה לא תקינה"),
  km: z.number().int().min(0, "קילומטראז' לא יכול להיות שלילי").max(5000000, "קילומטראז' גבוה מדי"),
  hand: z.number().int().min(0, "יד לא יכולה להיות שלילית").max(20, "יד גבוהה מדי"),
  price: z.string().trim().min(1, "מחיר חובה"),
  location: z.string().trim().min(2, "מיקום חובה"),
  description: z.string().trim().min(20, "תיאור חייב להכיל לפחות 20 תווים").max(10000, "תיאור ארוך מדי"),
});

const PostCar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    model: "",
    year: "",
    km: "",
    hand: "",
    price: "",
    location: "",
    description: "",
  });

  const [features, setFeatures] = useState<string[]>([""]);
  
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

    try {
      carSchema.parse({
        model: formData.model,
        year: parseInt(formData.year),
        km: parseInt(formData.km),
        hand: parseInt(formData.hand),
        price: formData.price,
        location: formData.location,
        description: formData.description,
      });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        toast.error(validationError.errors[0].message);
        return;
      }
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("cars").insert({
        user_id: user.id,
        model: formData.model,
        year: parseInt(formData.year),
        km: parseInt(formData.km),
        hand: parseInt(formData.hand),
        price: formData.price,
        location: formData.location,
        description: formData.description,
        features: selectedFeatures,
        status: "active",
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
          <h2 className="text-xl font-bold text-foreground mb-4">פרטי הרכב</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="model">דגם הרכב *</Label>
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                  placeholder="טויוטה קורולה"
                />
              </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">מחיר *</Label>
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="150,000 ₪"
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
