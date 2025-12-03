import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Package } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { ImageUpload } from "@/components/ImageUpload";

const secondhandSchema = z.object({
  title: z.string().trim().min(3, "כותרת חייבת להכיל לפחות 3 תווים").max(200, "כותרת ארוכה מדי"),
  category: z.string().min(1, "קטגוריה חובה"),
  condition: z.string().min(1, "מצב המוצר חובה"),
  price: z.number().int().min(1, "מחיר חובה").max(1000000, "מחיר גבוה מדי"),
  location: z.string().trim().min(2, "מיקום חובה"),
  description: z.string().trim().min(20, "תיאור חייב להכיל לפחות 20 תווים").max(10000, "תיאור ארוך מדי"),
  seller_name: z.string().trim().min(2, "שם מוכר חובה"),
  seller_phone: z.string().trim().regex(/^05\d{8}$/, "מספר טלפון לא תקין (צריך להיות 05XXXXXXXX)"),
});

const categories = {
  "ריהוט": [
    "ספות", "כורסאות", "שולחנות אוכל", "שולחנות סלון", "כיסאות",
    "ארונות בגדים", "ארונות נעליים", "מיטות זוגיות", "מיטות יחיד",
    "שידות", "מדפים", "מראות", "ארונות מטבח", "שולחנות עבודה"
  ],
  "מוצרי חשמל": [
    "מקררים", "מקפיאים", "מכונות כביסה", "מייבשי כביסה",
    "תנורים", "כיריים", "מיקרוגל", "מזגנים", "מאווררים",
    "מדיחי כלים", "שואבי אבק", "מערכות סטריאו", "טלוויזיות"
  ],
  "ספורט ופנאי": [
    "אופני כביש", "אופני הרים", "אופניים חשמליים", "קורקינטים",
    "ציוד כושר ביתי", "משקולות", "הליכונים", "אופני כושר",
    "משחקי קופסא", "משחקי וידאו", "ספרים", "גיטרות", "פסנתרים", "תופים"
  ],
  "אופנה": [
    "חולצות", "מכנסיים", "שמלות", "חצאיות", "מעילים",
    "נעלי ספורט", "נעלי עקב", "סנדלים", "מגפיים",
    "תיקי יד", "תיקי גב", "שעונים", "תכשיטים", "משקפי שמש"
  ],
  "תינוקות וילדים": [
    "עגלות", "טיולונים", "כיסאות אוכל", "מיטות תינוק", "עריסות",
    "צעצועי התפתחות", "משחקי בנייה", "בגדי תינוקות (0-2)",
    "בגדי ילדים (2-6)", "בגדי ילדים (6-12)", "אביזרי האכלה", "מוצצים ובקבוקים"
  ]
};

const furnitureMaterials = ["עץ מלא", "עץ MDF", "מתכת", "פלסטיק", "זכוכית", "עור", "בד", "ראטן", "שילוב"];
const furnitureSizes = ["קטן", "בינוני", "גדול", "ענק", "חד-מושבי", "דו-מושבי", "תלת-מושבי", "ארבע-מושבי"];
const electronicsBrands = ["Samsung", "LG", "Bosch", "Siemens", "Electrolux", "Whirlpool", "Haier", "Beko", "Candy", "Ariston"];
const sportsBrands = ["Nike", "Adidas", "Puma", "Giant", "Trek", "Specialized", "Decathlon", "Reebok", "Under Armour"];
const fashionBrands = ["Zara", "H&M", "Mango", "Castro", "Fox", "TNT", "Golf", "American Eagle", "Banana Republic"];
const fashionSizes = ["XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
const babySizes = ["0-6 חודשים", "6-12 חודשים", "1-2 שנים", "2-4 שנים", "4-6 שנים", "6-8 שנים", "8-12 שנים"];
const colors = ["לבן", "שחור", "אפור", "חום", "בז'", "כחול", "ירוק", "אדום", "ורוד", "סגול", "צהוב", "כתום", "כסוף", "זהב", "צבעוני"];

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
    warranty: "",
    delivery_available: false,
    negotiable: true,
    year_manufactured: "",
    dimensions: "",
    weight: "",
    seller_name: "",
    seller_phone: "",
  });

  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value, subcategory: "" });
    setAvailableSubcategories(categories[value as keyof typeof categories] || []);
  };

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
        images: imageUrls,
        warranty: formData.warranty || null,
        delivery_available: formData.delivery_available,
        negotiable: formData.negotiable,
        year_manufactured: formData.year_manufactured ? parseInt(formData.year_manufactured) : null,
        dimensions: formData.dimensions || null,
        weight: formData.weight || null,
        seller_name: formData.seller_name,
        seller_phone: formData.seller_phone,
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

  const renderCategorySpecificFields = () => {
    const { category } = formData;

    // Furniture fields
    if (category === "ריהוט") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="material">חומר *</Label>
            <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר חומר" />
              </SelectTrigger>
              <SelectContent>
                {furnitureMaterials.map(mat => (
                  <SelectItem key={mat} value={mat}>{mat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="size">גודל *</Label>
            <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר גודל" />
              </SelectTrigger>
              <SelectContent>
                {furnitureSizes.map(size => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">צבע</Label>
            <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר צבע" />
              </SelectTrigger>
              <SelectContent>
                {colors.map(color => (
                  <SelectItem key={color} value={color}>{color}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dimensions">מידות (אורך x רוחב x גובה ס"מ)</Label>
            <Input
              id="dimensions"
              name="dimensions"
              value={formData.dimensions}
              onChange={handleInputChange}
              placeholder='לדוגמה: 200x100x80'
            />
          </div>
        </>
      );
    }

    // Electronics fields
    if (category === "מוצרי חשמל") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="brand">מותג *</Label>
            <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר מותג" />
              </SelectTrigger>
              <SelectContent>
                {electronicsBrands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
                <SelectItem value="אחר">אחר</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="year_manufactured">שנת ייצור</Label>
            <Input
              id="year_manufactured"
              name="year_manufactured"
              type="number"
              value={formData.year_manufactured}
              onChange={handleInputChange}
              placeholder="2020"
              min="1990"
              max={new Date().getFullYear()}
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
          <div className="space-y-2">
            <Label htmlFor="warranty">אחריות</Label>
            <Input
              id="warranty"
              name="warranty"
              value={formData.warranty}
              onChange={handleInputChange}
              placeholder="אחריות יבואן רשמי, 6 חודשים..."
            />
          </div>
        </>
      );
    }

    // Sports fields
    if (category === "ספורט ופנאי") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="brand">מותג</Label>
            <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר מותג" />
              </SelectTrigger>
              <SelectContent>
                {sportsBrands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
                <SelectItem value="אחר">אחר</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="size">גודל/מידה</Label>
            <Input
              id="size"
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              placeholder='M, L, 26", 27.5"...'
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">צבע</Label>
            <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר צבע" />
              </SelectTrigger>
              <SelectContent>
                {colors.map(color => (
                  <SelectItem key={color} value={color}>{color}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">משקל</Label>
            <Input
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="10 ק״ג"
            />
          </div>
        </>
      );
    }

    // Fashion fields
    if (category === "אופנה") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="brand">מותג</Label>
            <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר מותג" />
              </SelectTrigger>
              <SelectContent>
                {fashionBrands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
                <SelectItem value="אחר">אחר</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="size">מידה *</Label>
            <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר מידה" />
              </SelectTrigger>
              <SelectContent>
                {fashionSizes.map(size => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">צבע *</Label>
            <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר צבע" />
              </SelectTrigger>
              <SelectContent>
                {colors.map(color => (
                  <SelectItem key={color} value={color}>{color}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      );
    }

    // Baby items fields
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
              placeholder="Bugaboo, Maxi-Cosi, Chicco..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">גיל מומלץ *</Label>
            <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר גיל" />
              </SelectTrigger>
              <SelectContent>
                {babySizes.map(age => (
                  <SelectItem key={age} value={age}>{age}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">צבע</Label>
            <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר צבע" />
              </SelectTrigger>
              <SelectContent>
                {colors.map(color => (
                  <SelectItem key={color} value={color}>{color}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          מלא את הפרטים למטה ופרסם מוצר יד שנייה באתר - ככל שתוסיף פרטים מדויקים יותר, כך יהיה קל יותר למצוא את המוצר
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Images */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">תמונות * (עד 8 תמונות)</h2>
          <p className="text-sm text-muted-foreground mb-4">העלה תמונות ברורות ואיכותיות של המוצר מזוויות שונות</p>
          <ImageUpload
            onImagesChange={setImageUrls}
            maxImages={8}
            existingImages={imageUrls}
          />
        </Card>

        {/* Product Details */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">פרטי המוצר</h2>
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">כותרת המודעה *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="לדוגמה: ספה תלת מושבית במצב מעולה"
                maxLength={200}
              />
            </div>

            {/* Category & Subcategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">קטגוריה *</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(categories).map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {availableSubcategories.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="subcategory">תת-קטגוריה *</Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר תת-קטגוריה" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubcategories.map((subcat) => (
                        <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Category-specific fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderCategorySpecificFields()}
            </div>

            {/* Condition & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">מצב המוצר *</Label>
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
                  min="1"
                  max="1000000"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">עיר *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="תל אביב, חיפה, ירושלים..."
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">תיאור המוצר *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="תאר את המוצר בפירוט - מצב, תכונות מיוחדות, סיבת המכירה, היסטוריית השימוש וכל פרט נוסף שחשוב למוכר לדעת..."
                maxLength={10000}
              />
              <p className="text-xs text-muted-foreground">{formData.description.length}/10000 תווים</p>
            </div>

            {/* Additional Options */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-foreground">אפשרויות נוספות</h3>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="delivery_available"
                  checked={formData.delivery_available}
                  onCheckedChange={(checked) => setFormData({ ...formData, delivery_available: checked as boolean })}
                />
                <Label htmlFor="delivery_available" className="cursor-pointer">
                  אני מוכן למשלוח (בתשלום)
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="negotiable"
                  checked={formData.negotiable}
                  onCheckedChange={(checked) => setFormData({ ...formData, negotiable: checked as boolean })}
                />
                <Label htmlFor="negotiable" className="cursor-pointer">
                  המחיר ניתן למיקוח
                </Label>
              </div>
            </div>
          </div>
        </Card>

        {/* Seller Details */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">פרטי המוכר</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seller_name">שם מלא *</Label>
              <Input
                id="seller_name"
                name="seller_name"
                value={formData.seller_name}
                onChange={handleInputChange}
                required
                placeholder="שם פרטי ומשפחה"
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
                placeholder="05XXXXXXXX"
                maxLength={10}
              />
            </div>
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
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
