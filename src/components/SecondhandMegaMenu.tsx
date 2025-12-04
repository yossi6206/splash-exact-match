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
  Laptop,
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
        items: ["טלוויזיות", "מכונות כביסה", "מייבשי כביסה", "מדיחי כלים", "תנורי אפייה", "כירות וכיריים", "מקררים", "מקפיאים", "מאווררים", "מוצרי חימום", "מזגנים", "מיקרוגלים"]
      },
      {
        title: "צילום",
        items: ["מצלמות", "עדשות מצלמה"]
      },
      {
        title: "מערכות וידאו ואודיו",
        items: ["רמקולים", "מערכות קולנוע ביתי", "רסיברים", "מערכות דיג׳י", "מקרנים"]
      }
    ]
  },
  {
    title: "מחשבים",
    icon: Laptop,
    slug: "laptops",
    subcategories: [
      {
        title: "מחשבים ניידים",
        items: ["מחשבי גיימינג", "מחשבים לעבודה", "מקבוק", "אולטרה בוק", "טאבלטים"]
      },
      {
        title: "מחשבים נייחים",
        items: ["מחשבי גיימינג", "תחנות עבודה", "מחשבי all-in-one", "מחשבים מורכבים"]
      },
      {
        title: "רכיבי מחשב",
        items: ["כרטיסי מסך", "מעבדים", "זיכרון RAM", "כוננים", "לוחות אם"]
      },
      {
        title: "אביזרים",
        items: ["מסכים", "מקלדות", "עכברים", "אוזניות", "מצלמות"]
      },
      {
        title: "תוכנות",
        items: ["מערכות הפעלה", "תוכנות משרד", "תוכנות עיצוב", "אנטי וירוס"]
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
    title: "ביגוד ואקססוריז",
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
        <>
          {/* Invisible bridge to prevent menu from closing when moving mouse */}
          <div className="absolute top-full left-0 right-0 h-4 bg-transparent" />
          <div className="fixed inset-x-0 top-16 pt-2 z-50 flex justify-center px-4 pointer-events-none">
            <div 
              className="bg-white border border-primary/20 rounded-lg animate-fade-in flex max-h-[70vh] w-full max-w-[900px] pointer-events-auto overflow-hidden" 
              style={{ boxShadow: 'var(--shadow-dropdown)' }}
            >
              {/* Right side - Categories list */}
              <div className="w-56 border-l border-primary/10 bg-muted/20 overflow-y-auto">
                <div className="p-4 border-b border-primary/10">
                  <Link 
                    to="/secondhand"
                    className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                  >
                    <span>כל יד שנייה</span>
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                </div>
                <div className="py-2">
                  {secondhandCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <div
                        key={category.slug}
                        className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all ${
                          activeCategory === category.title 
                            ? 'bg-white border-r-2 border-primary' 
                            : 'hover:bg-white/70'
                        }`}
                        onMouseEnter={() => setActiveCategory(category.title)}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${activeCategory === category.title ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className={`text-sm font-medium ${activeCategory === category.title ? 'text-primary' : 'text-foreground'}`}>
                            {category.title}
                          </span>
                        </div>
                        {category.subcategories.length > 0 && (
                          <ChevronLeft className={`h-4 w-4 ${activeCategory === category.title ? 'text-primary' : 'text-muted-foreground'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Left side - Subcategories */}
              <div className="flex-1 p-6 overflow-y-auto">
                {activeCategoryData && activeCategoryData.subcategories.length > 0 ? (
                  <>
                    <Link 
                      to={`/secondhand/${activeCategoryData.slug}`}
                      className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors mb-5 pb-2 border-b-2 border-primary/20"
                    >
                      <activeCategoryData.icon className="h-4 w-4" />
                      <span>כל {activeCategoryData.title}</span>
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                    <div className="grid grid-cols-4 gap-6">
                      {activeCategoryData.subcategories.map((subcategory, index) => (
                        <div key={index}>
                          <h4 className="text-sm font-bold text-foreground mb-3">{subcategory.title}</h4>
                          <ul className="space-y-1.5">
                            {subcategory.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <Link 
                                  to={`/secondhand/${activeCategoryData.slug}`}
                                  className="text-sm text-muted-foreground hover:text-primary transition-colors block py-1 hover:underline"
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
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    <Trophy className="h-12 w-12 text-primary mb-4" />
                    <Link 
                      to={`/secondhand/${activeCategoryData?.slug || ''}`}
                      className="text-primary font-medium hover:underline"
                    >
                      צפה בכל המוצרים המומלצים
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SecondhandMegaMenu;
