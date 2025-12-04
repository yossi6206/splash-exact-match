import { useState } from "react";
import { Button } from "@/components/ui/button";
import logoBlob from "@/assets/logo-secondhandpro-blob.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import PostAdDialog from "@/components/PostAdDialog";
import SecondhandMegaMenu from "@/components/SecondhandMegaMenu";
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
    <header className="sticky top-0 z-50 w-full border-b-2 border-gray-200 bg-white dark:bg-background shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)] hidden md:block">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center">
              <img 
                src={logoBlob} 
                alt="SecondHandPro" 
                className="h-12 w-auto object-contain"
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6 relative">
              <div 
                className="relative"
                onMouseEnter={() => setHoveredMenu("נדל\"ן")}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Button variant="ghost" className="text-sm font-medium" asChild>
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

              <Button variant="ghost" className="text-sm font-medium" asChild>
                <Link to="/projects">פרויקטים חדשים</Link>
              </Button>

              <div 
                className="relative"
                onMouseEnter={() => setHoveredMenu("רכב")}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Button variant="ghost" className="text-sm font-medium" asChild>
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

              <SecondhandMegaMenu
                hoveredMenu={hoveredMenu}
                setHoveredMenu={setHoveredMenu}
              />

              <div 
                className="relative"
                onMouseEnter={() => setHoveredMenu("דרושים")}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Button variant="ghost" className="text-sm font-medium" asChild>
                  <Link to="/jobs">דרושים</Link>
                </Button>
                
                {hoveredMenu === "דרושים" && megaMenuData["דרושים"] && (
                  <div className="absolute top-full right-0 pt-2 z-50">
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
                <Button variant="ghost" className="text-sm font-medium" asChild>
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
                <Button variant="ghost" className="text-sm font-medium" asChild>
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
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:flex relative"
                onClick={() => navigate("/messages")}
              >
                <MessageSquare className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex"
              onClick={() => navigate("/favorites")}
            >
              <Heart className="h-5 w-5" />
            </Button>
            
            {user ? (
              <Button 
                variant="ghost" 
                className="hidden md:flex items-center gap-2"
                onClick={() => navigate("/dashboard/post-wizard")}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-sm">
                    {getInitials(user.email || "")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.email?.split('@')[0]}</span>
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                className="hidden md:flex"
                onClick={() => navigate("/auth")}
              >
                התחבר
              </Button>
            )}
            
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full gap-2"
              onClick={() => setPostDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
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
