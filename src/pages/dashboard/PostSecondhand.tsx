import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

const secondhandSchema = z.object({
  title: z.string().trim().min(3, "כותרת חייבת להכיל לפחות 3 תווים").max(200, "כותרת ארוכה מדי"),
  category: z.string().min(1, "קטגוריה חובה"),
  condition: z.string().min(1, "מצב המוצר חובה"),
  price: z.number().int().min(1, "מחיר חובה").max(1000000, "מחיר גבוה מדי"),
  location: z.string().trim().min(2, "מיקום חובה"),
  description: z.string().trim().min(20, "תיאור חייב להכיל לפחות 20 תווים").max(10000, "תיאור ארוך מדי"),
});

const categories = {
  "ריהוט": ["ספות וכורסאות", "שולחנות", "כיסאות", "ארונות", "מיטות"],
  "מוצרי חשמל": ["מקררים", "מכונות כביסה", "תנורים", "מיקרוגלים", "מזגנים"],
  "ספורט ופנאי": ["אופניים", "ציוד כושר", "משחקים", "ספרים", "כלי נגינה"],
  "אופנה": ["בגדים", "נעליים", "תיקים", "אביזרים", "תכשיטים"],
  "תינוקות וילדים": ["עגלות", "כיסאות אוכל", "מיטות", "צעצועים", "בגדי ילדים"],
};

const PostSecondhand = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    condition: "",
    price: "",
    location: "",
    brand: "",
    size: "",
    color: "",
    material: "",
    age: "",
    description: "",
  });

  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value, subcategory: "" });
    setAvailableSubcategories(categories[value as keyof typeof categories] || []);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("עליך להתחבר כדי לפרסם מוצר");
      navigate("/auth");
      return;
    }

    try {
      secondhandSchema.parse({
        title: formData.title,
        category: formData.category,
        condition: formData.condition,
        price: parseInt(formData.price),
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
      const { error } = await supabase.from("secondhand_items").insert({
        user_id: user.id,
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory || null,
        condition: formData.condition,
        price: parseInt(formData.price),
        location: formData.location,
        brand: formData.brand || null,
        size: formData.size || null,
        color: formData.color || null,
        material: formData.material || null,
        age: formData.age || null,
        description: formData.description,
        status: "active",
      });

      if (error) throw error;

      toast.success("המוצר פורסם בהצלחה!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error posting secondhand item:", error);
      toast.error("שגיאה בפרסום המוצר: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderDynamicFields = () => {
    const { category, subcategory } = formData;

    // Fields for furniture
    if (category === "ריהוט") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="material">חומר</Label>
            <Input
              id="material"
              name="material"
              value={formData.material}
              onChange={handleInputChange}
              placeholder="עץ מלא, מתכת, פלסטיק..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">צבע</Label>
            <Input
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="חום, לבן, שחור..."
            />
          </div>
        </>
      );
    }

    // Fields for electronics
    if (category === "מוצרי חשמל") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="brand">מותג</Label>
            <Input
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="Samsung, LG, Bosch..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">גיל המוצר (שנים)</Label>
            <Input
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="2"
            />
          </div>
        </>
      );
    }

    // Fields for sports
    if (category === "ספורט ופנאי") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="brand">מותג</Label>
            <Input
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="Nike, Adidas, Giant..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="size">גודל</Label>
            <Input
              id="size"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              placeholder="M, L, 26 אינץ'..."
            />
          </div>
        </>
      );
    }

    // Fields for fashion
    if (category === "אופנה") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="brand">מותג</Label>
            <Input
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="Zara, H&M, Nike..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="size">מידה</Label>
            <Input
              id="size"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              placeholder="S, M, L, XL, 42..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">צבע</Label>
            <Input
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="שחור, לבן, כחול..."
            />
          </div>
        </>
      );
    }

    // Fields for baby items
    if (category === "תינוקות וילדים") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="brand">מותג</Label>
            <Input
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="Bugaboo, Maxi-Cosi..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">גיל מומלץ</Label>
            <Input
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="0-3 חודשים, 2-5 שנים..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">צבע</Label>
            <Input
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="ורוד, כחול, צבעוני..."
            />
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Package className="w-8 h-8 text-primary" />
          פרסם מוצר יד שנייה
        </h1>
        <p className="text-muted-foreground">
          מלא את הפרטים למטה ופרסם מוצר יד שנייה באתר
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">פרטי המוצר</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">כותרת המודעה *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="ספה תלת מושבית במצב מעולה"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">קטגוריה *</Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(categories).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {availableSubcategories.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="subcategory">תת-קטגוריה</Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) =>
                      setFormData({ ...formData, subcategory: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר תת-קטגוריה" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubcategories.map((subcat) => (
                        <SelectItem key={subcat} value={subcat}>
                          {subcat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderDynamicFields()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">מצב המוצר *</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) =>
                    setFormData({ ...formData, condition: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר מצב" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="חדש באריזה">חדש באריזה</SelectItem>
                    <SelectItem value="כמו חדש">כמו חדש</SelectItem>
                    <SelectItem value="במצב מצוין">במצב מצוין</SelectItem>
                    <SelectItem value="במצב טוב">במצב טוב</SelectItem>
                    <SelectItem value="במצב סביר">במצב סביר</SelectItem>
                    <SelectItem value="לשיפוץ">לשיפוץ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">מחיר (₪) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="500"
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
              <Label htmlFor="description">תיאור המוצר *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="תאר את המוצר, מצבו, סיבת המכירה וכל פרט רלוונטי אחר..."
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
            {loading ? "מפרסם..." : "פרסם מוצר"}
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

export default PostSecondhand;
