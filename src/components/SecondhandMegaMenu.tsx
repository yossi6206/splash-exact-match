import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  Trophy,
  Tv,
  Smartphone,
  Dumbbell,
  Shirt,
  Baby,
  Sofa,
  LucideIcon
} from "lucide-react";

type CategoryData = {
  title: string;
  icon: LucideIcon;
  image?: string;
  slug: string;
  subcategories: {
    title: string;
    items: string[];
  }[];
};

const secondhandCategories: CategoryData[] = [
  {
    title: "המומלצים שלנו",
    icon: Trophy,
    slug: "recommended",
    subcategories: []
  },
  {
    title: "ריהוט",
    icon: Sofa,
    slug: "furniture",
    subcategories: [
      {
        title: "לסלון",
        items: ["ספות", "כורסאות", "שולחנות סלון", "מזנונים", "ויטרינות"]
      },
      {
        title: "לחדר שינה",
        items: ["מיטות", "ארונות בגדים", "שידות", "מראות", "שולחנות איפור"]
      },
      {
        title: "לפינת אוכל",
        items: ["שולחנות אוכל", "כיסאות", "ספסלים", "עגלות הגשה"]
      },
      {
        title: "לחדר עבודה",
        items: ["שולחנות מחשב", "כיסאות משרדיים", "ספריות", "מדפים"]
      }
    ]
  },
  {
    title: "אלקטרוניקה",
    icon: Tv,
    slug: "electronics",
    subcategories: [
      {
        title: "מוצרי חשמל לבית",
        items: ["טלוויזיות", "מכונות כביסה", "מייבשי כביסה", "מדיחי כלים", "תנורי אפייה", "כירות וכיריים", "מקררים", "מקפיאים", "מאווררים", "מוצרי חימום", "מזגנים", "מיקרוגלים", "טוסטרים", "תנורי פיצה", "שואבי אבק", "מכונות קפה ואספרסו", "מכשירי סודה", "מסחטות מיץ"]
      },
      {
        title: "צילום",
        items: ["מצלמות", "עדשות מצלמה"]
      },
      {
        title: "מערכות וידאו ואודיו",
        items: ["רמקולים", "מערכות קולנוע ביתי", "רסיברים לוידאו ואודיו", "ערכות קריוקי", "מערכות דיג׳י", "מקרנים", "נגני מדיה ביתיים וסטרימינג", "סרטי DVD וקלטות וידאו", "מערכות סטראו", "מיקרופונים", "מגברי אודיו"]
      }
    ]
  },
  {
    title: "מכשירים סלולריים",
    icon: Smartphone,
    slug: "phones",
    subcategories: [
      {
        title: "טלפונים",
        items: ["אייפון", "סמסונג", "שיאומי", "וואווי", "אופו", "אחר"]
      },
      {
        title: "אביזרים",
        items: ["כיסויים", "מגני מסך", "מטענים", "אוזניות", "סוללות חיצוניות"]
      }
    ]
  },
  {
    title: "ספורט ופנאי",
    icon: Dumbbell,
    slug: "sports",
    subcategories: [
      {
        title: "אופניים",
        items: ["אופני כביש", "אופני הרים", "אופניים חשמליים", "אופני ילדים"]
      },
      {
        title: "ציוד כושר",
        items: ["הליכון", "אופני כושר", "משקולות", "מזרני יוגה", "מכשירי כושר"]
      },
      {
        title: "ספורט חוצות",
        items: ["אוהלים", "ציוד קמפינג", "ציוד גלישה", "ציוד טיולים"]
      }
    ]
  },
  {
    title: "ביגוד, קוסמטיקה ואקססוריז",
    icon: Shirt,
    slug: "fashion",
    subcategories: [
      {
        title: "ביגוד נשים",
        items: ["שמלות", "חולצות", "מכנסיים", "חצאיות", "ז׳קטים"]
      },
      {
        title: "ביגוד גברים",
        items: ["חולצות", "מכנסיים", "חליפות", "ז׳קטים", "סוודרים"]
      },
      {
        title: "נעליים",
        items: ["נעלי ספורט", "נעלי עקב", "סנדלים", "מגפיים"]
      },
      {
        title: "תכשיטים ואקססוריז",
        items: ["שעונים", "תכשיטים", "תיקים", "חגורות", "משקפי שמש"]
      }
    ]
  },
  {
    title: "ילדים ותינוקות",
    icon: Baby,
    slug: "kids",
    subcategories: [
      {
        title: "עגלות וכיסאות",
        items: ["עגלות", "טיולונים", "כיסאות בטיחות", "כיסאות אוכל"]
      },
      {
        title: "ריהוט לילדים",
        items: ["מיטות תינוק", "שידות החתלה", "ארונות ילדים"]
      },
      {
        title: "צעצועים",
        items: ["צעצועי התפתחות", "משחקי לוח", "בובות", "לגו"]
      },
      {
        title: "ביגוד",
        items: ["בגדי תינוקות", "בגדי ילדים", "נעלי ילדים"]
      }
    ]
  }
];

interface SecondhandMegaMenuProps {
  hoveredMenu: string | null;
  setHoveredMenu: (menu: string | null) => void;
}

const SecondhandMegaMenu = ({ hoveredMenu, setHoveredMenu }: SecondhandMegaMenuProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("אלקטרוניקה");

  const activeCategoryData = secondhandCategories.find(cat => cat.title === activeCategory);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setHoveredMenu("יד שניה")}
      onMouseLeave={() => {
        setHoveredMenu(null);
        setActiveCategory("אלקטרוניקה");
      }}
    >
      <Button variant="ghost" className="text-sm font-medium" asChild>
        <Link to="/secondhand">יד שניה</Link>
      </Button>
      
      {hoveredMenu === "יד שניה" && (
        <div className="absolute top-full right-0 pt-2 z-50">
          <div 
            className="bg-white border border-border rounded-lg animate-fade-in flex" 
            style={{ boxShadow: 'var(--shadow-dropdown)', minWidth: '900px' }}
          >
            {/* Right side - Categories list */}
            <div className="w-72 border-l border-border bg-muted/30">
              <div className="p-4 border-b border-border">
                <Link 
                  to="/secondhand"
                  className="flex items-center justify-between text-base font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <span>עמוד בית יד שנייה</span>
                </Link>
              </div>
              <div className="py-2">
                {secondhandCategories.map((category) => (
                  <div
                    key={category.slug}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                      activeCategory === category.title 
                        ? 'bg-white' 
                        : 'hover:bg-white/50'
                    }`}
                    onMouseEnter={() => setActiveCategory(category.title)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground">{category.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {category.subcategories.length > 0 && (
                        <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Left side - Subcategories */}
            <div className="flex-1 p-6">
              {activeCategoryData && activeCategoryData.subcategories.length > 0 ? (
                <>
                  <Link 
                    to={`/secondhand/${activeCategoryData.slug}`}
                    className="flex items-center gap-2 text-base font-semibold text-foreground hover:text-primary transition-colors mb-6"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>לכל {activeCategoryData.title}</span>
                  </Link>
                  <div className="grid grid-cols-4 gap-8">
                    {activeCategoryData.subcategories.map((subcategory, index) => (
                      <div key={index}>
                        <h4 className="text-sm font-bold text-foreground mb-3">{subcategory.title}</h4>
                        <ul className="space-y-2">
                          {subcategory.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <Link 
                                to={`/secondhand/${activeCategoryData.slug}`}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <Link 
                    to={`/secondhand/${activeCategoryData?.slug || ''}`}
                    className="text-primary hover:underline"
                  >
                    צפה בכל המוצרים המומלצים
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecondhandMegaMenu;
