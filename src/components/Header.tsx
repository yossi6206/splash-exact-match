import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import PostAdDialog from "@/components/PostAdDialog";

import { 
  MessageSquare, 
  Heart, 
  Plus, 
  LogOut, 
  LayoutDashboard, 
  Settings, 
  Home,
  Building2,
  MapPin,
  Briefcase,
  Key,
  Car,
  Truck,
  Bike,
  Wrench,
  Settings2,
  Laptop,
  Monitor,
  Cpu,
  Mouse,
  FileCode,
  Sofa,
  Zap,
  Dumbbell,
  Shirt,
  Baby,
  Code,
  TrendingUp,
  DollarSign,
  Users,
  GraduationCap,
  Palette,
  Smartphone,
  PenTool,
  Megaphone,
  Video,
  LucideIcon
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MenuColumn = {
  title: string;
  icon: LucideIcon;
  items: string[];
};

type MegaMenuData = {
  [key: string]: {
    columns: MenuColumn[];
  };
};

const megaMenuData: MegaMenuData = {
  "נדל\"ן": {
    columns: [
      {
        title: "דירות למכירה",
        icon: Home,
        items: ["דירות גן", "פנטהאוז", "דירות סטודיו", "דירות דופלקס", "דירות רגילות"]
      },
      {
        title: "בתים ונכסים מיוחדים",
        icon: Building2,
        items: ["בתים פרטיים", "קוטג'ים", "וילות", "משקים וחוות", "מגרשים"]
      },
      {
        title: "לפי אזור",
        icon: MapPin,
        items: ["מרכז", "צפון", "דרום", "ירושלים והסביבה", "השרון", "השפלה"]
      },
      {
        title: "נכסים מסחריים",
        icon: Briefcase,
        items: ["נכסים להשקעה", "חניות", "נכסי נופש"]
      },
      {
        title: "דירות להשכרה",
        icon: Key,
        items: ["דירות לטווח ארוך", "דירות לטווח קצר", "חדרים בשותפות", "מחסנים"]
      }
    ]
  },
  "רכב": {
    columns: [
      {
        title: "רכב פרטי",
        icon: Car,
        items: ["יד ראשונה", "יד שנייה", "רכב חדש", "רכב משומש", "קבוצת קנייה"]
      },
      {
        title: "רכב מסחרי",
        icon: Truck,
        items: ["משאיות", "מסחריות", "טרקטורים", "אוטובוסים"]
      },
      {
        title: "אופנועים",
        icon: Bike,
        items: ["אופנועים חדשים", "אופנועים משומשים", "קטנועים", "אופני שטח"]
      },
      {
        title: "אביזרים",
        icon: Wrench,
        items: ["גלגלים וחישוקים", "מערכות שמע", "אביזרי קישוט", "ציוד בטיחות"]
      },
      {
        title: "שירותים",
        icon: Settings2,
        items: ["מוסכים", "מכוני שירות", "גרירה", "ביטוח רכב"]
      }
    ]
  },
  "מחשבים": {
    columns: [
      {
        title: "מחשבים ניידים",
        icon: Laptop,
        items: ["מחשבי גיימינג", "מחשבים לעבודה", "מקבוק", "אולטרה בוק", "טאבלטים"]
      },
      {
        title: "מחשבים נייחים",
        icon: Monitor,
        items: ["מחשבי גיימינג", "תחנות עבודה", "מחשבי all-in-one", "מחשבים מורכבים"]
      },
      {
        title: "רכיבי מחשב",
        icon: Cpu,
        items: ["כרטיסי מסך", "מעבדים", "זיכרון RAM", "כוננים", "לוחות אם"]
      },
      {
        title: "אביזרים",
        icon: Mouse,
        items: ["מסכים", "מקלדות", "עכברים", "אוזניות", "מצלמות"]
      },
      {
        title: "תוכנות",
        icon: FileCode,
        items: ["מערכות הפעלה", "תוכנות משרד", "תוכנות עיצוב", "אנטי וירוס"]
      }
    ]
  },
  "יד שניה": {
    columns: [
      {
        title: "ריהוט",
        icon: Sofa,
        items: [
          "ספות", "כורסאות", "שולחנות אוכל", "שולחנות סלון", 
          "כיסאות", "ארונות בגדים", "מיטות", "שידות", "מדפים"
        ]
      },
      {
        title: "מוצרי חשמל",
        icon: Zap,
        items: [
          "מקררים", "מכונות כביסה", "תנורים", "מיקרוגל", 
          "מזגנים", "טלוויזיות", "מדיחי כלים"
        ]
      },
      {
        title: "ספורט ופנאי",
        icon: Dumbbell,
        items: [
          "אופני כביש", "אופני הרים", "אופניים חשמליים", 
          "ציוד כושר", "משחקים", "ספרים", "כלי נגינה"
        ]
      },
      {
        title: "אופנה",
        icon: Shirt,
        items: [
          "חולצות", "מכנסיים", "שמלות", "נעלי ספורט", 
          "נעלי עקב", "תיקי יד", "תיקי גב", "שעונים", "תכשיטים"
        ]
      },
      {
        title: "תינוקות וילדים",
        icon: Baby,
        items: [
          "עגלות", "טיולונים", "כיסאות אוכל", "מיטות תינוק", 
          "צעצועי התפתחות", "בגדי תינוקות", "בגדי ילדים"
        ]
      }
    ]
  },
  "דרושים": {
    columns: [
      {
        title: "היי-טק וטכנולוגיה",
        icon: Code,
        items: ["מפתחי תוכנה", "QA", "אנליסט מערכות", "מהנדסי DevOps", "UI/UX"]
      },
      {
        title: "שיווק ומכירות",
        icon: TrendingUp,
        items: ["מנהלי שיווק", "נציגי מכירות", "שיווק דיגיטלי", "קופירייטרים", "מנהלי קשרי לקוחות"]
      },
      {
        title: "כספים וחשבונאות",
        icon: DollarSign,
        items: ["רואי חשבון", "בקרים", "אנליסטים פיננסיים", "מנהלי תקציב", "כלכלנים"]
      },
      {
        title: "משאבי אנוש",
        icon: Users,
        items: ["מנהלי משאבי אנוש", "מגייסים", "מנהלי תגמול", "יועצי ארגון", "מאמני עובדים"]
      },
      {
        title: "בריאות וחינוך",
        icon: GraduationCap,
        items: ["רופאים", "אחיות", "מורים", "פסיכולוגים", "עובדים סוציאליים"]
      }
    ]
  },
  "פרילנסרים": {
    columns: [
      {
        title: "עיצוב גרפי",
        icon: Palette,
        items: ["עיצוב לוגו", "עיצוב UI/UX", "אינפוגרפיקה", "איורים", "מצגות"]
      },
      {
        title: "פיתוח ותכנות",
        icon: Smartphone,
        items: ["פיתוח אתרים", "פיתוח אפליקציות", "WordPress", "פיתוח משחקים", "בוטים"]
      },
      {
        title: "תוכן וכתיבה",
        icon: PenTool,
        items: ["כתיבת תוכן", "קופירייטינג", "תרגום", "עריכה לשונית", "כתיבה שיווקית"]
      },
      {
        title: "שיווק דיגיטלי",
        icon: Megaphone,
        items: ["ניהול רשתות חברתיות", "קידום אתרים SEO", "ניהול פרסום", "ייעוץ שיווקי", "אימייל מרקטינג"]
      },
      {
        title: "מולטימדיה",
        icon: Video,
        items: ["עריכת וידאו", "אנימציה", "עיבוד תמונות", "הקלטת אולפן", "מוזיקה"]
      }
    ]
  },
  "עסקים למכירה": {
    columns: [
      {
        title: "מסעדות ובתי קפה",
        icon: Building2,
        items: ["מסעדות", "בתי קפה", "בר", "פאב", "מזון רחוב"]
      },
      {
        title: "קמעונאות",
        icon: Briefcase,
        items: ["חנויות בגדים", "חנויות מזון", "סופרמרקט", "חנויות ספורט", "חנויות אלקטרוניקה"]
      },
      {
        title: "שירותים",
        icon: Settings2,
        items: ["מספרות", "מכוני יופי", "חדר כושר", "מרכז רפואי", "שירותי ניקיון"]
      },
      {
        title: "טכנולוגיה",
        icon: Code,
        items: ["חברות הייטק", "סטארטאפים", "חברות תוכנה", "עסקים דיגיטליים", "אי-קומרס"]
      },
      {
        title: "תעשייה וייצור",
        icon: Settings,
        items: ["בתי מלאכה", "מפעלי ייצור", "חברות בנייה", "עסקי ייבוא", "עסקי יצוא"]
      }
    ]
  }
};

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const unreadCount = useUnreadMessages(user?.id);

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-gray-200 bg-white dark:bg-background shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)] hidden md:block overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-10 w-auto px-3 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-md">
              <span className="text-sm font-extrabold text-primary-foreground">SecondHandPro</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              <div 
                className="relative"
                onMouseEnter={() => setHoveredMenu("נדל\"ן")}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Button variant="ghost" className="text-xs font-medium h-9 px-2" asChild>
                  <Link to="/properties">נדל"ן</Link>
                </Button>
                
                {hoveredMenu === "נדל\"ן" && megaMenuData["נדל\"ן"] && (
                  <div className="absolute top-full right-0 pt-2 z-50">
                    <div className="bg-white border border-primary/20 rounded-lg p-6 w-[800px] animate-fade-in" style={{ boxShadow: 'var(--shadow-dropdown)' }}>
                      <div className="grid grid-cols-5 gap-6">
                        {megaMenuData["נדל\"ן"].columns.map((column, index) => (
                          <div key={index}>
                            <div className="flex items-center gap-2 text-sm font-bold text-primary mb-3 pb-2 border-b-2 border-primary/20 group">
                              <column.icon className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
                              <h3 className="transition-colors group-hover:text-primary/80 whitespace-nowrap">{column.title}</h3>
                            </div>
                            <ul className="space-y-1.5">
                              {column.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <a 
                                    href="#" 
                                    className="text-sm text-foreground hover:text-primary transition-colors block py-1.5 hover:underline"
                                  >
                                    {item}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button variant="ghost" className="text-xs font-medium h-9 px-2" asChild>
                <Link to="/projects">פרויקטים חדשים</Link>
              </Button>

              <div 
                className="relative"
                onMouseEnter={() => setHoveredMenu("רכב")}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Button variant="ghost" className="text-xs font-medium h-9 px-2" asChild>
                  <Link to="/cars">רכב</Link>
                </Button>
                
                {hoveredMenu === "רכב" && megaMenuData["רכב"] && (
                  <div className="absolute top-full right-0 pt-2 z-50">
                    <div className="bg-white border border-primary/20 rounded-lg p-6 w-[800px] animate-fade-in" style={{ boxShadow: 'var(--shadow-dropdown)' }}>
                      <div className="grid grid-cols-5 gap-6">
                        {megaMenuData["רכב"].columns.map((column, index) => (
                          <div key={index}>
                            <div className="flex items-center gap-2 text-sm font-bold text-primary mb-3 pb-2 border-b-2 border-primary/20 group">
                              <column.icon className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
                              <h3 className="transition-colors group-hover:text-primary/80 whitespace-nowrap">{column.title}</h3>
                            </div>
                            <ul className="space-y-1.5">
                              {column.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <a 
                                    href="#" 
                                    className="text-sm text-foreground hover:text-primary transition-colors block py-1.5 hover:underline"
                                  >
                                    {item}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div 
                className="relative"
                onMouseEnter={() => setHoveredMenu("מחשבים")}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Button variant="ghost" className="text-xs font-medium h-9 px-2" asChild>
                  <Link to="/laptops">מחשבים</Link>
                </Button>
                
                {hoveredMenu === "מחשבים" && megaMenuData["מחשבים"] && (
                  <div className="absolute top-full right-0 pt-2 z-50">
                    <div className="bg-white border border-primary/20 rounded-lg p-6 w-[800px] animate-fade-in" style={{ boxShadow: 'var(--shadow-dropdown)' }}>
                      <div className="grid grid-cols-5 gap-6">
                        {megaMenuData["מחשבים"].columns.map((column, index) => (
                          <div key={index}>
                            <div className="flex items-center gap-2 text-sm font-bold text-primary mb-3 pb-2 border-b-2 border-primary/20 group">
                              <column.icon className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
                              <h3 className="transition-colors group-hover:text-primary/80 whitespace-nowrap">{column.title}</h3>
                            </div>
                            <ul className="space-y-1.5">
                              {column.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <a 
                                    href="#" 
                                    className="text-sm text-foreground hover:text-primary transition-colors block py-1.5 hover:underline"
                                  >
                                    {item}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div 
                className="relative"
                onMouseEnter={() => setHoveredMenu("יד שניה")}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Button variant="ghost" className="text-xs font-medium h-9 px-2" asChild>
                  <Link to="/secondhand">יד שניה</Link>
                </Button>
                
                {hoveredMenu === "יד שניה" && megaMenuData["יד שניה"] && (
                  <div className="absolute top-full right-0 pt-2 z-50">
                    <div className="bg-white border border-primary/20 rounded-lg p-6 w-[800px] animate-fade-in" style={{ boxShadow: 'var(--shadow-dropdown)' }}>
                      <div className="grid grid-cols-5 gap-6">
                        {megaMenuData["יד שניה"].columns.map((column, index) => {
                          const categorySlugMap: Record<string, string> = {
                            "ריהוט": "furniture",
                            "מוצרי חשמל": "electronics",
                            "ספורט ופנאי": "sports",
                            "אופנה": "fashion",
                            "תינוקות וילדים": "kids"
                          };
                          
                          return (
                            <div key={index}>
                              <Link 
                                to={`/secondhand/${categorySlugMap[column.title]}`}
                                className="flex items-center gap-2 text-sm font-bold text-primary mb-3 pb-2 border-b-2 border-primary/20 group hover:text-primary/80 transition-colors"
                              >
                                <column.icon className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
                                <h3 className="whitespace-nowrap">{column.title}</h3>
                              </Link>
                              <ul className="space-y-1.5">
                                {column.items.map((item, itemIndex) => (
                                  <li key={itemIndex}>
                                    <Link 
                                      to={`/secondhand/${categorySlugMap[column.title]}`}
                                      className="text-sm text-foreground hover:text-primary transition-colors block py-1.5 hover:underline"
                                    >
                                      {item}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div 
                className="relative"
                onMouseEnter={() => setHoveredMenu("דרושים")}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Button variant="ghost" className="text-xs font-medium h-9 px-2" asChild>
                  <Link to="/jobs">דרושים</Link>
                </Button>
                
                {hoveredMenu === "דרושים" && megaMenuData["דרושים"] && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div className="bg-white border border-primary/20 rounded-lg p-6 w-[800px] animate-fade-in" style={{ boxShadow: 'var(--shadow-dropdown)' }}>
                      <div className="grid grid-cols-5 gap-6">
                        {megaMenuData["דרושים"].columns.map((column, index) => (
                          <div key={index}>
                            <div className="flex items-center gap-2 text-sm font-bold text-primary mb-3 pb-2 border-b-2 border-primary/20 group">
                              <column.icon className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
                              <h3 className="transition-colors group-hover:text-primary/80 whitespace-nowrap">{column.title}</h3>
                            </div>
                            <ul className="space-y-1.5">
                              {column.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <a 
                                    href="#" 
                                    className="text-sm text-foreground hover:text-primary transition-colors block py-1.5 hover:underline"
                                  >
                                    {item}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div 
                className="relative"
                onMouseEnter={() => setHoveredMenu("פרילנסרים")}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Button variant="ghost" className="text-xs font-medium h-9 px-2" asChild>
                  <Link to="/freelancers">פרילנסרים</Link>
                </Button>
                
                {hoveredMenu === "פרילנסרים" && megaMenuData["פרילנסרים"] && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div className="bg-white border border-primary/20 rounded-lg p-6 w-[800px] animate-fade-in" style={{ boxShadow: 'var(--shadow-dropdown)' }}>
                      <div className="grid grid-cols-5 gap-6">
                        {megaMenuData["פרילנסרים"].columns.map((column, index) => (
                          <div key={index}>
                            <div className="flex items-center gap-2 text-sm font-bold text-primary mb-3 pb-2 border-b-2 border-primary/20 group">
                              <column.icon className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
                              <h3 className="transition-colors group-hover:text-primary/80 whitespace-nowrap">{column.title}</h3>
                            </div>
                            <ul className="space-y-1.5">
                              {column.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <a 
                                    href="#" 
                                    className="text-sm text-foreground hover:text-primary transition-colors block py-1.5 hover:underline"
                                  >
                                    {item}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div 
                className="relative"
                onMouseEnter={() => setHoveredMenu("עסקים למכירה")}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Button variant="ghost" className="text-xs font-medium h-9 px-2" asChild>
                  <Link to="/businesses">עסקים למכירה</Link>
                </Button>
                
                {hoveredMenu === "עסקים למכירה" && megaMenuData["עסקים למכירה"] && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div className="bg-white border border-primary/20 rounded-lg p-6 w-[800px] animate-fade-in" style={{ boxShadow: 'var(--shadow-dropdown)' }}>
                      <div className="grid grid-cols-5 gap-6">
                        {megaMenuData["עסקים למכירה"].columns.map((column, index) => (
                          <div key={index}>
                            <div className="flex items-center gap-2 text-sm font-bold text-primary mb-3 pb-2 border-b-2 border-primary/20 group">
                              <column.icon className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]" />
                              <h3 className="transition-colors group-hover:text-primary/80 whitespace-nowrap">{column.title}</h3>
                            </div>
                            <ul className="space-y-1.5">
                              {column.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <a 
                                    href="#" 
                                    className="text-sm text-foreground hover:text-primary transition-colors block py-1.5 hover:underline"
                                  >
                                    {item}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {user && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden lg:flex relative h-9 w-9"
                onClick={() => navigate("/messages")}
              >
                <MessageSquare className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center p-0 text-[10px]"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden lg:flex h-9 w-9"
              onClick={() => navigate("/favorites")}
            >
              <Heart className="h-4 w-4" />
            </Button>
            
            {user ? (
              <Button 
                variant="ghost" 
                className="hidden xl:flex items-center gap-1.5 h-9 px-2"
                onClick={() => navigate("/dashboard/post-wizard")}
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-primary/10 text-xs">
                    {getInitials(user.email || "")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium max-w-20 truncate">{user.email?.split('@')[0]}</span>
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                className="hidden lg:flex h-9 px-2 text-xs"
                onClick={() => navigate("/auth")}
              >
                התחבר
              </Button>
            )}
            
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full gap-1 h-9 px-3 text-xs"
              onClick={() => setPostDialogOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              לפרסם מודעה
            </Button>
          </div>
        </div>
      </div>
      
      <PostAdDialog open={postDialogOpen} onOpenChange={setPostDialogOpen} />
    </header>
  );
};

export default Header;
