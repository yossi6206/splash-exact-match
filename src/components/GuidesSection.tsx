import TipCard from "./TipCard";
import { 
  ShieldCheck, 
  ShoppingCart, 
  Camera, 
  FileText,
  TrendingUp,
  MessageSquare
} from "lucide-react";

const tips = [
  {
    id: 1,
    icon: ShieldCheck,
    title: "איך למכור בביטחון",
    description: "טיפים חשובים למכירה בטוחה - פגישה במקום ציבורי, אמצעי תשלום מאובטחים ועוד",
  },
  {
    id: 2,
    icon: ShoppingCart,
    title: "מדריך לקניה נכונה",
    description: "כל מה שצריך לדעת לפני הקנייה - בדיקת המוצר, משא ומתן על המחיר ותיעוד העסקה",
  },
  {
    id: 3,
    icon: Camera,
    title: "צילום מוצר מושלם",
    description: "תמונות איכוטיות מגדילות את סיכויי המכירה - תאורה טובה, זוויות נכונות ורקע נקי",
  },
  {
    id: 4,
    icon: FileText,
    title: "כתיבת מודעה מנצחת",
    description: "כותרת מושכת, תיאור מפורט וכנה, פרטים חשובים - המפתח למכירה מהירה",
  },
  {
    id: 5,
    icon: TrendingUp,
    title: "תמחור נכון",
    description: "איך לקבוע מחיר הוגן שימשוך קונים - השוואת מחירים, התחשבות במצב הפריט",
  },
  {
    id: 6,
    icon: MessageSquare,
    title: "תקשורת יעילה",
    description: "מענה מהיר לפניות, שפה מכובדת ומקצועית - בסיס לעסקה מוצלחת",
  },
];

const GuidesSection = () => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            טיפים ומדריכים
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            כל מה שצריך לדעת כדי למכור ולקנות בצורה מיטבית ובטוחה ביד2
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <TipCard key={tip.id} {...tip} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuidesSection;
