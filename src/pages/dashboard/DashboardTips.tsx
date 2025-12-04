import { useState } from "react";
import TipCard from "@/components/TipCard";
import tipSelling from "@/assets/tip-selling-new.jpg";
import tipBuying from "@/assets/tip-buying-new.jpg";
import tipSafety from "@/assets/tip-safety-new.jpg";
import tipWriting from "@/assets/tip-writing-new.jpg";
import tipPricing from "@/assets/tip-pricing-new.jpg";
import tipInspection from "@/assets/tip-inspection-new.jpg";
import tipMeeting from "@/assets/tip-meeting-new.jpg";
import tipPhotography from "@/assets/tip-photography-new.jpg";
import tipCommunication from "@/assets/tip-communication-new.jpg";
import tipNegotiation from "@/assets/tip-negotiation-new.jpg";
import tipFraud from "@/assets/tip-fraud-new.jpg";
import tipPromotion from "@/assets/tip-promotion-new.jpg";

const allTips = [
  {
    image: tipSelling,
    title: "איך למכור בהצלחה",
    description: "טיפים חשובים למכירה מהירה ויעילה של הפריט שלך",
    category: "מכירה",
    slug: "sell-success"
  },
  {
    image: tipBuying,
    title: "מדריך לקונה החכם",
    description: "כל מה שצריך לדעת לפני רכישת מוצר יד שנייה",
    category: "קנייה",
    slug: "smart-buyer"
  },
  {
    image: tipSafety,
    title: "בטיחות ואבטחה",
    description: "הגן על עצמך ועל המידע האישי שלך בעסקאות",
    category: "אבטחה",
    slug: "safety-security"
  },
  {
    image: tipWriting,
    title: "כתיבת מודעה מושלמת",
    description: "כך תכתוב מודעה שתמשך קונים ותביא למכירה מהירה",
    category: "מודעות",
    slug: "perfect-ad"
  },
  {
    image: tipPricing,
    title: "תמחור נכון - המפתח למכירה",
    description: "איך לקבוע מחיר הוגן ואטרקטיבי לפריט שלך",
    category: "מכירה",
    slug: "pricing-tips"
  },
  {
    image: tipInspection,
    title: "בדיקת מצב הפריט",
    description: "מדריך מקיף לבדיקת מצב מוצרים לפני קנייה",
    category: "קנייה",
    slug: "product-inspection"
  },
  {
    image: tipMeeting,
    title: "נקודות מפגש בטוחות",
    description: "איפה ומתי להיפגש עם קונים ומוכרים",
    category: "אבטחה",
    slug: "safe-meeting"
  },
  {
    image: tipPhotography,
    title: "צילום מושלם למודעה",
    description: "טיפים לצילום פריטים שימכרו אותם בעצמם",
    category: "מודעות",
    slug: "photography-tips"
  },
  {
    image: tipCommunication,
    title: "תקשורת יעילה עם קונים",
    description: "כיצד לנהל שיחות שמובילות לעסקאות מוצלחות",
    category: "מכירה",
    slug: "communication-tips"
  },
  {
    image: tipNegotiation,
    title: "משא ומתן חכם",
    description: "אסטרטגיות למשא ומתן שיביאו לך את המחיר הטוב ביותר",
    category: "קנייה",
    slug: "negotiation-tips"
  },
  {
    image: tipFraud,
    title: "זיהוי הונאות נפוצות",
    description: "איך להימנע מנוכלים ולזהות מודעות מפוקפקות",
    category: "אבטחה",
    slug: "fraud-detection"
  },
  {
    image: tipPromotion,
    title: "קידום המודעה שלך",
    description: "דרכים להגביר את החשיפה של המודעה שלך",
    category: "מודעות",
    slug: "ad-promotion"
  },
];

const categories = [
  { id: "all", label: "הכל", categoryName: null },
  { id: "selling", label: "מכירה", categoryName: "מכירה" },
  { id: "buying", label: "קנייה", categoryName: "קנייה" },
  { id: "security", label: "אבטחה", categoryName: "אבטחה" },
  { id: "ads", label: "מודעות", categoryName: "מודעות" },
];

const DashboardTips = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTips = selectedCategory
    ? allTips.filter((tip) => tip.category === selectedCategory)
    : allTips;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">טיפים ומדריכים</h1>
      <p className="text-muted-foreground mb-6">כל המידע שאתה צריך כדי למכור ולקנות בצורה החכמה והבטוחה ביותר</p>
      
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.categoryName)}
            className={`px-6 py-2 rounded-full border-2 font-medium text-sm whitespace-nowrap transition-all duration-200 hover:shadow-md ${
              selectedCategory === category.categoryName
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white dark:bg-card border-border hover:bg-muted/50 text-foreground"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        {filteredTips.map((tip, index) => (
          <TipCard
            key={index}
            image={tip.image}
            title={tip.title}
            description={tip.description}
            slug={tip.slug}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardTips;
