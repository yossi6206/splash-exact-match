import { useState, useEffect } from "react";
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
import { createValidatedChangeHandler, secondhandValidationConfig, createPriceChangeHandler, parsePriceToNumber } from "@/utils/formValidation";
import { getPhoneManufacturers, getModelsForPhoneManufacturer } from "@/data/phoneManufacturersModels";
import { getComputerManufacturers, getModelsForComputerManufacturer } from "@/data/computerManufacturersModels";
import { SearchableSelect } from "@/components/ui/searchable-select";

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
  "מחשבים": [
    "מחשבים ניידים", "מחשבים נייחים", "מחשבי גיימינג", "מחשבים לעבודה",
    "מקבוק", "אולטרה בוק", "טאבלטים", "מסכים", "מקלדות", "עכברים",
    "אוזניות", "כרטיסי מסך", "מעבדים", "זיכרון RAM", "כוננים", "לוחות אם"
  ],
  "מכשירים סלולריים": [
    "אייפון", "סמסונג גלקסי", "שיאומי", "וואווי", "אופו", "וואן פלוס",
    "גוגל פיקסל", "נוקיה", "מוטורולה", "שעונים חכמים", "אוזניות אלחוטיות",
    "מטענים", "כיסויים", "מגני מסך", "סוללות חיצוניות"
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

// Furniture subcategory-specific options
const sofaTypes = ["ספה ישרה", "ספת פינה", "ספה נפתחת", "ספת פוף", "ספת עור", "ספה מודולרית"];
const sofaUpholstery = ["בד", "עור אמיתי", "עור סינטטי", "קטיפה", "פשתן", "מיקרופייבר"];
const sofaSeating = ["דו-מושבית", "תלת-מושבית", "ארבע-מושבית", "פינתית L", "פינתית U"];
const sofaFeatures = ["נפתחת למיטה", "עם ארגז מצעים", "רגליים מתכת", "רגליים עץ", "ריקליינר"];

const bedTypes = ["מיטה זוגית", "מיטה וחצי", "מיטת יחיד", "מיטת קומותיים", "מיטה מתכווננת"];
const bedSizes = ["90x190", "120x190", "140x190", "160x200", "180x200", "200x200"];
const mattressTypes = ["קפיצים", "ספוג", "לטקס", "מזרן כיס", "מזרן זיכרון", "ללא מזרן"];
const bedFeatures = ["עם ארגז מצעים", "עם מסגרת", "ראש מיטה מרופד", "ראש מיטה עץ", "בסיס עם רגליים"];

const tableTypes = ["שולחן אוכל", "שולחן סלון", "שולחן עבודה", "שולחן כתיבה", "שולחן צד"];
const tableShapes = ["מלבני", "עגול", "אובלי", "ריבועי", "לא סימטרי"];
const tableSeating = ["2 סועדים", "4 סועדים", "6 סועדים", "8 סועדים", "10+ סועדים", "נפתח"];

const chairTypes = ["כיסא אוכל", "כיסא משרדי", "כיסא גיימינג", "כיסא בר", "כיסא נדנדה", "שרפרף"];
const chairFeatures = ["עם ידיות", "מרופד", "מתכוונן גובה", "גלגלים", "ארגונומי"];

const closetTypes = ["ארון הזזה", "ארון דלתות", "ארון פינתי", "קומודה", "ארון נעליים"];
const closetDoors = ["דלת אחת", "2 דלתות", "3 דלתות", "4 דלתות", "5+ דלתות"];
const closetFeatures = ["עם מראה", "עם תאורה פנימית", "מגירות", "מדפים", "תליה כפולה"];
const electronicsBrands = ["Samsung", "LG", "Bosch", "Siemens", "Electrolux", "Whirlpool", "Haier", "Beko", "Candy", "Ariston"];

// Electronics subcategory-specific options
const fridgeTypes = ["מקרר דו-דלתי", "מקרר חד-דלתי", "מקרר צד בצד (Side by Side)", "מקרר פרנצ׳ דור", "מקרר משולב מקפיא עליון", "מקרר משולב מקפיא תחתון", "מקרר מיני"];
const fridgeSizes = ["עד 300 ליטר", "300-400 ליטר", "400-500 ליטר", "500-600 ליטר", "מעל 600 ליטר"];
const fridgeFeatures = ["No Frost", "מתקן מים", "מתקן קרח", "אזור טריות", "דלת בתוך דלת", "חיסכוני A+++"];

const washerTypes = ["מכונת כביסה פתח קדמי", "מכונת כביסה פתח עליון", "מכונה משולבת כביסה-ייבוש", "מכונת כביסה תעשייתית"];
const washerCapacity = ["5 ק״ג", "6 ק״ג", "7 ק״ג", "8 ק״ג", "9 ק״ג", "10 ק״ג", "12 ק״ג", "מעל 12 ק״ג"];
const washerFeatures = ["אינוורטר", "מנוע ישיר", "הוספת כביסה באמצע", "Wi-Fi", "קיטור", "חיסכוני A+++"];
const washerSpin = ["800 סל״ד", "1000 סל״ד", "1200 סל״ד", "1400 סל״ד", "1600 סל״ד"];

const dryerTypes = ["מייבש קונדנסור", "מייבש משאבת חום", "מייבש פליטה"];
const dryerCapacity = ["7 ק״ג", "8 ק״ג", "9 ק״ג", "10 ק״ג"];

const ovenTypes = ["תנור בנוי", "תנור משולב כיריים", "תנור טורבו", "תנור משולב מיקרוגל", "תנור אדים"];
const ovenFeatures = ["פירוליטי (ניקוי עצמי)", "טורבו", "גריל", "תכניות אפייה", "Wi-Fi"];

const acTypes = ["מזגן עילי", "מזגן מרכזי", "מזגן מיני מרכזי", "מזגן נייד", "מפוצל (ספליט)"];
const acCapacity = ["9,000 BTU", "12,000 BTU", "18,000 BTU", "24,000 BTU", "מעל 24,000 BTU"];
const acFeatures = ["אינוורטר", "Wi-Fi", "סינון אוויר", "חימום", "שקט במיוחד"];

const tvTypes = ["LED", "OLED", "QLED", "LCD", "פלזמה"];
const tvSizes = ["32 אינץ׳", "40 אינץ׳", "43 אינץ׳", "50 אינץ׳", "55 אינץ׳", "65 אינץ׳", "75 אינץ׳", "מעל 75 אינץ׳"];
const tvFeatures = ["Smart TV", "4K", "8K", "HDR", "120Hz", "Gaming Mode"];

const dishwasherTypes = ["מדיח כלים רחב", "מדיח כלים צר", "מדיח כלים שולחני"];
const dishwasherCapacity = ["9 מערכות", "12 מערכות", "14 מערכות", "מעל 14 מערכות"];

const vacuumTypes = ["שואב אבק רובוטי", "שואב אבק אלחוטי", "שואב אבק עם שקית", "שואב אבק ללא שקית", "שואב אבק מים"];
const sportsBrands = ["Nike", "Adidas", "Puma", "Giant", "Trek", "Specialized", "Decathlon", "Reebok", "Under Armour"];

// Sports subcategory-specific options
const bikeBrands = ["Giant", "Trek", "Specialized", "Cannondale", "Scott", "Merida", "BMC", "Cube", "אחר"];
const bikeTypes = ["אופני כביש", "אופני הרים", "אופניים היברידיים", "אופני עיר", "אופני BMX", "אופני ילדים"];
const bikeSizes = ["XS (14-15\")", "S (15-17\")", "M (17-19\")", "L (19-21\")", "XL (21-23\")", "גלגל 20\"", "גלגל 24\"", "גלגל 26\"", "גלגל 27.5\"", "גלגל 29\""];
const bikeFeatures = ["מתלים קדמיים", "מתלים מלאים", "בלמי דיסק", "חשמלי", "קרבון", "אלומיניום"];

const eBikeBrands = ["Bosch", "Shimano Steps", "Bafang", "Yamaha", "Kalkhoff", "Cube", "אחר"];
const eBikeBattery = ["250Wh", "400Wh", "500Wh", "625Wh", "750Wh", "מעל 750Wh"];
const eBikeRange = ["עד 50 ק״מ", "50-80 ק״מ", "80-120 ק״מ", "מעל 120 ק״מ"];

const scooterTypes = ["קורקינט חשמלי", "קורקינט רגיל", "קורקינט ספורט"];
const scooterSpeed = ["עד 25 קמ״ש", "25-35 קמ״ש", "מעל 35 קמ״ש"];

const gymEquipTypes = ["הליכון", "אופני כושר", "אליפטיקל", "חתירה", "מכונת משקולות", "ספסל אימון", "משקולות חופשיות"];
const gymBrands = ["Life Fitness", "Technogym", "NordicTrack", "Bowflex", "Kettler", "Horizon", "אחר"];

const instrumentTypes = ["גיטרה אקוסטית", "גיטרה חשמלית", "גיטרה בס", "פסנתר אקוסטי", "פסנתר חשמלי", "קלידים", "תופים אקוסטיים", "תופים חשמליים", "כינור", "חליל", "סקסופון"];
const instrumentBrands = ["Yamaha", "Fender", "Gibson", "Roland", "Casio", "Ibanez", "Pearl", "אחר"];
const instrumentConditions = ["חדש", "כמו חדש", "משומש - מצב מעולה", "משומש - מצב טוב", "דורש תיקון"];

const fashionBrands = ["Zara", "H&M", "Mango", "Castro", "Fox", "TNT", "Golf", "American Eagle", "Banana Republic"];
const fashionSizes = ["XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

// Fashion subcategory-specific options
const clothingConditions = ["חדש עם תווית", "חדש ללא תווית", "לבוש פעם אחת", "משומש - מצב מעולה", "משומש - מצב טוב"];
const shirtTypes = ["חולצת טי", "חולצה מכופתרת", "פולו", "סווטשירט", "קפוצ׳ון", "גופיה"];
const pantsTypes = ["ג׳ינס", "מכנסי בד", "מכנסי ספורט", "מכנסיים קצרים", "לגינס"];
const dressTypes = ["שמלת ערב", "שמלת קז׳ואל", "שמלת מקסי", "שמלת מיני", "שמלת מידי"];
const coatTypes = ["מעיל חורף", "ג׳קט", "מעיל גשם", "מעיל קל", "בלייזר", "וסט"];

const shoeBrands = ["Nike", "Adidas", "New Balance", "Puma", "Converse", "Vans", "Dr. Martens", "Steve Madden", "אחר"];
const shoeSizes = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];
const shoeTypes = ["נעלי ספורט", "נעלי עקב", "סנדלים", "מגפיים", "נעלי בלט", "נעלי אוקספורד", "כפכפים", "נעלי עבודה"];

const bagTypes = ["תיק יד", "תיק צד", "תיק גב", "ארנק", "תיק מסמכים", "תיק ערב"];
const bagBrands = ["Michael Kors", "Coach", "Guess", "Longchamp", "Kipling", "Samsonite", "אחר"];
const bagMaterials = ["עור אמיתי", "עור סינטטי", "בד", "ניילון", "קנבס"];

const jewelryTypes = ["שרשרת", "צמיד", "טבעת", "עגילים", "שעון", "סיכה"];
const jewelryMaterials = ["זהב", "כסף", "פלטינה", "נירוסטה", "ציפוי זהב", "תכשיט אופנה"];

const babySizes = ["0-6 חודשים", "6-12 חודשים", "1-2 שנים", "2-4 שנים", "4-6 שנים", "6-8 שנים", "8-12 שנים"];

// Baby subcategory-specific options
const strollerBrands = ["Bugaboo", "Maxi-Cosi", "Chicco", "Baby Jogger", "UPPAbaby", "Cybex", "Britax", "אחר"];
const strollerTypes = ["עגלת תינוק פול סייז", "טיולון", "עגלה כפולה", "עגלת רוץ", "עגלה קלה"];
const strollerFeatures = ["מתקפל ביד אחת", "ידית הפיכה", "גלגלים גדולים", "סלקל", "קל משקל"];

const cribTypes = ["מיטת תינוק", "עריסה", "מיטת מעבר", "מיטה ניידת", "לול"];
const cribSizes = ["120x60 ס״מ", "140x70 ס״מ", "160x80 ס״מ"];
const cribFeatures = ["מגן ראש", "מזרן כלול", "גלגלים", "מתכווננת גובה", "ארגז אחסון"];

const carSeatTypes = ["סלקל (0-13 ק״ג)", "כיסא בטיחות (9-18 ק״ג)", "בוסטר (15-36 ק״ג)", "כיסא משולב"];
const carSeatBrands = ["Maxi-Cosi", "Cybex", "Britax", "Chicco", "Joie", "Nuna", "אחר"];
const carSeatFeatures = ["איזופיקס", "מסתובב 360", "מונע שכחה", "מתכוונן"];

const highChairTypes = ["כיסא אוכל קלאסי", "כיסא אוכל מודולרי", "בוסטר לכיסא", "כיסא מתקפל"];
const feedingBrands = ["Stokke", "Chicco", "Inglesina", "BabyBjörn", "IKEA", "אחר"];

const toyAgeGroups = ["0-6 חודשים", "6-12 חודשים", "1-2 שנים", "2-3 שנים", "3-5 שנים", "5+ שנים"];
const toyTypes = ["צעצועי התפתחות", "משחקי בנייה", "בובות", "משחקי תפקידים", "משחקי חוץ", "משחקי קופסא"];
const toyBrands = ["Fisher-Price", "LEGO", "Playmobil", "Melissa & Doug", "VTech", "אחר"];
const colors = ["לבן", "שחור", "אפור", "חום", "בז'", "כחול", "ירוק", "אדום", "ורוד", "סגול", "צהוב", "כתום", "כסוף", "זהב", "צבעוני"];

// Computer options
const processors = ["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "Apple M1", "Apple M2", "Apple M3", "אחר"];
const ramOptions = ["4GB", "8GB", "16GB", "32GB", "64GB"];
const storageOptions = ["128GB", "256GB", "512GB", "1TB", "2TB"];
const storageTypes = ["SSD", "HDD", "SSD + HDD"];
const screenSizes = ["11.6\"", "13.3\"", "14\"", "15.6\"", "16\"", "17.3\"", "24\"", "27\"", "32\""];

// Phone storage options
const phoneStorageOptions = ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"];
const phoneConditions = ["חדש באריזה", "כמו חדש", "מצב מעולה", "מצב טוב", "מצב סביר", "לחלקי חילוף"];

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
  const [availablePhoneModels, setAvailablePhoneModels] = useState<string[]>([]);
  const [showCustomPhoneModel, setShowCustomPhoneModel] = useState(false);
  const [availableComputerModels, setAvailableComputerModels] = useState<string[]>([]);
  const [showCustomComputerModel, setShowCustomComputerModel] = useState(false);

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value, subcategory: "", brand: "", size: "" });
    setAvailableSubcategories(categories[value as keyof typeof categories] || []);
    setAvailablePhoneModels([]);
    setShowCustomPhoneModel(false);
    setAvailableComputerModels([]);
    setShowCustomComputerModel(false);
  };

  const handlePhoneBrandChange = (value: string) => {
    setFormData({ ...formData, brand: value, size: "" });
    const models = getModelsForPhoneManufacturer(value);
    setAvailablePhoneModels(models);
    setShowCustomPhoneModel(false);
  };

  const handlePhoneModelChange = (value: string) => {
    if (value === "אחר - הזנה ידנית") {
      setShowCustomPhoneModel(true);
      setFormData({ ...formData, size: "" });
    } else {
      setShowCustomPhoneModel(false);
      setFormData({ ...formData, size: value });
    }
  };

  const handleComputerBrandChange = (value: string) => {
    setFormData({ ...formData, brand: value, size: "" });
    const models = getModelsForComputerManufacturer(value);
    setAvailableComputerModels(models);
    setShowCustomComputerModel(false);
  };

  const handleComputerModelChange = (value: string) => {
    if (value === "אחר - הזנה ידנית") {
      setShowCustomComputerModel(true);
      setFormData({ ...formData, size: "" });
    } else {
      setShowCustomComputerModel(false);
      setFormData({ ...formData, size: value });
    }
  };

  const handleInputChange = createValidatedChangeHandler(setFormData, formData, secondhandValidationConfig);

  const handlePriceChange = createPriceChangeHandler(setFormData, formData);

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
        price: parsePriceToNumber(formData.price),
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
        price: parsePriceToNumber(formData.price),
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

    // Furniture fields - with subcategory-specific fields
    if (category === "ריהוט") {
      const { subcategory } = formData;
      
      // Sofas specific fields
      if (subcategory === "ספות" || subcategory === "כורסאות") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="brand">סוג</Label>
              <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {sofaTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="material">חומר ריפוד *</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר חומר ריפוד" />
                </SelectTrigger>
                <SelectContent>
                  {sofaUpholstery.map(mat => (
                    <SelectItem key={mat} value={mat}>{mat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">מספר מושבים</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מספר מושבים" />
                </SelectTrigger>
                <SelectContent>
                  {sofaSeating.map(seat => (
                    <SelectItem key={seat} value={seat}>{seat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">תכונות נוספות</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר תכונה" />
                </SelectTrigger>
                <SelectContent>
                  {sofaFeatures.map(feat => (
                    <SelectItem key={feat} value={feat}>{feat}</SelectItem>
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
      
      // Beds specific fields
      if (subcategory === "מיטות זוגיות" || subcategory === "מיטות יחיד") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="brand">סוג מיטה</Label>
              <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג מיטה" />
                </SelectTrigger>
                <SelectContent>
                  {bedTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">מידת מיטה</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מידה" />
                </SelectTrigger>
                <SelectContent>
                  {bedSizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="material">סוג מזרן</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג מזרן" />
                </SelectTrigger>
                <SelectContent>
                  {mattressTypes.map(mat => (
                    <SelectItem key={mat} value={mat}>{mat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">תכונות נוספות</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר תכונה" />
                </SelectTrigger>
                <SelectContent>
                  {bedFeatures.map(feat => (
                    <SelectItem key={feat} value={feat}>{feat}</SelectItem>
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
      
      // Tables specific fields
      if (subcategory === "שולחנות אוכל" || subcategory === "שולחנות סלון" || subcategory === "שולחנות עבודה") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="brand">סוג שולחן</Label>
              <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג שולחן" />
                </SelectTrigger>
                <SelectContent>
                  {tableTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">צורה</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר צורה" />
                </SelectTrigger>
                <SelectContent>
                  {tableShapes.map(shape => (
                    <SelectItem key={shape} value={shape}>{shape}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(subcategory === "שולחנות אוכל") && (
              <div className="space-y-2">
                <Label htmlFor="size">מספר סועדים</Label>
                <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר מספר סועדים" />
                  </SelectTrigger>
                  <SelectContent>
                    {tableSeating.map(seat => (
                      <SelectItem key={seat} value={seat}>{seat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
                placeholder='לדוגמה: 160x90x75'
              />
            </div>
          </>
        );
      }
      
      // Chairs specific fields
      if (subcategory === "כיסאות") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="brand">סוג כיסא</Label>
              <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג כיסא" />
                </SelectTrigger>
                <SelectContent>
                  {chairTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">תכונות</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר תכונה" />
                </SelectTrigger>
                <SelectContent>
                  {chairFeatures.map(feat => (
                    <SelectItem key={feat} value={feat}>{feat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              <Label htmlFor="size">כמות</Label>
              <Input
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                placeholder='מספר כיסאות'
              />
            </div>
          </>
        );
      }
      
      // Closets specific fields
      if (subcategory === "ארונות בגדים" || subcategory === "ארונות נעליים" || subcategory === "ארונות מטבח") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="brand">סוג ארון</Label>
              <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג ארון" />
                </SelectTrigger>
                <SelectContent>
                  {closetTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">מספר דלתות</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מספר דלתות" />
                </SelectTrigger>
                <SelectContent>
                  {closetDoors.map(doors => (
                    <SelectItem key={doors} value={doors}>{doors}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">תכונות נוספות</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר תכונה" />
                </SelectTrigger>
                <SelectContent>
                  {closetFeatures.map(feat => (
                    <SelectItem key={feat} value={feat}>{feat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              <Label htmlFor="dimensions">מידות (רוחב x עומק x גובה ס"מ)</Label>
              <Input
                id="dimensions"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                placeholder='לדוגמה: 180x60x220'
              />
            </div>
          </>
        );
      }
      
      // Default furniture fields (for shelves, mirrors, etc.)
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
            <Label htmlFor="size">גודל</Label>
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

    // Electronics fields - with subcategory-specific fields
    if (category === "מוצרי חשמל") {
      const { subcategory } = formData;
      
      // Common brand field for all electronics
      const brandField = (
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
      );
      
      const commonFields = (
        <>
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
            <Label htmlFor="warranty">אחריות</Label>
            <Input
              id="warranty"
              name="warranty"
              value={formData.warranty}
              onChange={handleInputChange}
              placeholder="אחריות יבואן רשמי, 6 חודשים..."
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
        </>
      );
      
      // Refrigerators
      if (subcategory === "מקררים" || subcategory === "מקפיאים") {
        return (
          <>
            {brandField}
            <div className="space-y-2">
              <Label htmlFor="material">סוג מקרר</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {fridgeTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">נפח</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר נפח" />
                </SelectTrigger>
                <SelectContent>
                  {fridgeSizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">תכונות</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר תכונה" />
                </SelectTrigger>
                <SelectContent>
                  {fridgeFeatures.map(feat => (
                    <SelectItem key={feat} value={feat}>{feat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {commonFields}
          </>
        );
      }
      
      // Washing machines
      if (subcategory === "מכונות כביסה") {
        return (
          <>
            {brandField}
            <div className="space-y-2">
              <Label htmlFor="material">סוג מכונה</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {washerTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">קיבולת</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר קיבולת" />
                </SelectTrigger>
                <SelectContent>
                  {washerCapacity.map(cap => (
                    <SelectItem key={cap} value={cap}>{cap}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dimensions">מהירות סחיטה</Label>
              <Select value={formData.dimensions} onValueChange={(value) => setFormData({ ...formData, dimensions: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מהירות" />
                </SelectTrigger>
                <SelectContent>
                  {washerSpin.map(spin => (
                    <SelectItem key={spin} value={spin}>{spin}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">תכונות</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר תכונה" />
                </SelectTrigger>
                <SelectContent>
                  {washerFeatures.map(feat => (
                    <SelectItem key={feat} value={feat}>{feat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {commonFields}
          </>
        );
      }
      
      // Dryers
      if (subcategory === "מייבשי כביסה") {
        return (
          <>
            {brandField}
            <div className="space-y-2">
              <Label htmlFor="material">סוג מייבש</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {dryerTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">קיבולת</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר קיבולת" />
                </SelectTrigger>
                <SelectContent>
                  {dryerCapacity.map(cap => (
                    <SelectItem key={cap} value={cap}>{cap}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {commonFields}
          </>
        );
      }
      
      // Ovens
      if (subcategory === "תנורים" || subcategory === "כיריים" || subcategory === "מיקרוגל") {
        return (
          <>
            {brandField}
            <div className="space-y-2">
              <Label htmlFor="material">סוג תנור</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {ovenTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">תכונות</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר תכונה" />
                </SelectTrigger>
                <SelectContent>
                  {ovenFeatures.map(feat => (
                    <SelectItem key={feat} value={feat}>{feat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {commonFields}
          </>
        );
      }
      
      // Air conditioners
      if (subcategory === "מזגנים" || subcategory === "מאווררים") {
        return (
          <>
            {brandField}
            <div className="space-y-2">
              <Label htmlFor="material">סוג מזגן</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {acTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">הספק (BTU)</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר הספק" />
                </SelectTrigger>
                <SelectContent>
                  {acCapacity.map(cap => (
                    <SelectItem key={cap} value={cap}>{cap}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">תכונות</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר תכונה" />
                </SelectTrigger>
                <SelectContent>
                  {acFeatures.map(feat => (
                    <SelectItem key={feat} value={feat}>{feat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {commonFields}
          </>
        );
      }
      
      // TVs
      if (subcategory === "טלוויזיות" || subcategory === "מערכות סטריאו") {
        return (
          <>
            {brandField}
            <div className="space-y-2">
              <Label htmlFor="material">סוג מסך</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {tvTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">גודל מסך</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר גודל" />
                </SelectTrigger>
                <SelectContent>
                  {tvSizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">תכונות</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר תכונה" />
                </SelectTrigger>
                <SelectContent>
                  {tvFeatures.map(feat => (
                    <SelectItem key={feat} value={feat}>{feat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {commonFields}
          </>
        );
      }
      
      // Dishwashers
      if (subcategory === "מדיחי כלים") {
        return (
          <>
            {brandField}
            <div className="space-y-2">
              <Label htmlFor="material">סוג מדיח</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {dishwasherTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">קיבולת</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר קיבולת" />
                </SelectTrigger>
                <SelectContent>
                  {dishwasherCapacity.map(cap => (
                    <SelectItem key={cap} value={cap}>{cap}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {commonFields}
          </>
        );
      }
      
      // Vacuum cleaners
      if (subcategory === "שואבי אבק") {
        return (
          <>
            {brandField}
            <div className="space-y-2">
              <Label htmlFor="material">סוג שואב</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {vacuumTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {commonFields}
          </>
        );
      }
      
      // Default electronics fields
      return (
        <>
          {brandField}
          {commonFields}
        </>
      );
    }

    // Sports fields - with subcategory-specific fields
    if (category === "ספורט ופנאי") {
      const { subcategory } = formData;
      
      // Bicycles
      if (subcategory === "אופני כביש" || subcategory === "אופני הרים") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="brand">מותג</Label>
              <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מותג" />
                </SelectTrigger>
                <SelectContent>
                  {bikeBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="material">סוג אופניים</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {bikeTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">מידה</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מידה" />
                </SelectTrigger>
                <SelectContent>
                  {bikeSizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">תכונות</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר תכונה" />
                </SelectTrigger>
                <SelectContent>
                  {bikeFeatures.map(feat => (
                    <SelectItem key={feat} value={feat}>{feat}</SelectItem>
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
      
      // Electric bikes
      if (subcategory === "אופניים חשמליים") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="brand">מותג מנוע</Label>
              <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מותג" />
                </SelectTrigger>
                <SelectContent>
                  {eBikeBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">קיבולת סוללה</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר קיבולת" />
                </SelectTrigger>
                <SelectContent>
                  {eBikeBattery.map(bat => (
                    <SelectItem key={bat} value={bat}>{bat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">טווח נסיעה</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר טווח" />
                </SelectTrigger>
                <SelectContent>
                  {eBikeRange.map(range => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
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
      
      // Scooters
      if (subcategory === "קורקינטים") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="material">סוג קורקינט</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {scooterTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">מהירות מקסימלית</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מהירות" />
                </SelectTrigger>
                <SelectContent>
                  {scooterSpeed.map(speed => (
                    <SelectItem key={speed} value={speed}>{speed}</SelectItem>
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
      
      // Gym equipment
      if (subcategory === "ציוד כושר ביתי" || subcategory === "משקולות" || subcategory === "הליכונים" || subcategory === "אופני כושר") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="material">סוג ציוד</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {gymEquipTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">מותג</Label>
              <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מותג" />
                </SelectTrigger>
                <SelectContent>
                  {gymBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
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
                placeholder="50 ק״ג"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dimensions">מידות (אורך x רוחב x גובה ס״מ)</Label>
              <Input
                id="dimensions"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                placeholder='לדוגמה: 180x80x140'
              />
            </div>
          </>
        );
      }
      
      // Musical instruments
      if (subcategory === "גיטרות" || subcategory === "פסנתרים" || subcategory === "תופים") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="material">סוג כלי</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {instrumentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">מותג</Label>
              <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מותג" />
                </SelectTrigger>
                <SelectContent>
                  {instrumentBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">מצב</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מצב" />
                </SelectTrigger>
                <SelectContent>
                  {instrumentConditions.map(cond => (
                    <SelectItem key={cond} value={cond}>{cond}</SelectItem>
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
      
      // Default sports fields
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
        </>
      );
    }

    // Fashion fields - with subcategory-specific fields
    if (category === "אופנה") {
      const { subcategory } = formData;
      
      // Clothing (shirts, pants, dresses, etc.)
      if (subcategory === "חולצות" || subcategory === "מכנסיים" || subcategory === "שמלות" || subcategory === "חצאיות" || subcategory === "מעילים") {
        const getTypeOptions = () => {
          if (subcategory === "חולצות") return shirtTypes;
          if (subcategory === "מכנסיים") return pantsTypes;
          if (subcategory === "שמלות") return dressTypes;
          if (subcategory === "מעילים") return coatTypes;
          return [];
        };
        
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
            {getTypeOptions().length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="material">סוג</Label>
                <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג" />
                  </SelectTrigger>
                  <SelectContent>
                    {getTypeOptions().map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
              <Label htmlFor="age">מצב</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מצב" />
                </SelectTrigger>
                <SelectContent>
                  {clothingConditions.map(cond => (
                    <SelectItem key={cond} value={cond}>{cond}</SelectItem>
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
      
      // Shoes
      if (subcategory === "נעלי ספורט" || subcategory === "נעלי עקב" || subcategory === "סנדלים" || subcategory === "מגפיים") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="brand">מותג</Label>
              <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מותג" />
                </SelectTrigger>
                <SelectContent>
                  {shoeBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="material">סוג נעליים</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {shoeTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
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
                  {shoeSizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">מצב</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מצב" />
                </SelectTrigger>
                <SelectContent>
                  {clothingConditions.map(cond => (
                    <SelectItem key={cond} value={cond}>{cond}</SelectItem>
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
      
      // Bags
      if (subcategory === "תיקי יד" || subcategory === "תיקי גב") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="brand">מותג</Label>
              <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מותג" />
                </SelectTrigger>
                <SelectContent>
                  {bagBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="material">סוג תיק</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {bagTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">חומר</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר חומר" />
                </SelectTrigger>
                <SelectContent>
                  {bagMaterials.map(mat => (
                    <SelectItem key={mat} value={mat}>{mat}</SelectItem>
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
      
      // Jewelry & Watches
      if (subcategory === "שעונים" || subcategory === "תכשיטים") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="material">סוג</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {jewelryTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">חומר</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר חומר" />
                </SelectTrigger>
                <SelectContent>
                  {jewelryMaterials.map(mat => (
                    <SelectItem key={mat} value={mat}>{mat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">מותג</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="מותג..."
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
          </>
        );
      }
      
      // Default fashion fields
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

    // Baby items fields - with subcategory-specific fields
    if (category === "תינוקות וילדים") {
      const { subcategory } = formData;
      
      // Strollers
      if (subcategory === "עגלות" || subcategory === "טיולונים") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="brand">מותג</Label>
              <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מותג" />
                </SelectTrigger>
                <SelectContent>
                  {strollerBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="material">סוג עגלה</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {strollerTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">תכונות</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר תכונה" />
                </SelectTrigger>
                <SelectContent>
                  {strollerFeatures.map(feat => (
                    <SelectItem key={feat} value={feat}>{feat}</SelectItem>
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
      
      // Cribs and beds
      if (subcategory === "מיטות תינוק" || subcategory === "עריסות") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="material">סוג</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {cribTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">מידה</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מידה" />
                </SelectTrigger>
                <SelectContent>
                  {cribSizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">תכונות</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר תכונה" />
                </SelectTrigger>
                <SelectContent>
                  {cribFeatures.map(feat => (
                    <SelectItem key={feat} value={feat}>{feat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">מותג</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="מותג..."
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
          </>
        );
      }
      
      // Car seats
      if (subcategory === "כיסאות אוכל") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="brand">מותג</Label>
              <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מותג" />
                </SelectTrigger>
                <SelectContent>
                  {feedingBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="material">סוג כיסא</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {highChairTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">גיל מומלץ</Label>
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
      
      // Toys
      if (subcategory === "צעצועי התפתחות" || subcategory === "משחקי בנייה") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="brand">מותג</Label>
              <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מותג" />
                </SelectTrigger>
                <SelectContent>
                  {toyBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="material">סוג צעצוע</Label>
              <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג" />
                </SelectTrigger>
                <SelectContent>
                  {toyTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">גיל מומלץ *</Label>
              <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר גיל" />
                </SelectTrigger>
                <SelectContent>
                  {toyAgeGroups.map(age => (
                    <SelectItem key={age} value={age}>{age}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );
      }
      
      // Baby clothes
      if (subcategory === "בגדי תינוקות (0-2)" || subcategory === "בגדי ילדים (2-6)" || subcategory === "בגדי ילדים (6-12)") {
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="brand">מותג</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Carter's, H&M Kids, Zara Kids..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">גיל/מידה *</Label>
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
              <Label htmlFor="size">מצב</Label>
              <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מצב" />
                </SelectTrigger>
                <SelectContent>
                  {clothingConditions.map(cond => (
                    <SelectItem key={cond} value={cond}>{cond}</SelectItem>
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
      
      // Default baby fields
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

    // Computer fields
    if (category === "מחשבים") {
      const computerManufacturers = getComputerManufacturers();
      
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="brand">יצרן *</Label>
            <SearchableSelect
              value={formData.brand}
              onValueChange={handleComputerBrandChange}
              options={[...computerManufacturers, "אחר"]}
              placeholder="בחר יצרן"
              searchPlaceholder="חפש יצרן..."
              emptyText="לא נמצאו יצרנים"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="size">דגם *</Label>
            {!showCustomComputerModel ? (
              formData.brand && formData.brand !== "אחר" ? (
                <div className="space-y-2">
                  <SearchableSelect
                    value={formData.size}
                    onValueChange={(value) => {
                      if (value === "אחר - הזנה ידנית") {
                        setShowCustomComputerModel(true);
                        setFormData({ ...formData, size: "" });
                      } else {
                        setFormData({ ...formData, size: value });
                      }
                    }}
                    options={[...availableComputerModels, "אחר - הזנה ידנית"]}
                    placeholder="בחר דגם"
                    searchPlaceholder="חפש דגם..."
                    emptyText="לא נמצאו דגמים"
                  />
                </div>
              ) : (
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר יצרן תחילה" />
                  </SelectTrigger>
                  <SelectContent />
                </Select>
              )
            ) : (
              <div className="space-y-2">
                <Input
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="הזן שם דגם"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCustomComputerModel(false);
                    setFormData({ ...formData, size: "" });
                  }}
                >
                  חזור לבחירה מרשימה
                </Button>
              </div>
            )}
            {formData.brand === "אחר" && (
              <Input
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                placeholder="הזן שם דגם"
                className="mt-2"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="material">מעבד</Label>
            <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר מעבד" />
              </SelectTrigger>
              <SelectContent>
                {processors.map(proc => (
                  <SelectItem key={proc} value={proc}>{proc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dimensions">זיכרון RAM</Label>
            <Select value={formData.dimensions} onValueChange={(value) => setFormData({ ...formData, dimensions: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר זיכרון" />
              </SelectTrigger>
              <SelectContent>
                {ramOptions.map(ram => (
                  <SelectItem key={ram} value={ram}>{ram}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">נפח אחסון</Label>
            <Select value={formData.weight} onValueChange={(value) => setFormData({ ...formData, weight: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר נפח" />
              </SelectTrigger>
              <SelectContent>
                {storageOptions.map(storage => (
                  <SelectItem key={storage} value={storage}>{storage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">גודל מסך</Label>
            <Select value={formData.age} onValueChange={(value) => setFormData({ ...formData, age: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר גודל מסך" />
              </SelectTrigger>
              <SelectContent>
                {screenSizes.map(size => (
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
        </>
      );
    }

    // Phone fields
    if (category === "מכשירים סלולריים") {
      const phoneManufacturers = getPhoneManufacturers();
      
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="brand">יצרן *</Label>
            <SearchableSelect
              value={formData.brand}
              onValueChange={handlePhoneBrandChange}
              options={[...phoneManufacturers, "אחר"]}
              placeholder="בחר יצרן"
              searchPlaceholder="חפש יצרן..."
              emptyText="לא נמצאו יצרנים"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="size">דגם *</Label>
            {!showCustomPhoneModel ? (
              formData.brand && formData.brand !== "אחר" ? (
                <div className="space-y-2">
                  <SearchableSelect
                    value={formData.size}
                    onValueChange={(value) => {
                      if (value === "אחר - הזנה ידנית") {
                        setShowCustomPhoneModel(true);
                        setFormData({ ...formData, size: "" });
                      } else {
                        setFormData({ ...formData, size: value });
                      }
                    }}
                    options={[...availablePhoneModels, "אחר - הזנה ידנית"]}
                    placeholder="בחר דגם"
                    searchPlaceholder="חפש דגם..."
                    emptyText="לא נמצאו דגמים"
                  />
                </div>
              ) : (
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר יצרן תחילה" />
                  </SelectTrigger>
                  <SelectContent />
                </Select>
              )
            ) : (
              <div className="space-y-2">
                <Input
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="הזן שם דגם"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCustomPhoneModel(false);
                    setFormData({ ...formData, size: "" });
                  }}
                >
                  חזור לבחירה מרשימה
                </Button>
              </div>
            )}
            {formData.brand === "אחר" && (
              <Input
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                placeholder="הזן שם דגם"
                className="mt-2"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">נפח אחסון *</Label>
            <Select value={formData.weight} onValueChange={(value) => setFormData({ ...formData, weight: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר נפח אחסון" />
              </SelectTrigger>
              <SelectContent>
                {phoneStorageOptions.map(storage => (
                  <SelectItem key={storage} value={storage}>{storage}</SelectItem>
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
          <div className="space-y-2">
            <Label htmlFor="year_manufactured">שנת ייצור</Label>
            <Input
              id="year_manufactured"
              name="year_manufactured"
              type="number"
              value={formData.year_manufactured}
              onChange={handleInputChange}
              placeholder="2024"
              min="2015"
              max={new Date().getFullYear()}
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
                  value={formData.price}
                  onChange={handlePriceChange}
                  required
                  placeholder="500"
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
