import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Heart, Plus, LogOut, LayoutDashboard, Settings, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const megaMenuData = {
  "נדל\"ן": {
    columns: [
      {
        title: "דירות למכירה",
        items: ["דירות גן", "פנטהאוז", "דירות סטודיו", "דירות דופלקס", "דירות רגילות"]
      },
      {
        title: "בתים ונכסים מיוחדים",
        items: ["בתים פרטיים", "קוטג'ים", "וילות", "משקים וחוות", "מגרשים"]
      },
      {
        title: "לפי אזור",
        items: ["מרכז", "צפון", "דרום", "ירושלים והסביבה", "השרון", "השפלה"]
      },
      {
        title: "נכסים מסחריים",
        items: ["נכסים להשקעה", "חניות", "נכסי נופש"]
      },
      {
        title: "דירות להשכרה",
        items: ["דירות לטווח ארוך", "דירות לטווח קצר", "חדרים בשותפות", "מחסנים"]
      }
    ]
  },
  "רכב": {
    columns: [
      {
        title: "רכב פרטי",
        items: ["יד ראשונה", "יד שנייה", "רכב חדש", "רכב משומש", "קבוצת קנייה"]
      },
      {
        title: "רכב מסחרי",
        items: ["משאיות", "מסחריות", "טרקטורים", "אוטובוסים"]
      },
      {
        title: "אופנועים",
        items: ["אופנועים חדשים", "אופנועים משומשים", "קטנועים", "אופני שטח"]
      },
      {
        title: "אביזרים",
        items: ["גלגלים וחישוקים", "מערכות שמע", "אביזרי קישוט", "ציוד בטיחות"]
      },
      {
        title: "שירותים",
        items: ["מוסכים", "מכוני שירות", "גרירה", "ביטוח רכב"]
      }
    ]
  },
  "מחשבים": {
    columns: [
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
  "יד שניה": {
    columns: [
      {
        title: "ריהוט",
        items: ["ספות וכורסאות", "שולחנות", "כיסאות", "ארונות", "מיטות"]
      },
      {
        title: "מוצרי חשמל",
        items: ["מקררים", "מכונות כביסה", "תנורים", "מיקרוגלים", "מזגנים"]
      },
      {
        title: "ספורט ופנאי",
        items: ["אופניים", "ציוד כושר", "משחקים", "ספרים", "כלי נגינה"]
      },
      {
        title: "אופנה",
        items: ["בגדים", "נעליים", "תיקים", "אביזרים", "תכשיטים"]
      },
      {
        title: "תינוקות וילדים",
        items: ["עגלות", "כיסאות אוכל", "מיטות", "צעצועים", "בגדי ילדים"]
      }
    ]
  }
};

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Search suggestions based on mega menu data
  const searchSuggestions = [
    { category: "נדל\"ן", items: ["דירות למכירה", "דירות להשכרה", "בתים פרטיים", "דירות גן", "פנטהאוז"] },
    { category: "רכב", items: ["רכב יד שנייה", "אופנועים", "משאיות", "אביזרי רכב", "מערכות שמע"] },
    { category: "מחשבים", items: ["מחשבים ניידים", "מחשבי גיימינג", "כרטיסי מסך", "מסכים", "מקלדות"] },
    { category: "יד שניה", items: ["ריהוט", "מוצרי חשמל", "אופניים", "בגדים", "צעצועים"] },
  ];

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-gray-200 bg-white dark:bg-background shadow-[0_4px_12px_-2px_rgba(0,0,0,0.1)] hidden md:block">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-12 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary px-3">
                <span className="text-base font-extrabold text-primary-foreground whitespace-nowrap">שוק יד שנייה</span>
              </div>
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
                    <div className="bg-background border border-border rounded-lg shadow-xl p-8 w-[900px] animate-fade-in">
                      <div className="grid grid-cols-5 gap-6">
                        {megaMenuData["נדל\"ן"].columns.map((column, index) => (
                          <div key={index}>
                            <h3 className="text-sm font-bold text-primary mb-3 pb-2 border-b-2 border-primary/20">
                              {column.title}
                            </h3>
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
                onMouseEnter={() => setHoveredMenu("רכב")}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Button variant="ghost" className="text-sm font-medium" asChild>
                  <Link to="/cars">רכב</Link>
                </Button>
                
                {hoveredMenu === "רכב" && megaMenuData["רכב"] && (
                  <div className="absolute top-full right-0 pt-2 z-50">
                    <div className="bg-background border border-border rounded-lg shadow-xl p-8 w-[900px] animate-fade-in">
                      <div className="grid grid-cols-5 gap-6">
                        {megaMenuData["רכב"].columns.map((column, index) => (
                          <div key={index}>
                            <h3 className="text-sm font-bold text-primary mb-3 pb-2 border-b-2 border-primary/20">
                              {column.title}
                            </h3>
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
                <Button variant="ghost" className="text-sm font-medium" asChild>
                  <Link to="/laptops">מחשבים</Link>
                </Button>
                
                {hoveredMenu === "מחשבים" && megaMenuData["מחשבים"] && (
                  <div className="absolute top-full right-0 pt-2 z-50">
                    <div className="bg-background border border-border rounded-lg shadow-xl p-8 w-[900px] animate-fade-in">
                      <div className="grid grid-cols-5 gap-6">
                        {megaMenuData["מחשבים"].columns.map((column, index) => (
                          <div key={index}>
                            <h3 className="text-sm font-bold text-primary mb-3 pb-2 border-b-2 border-primary/20">
                              {column.title}
                            </h3>
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
                <Button variant="ghost" className="text-sm font-medium" asChild>
                  <Link to="/secondhand">יד שניה</Link>
                </Button>
                
                {hoveredMenu === "יד שניה" && megaMenuData["יד שניה"] && (
                  <div className="absolute top-full right-0 pt-2 z-50">
                    <div className="bg-background border border-border rounded-lg shadow-xl p-8 w-[900px] animate-fade-in">
                      <div className="grid grid-cols-5 gap-6">
                        {megaMenuData["יד שניה"].columns.map((column, index) => (
                          <div key={index}>
                            <h3 className="text-sm font-bold text-primary mb-3 pb-2 border-b-2 border-primary/20">
                              {column.title}
                            </h3>
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
                <Link to="/jobs">דרושים IL</Link>
              </Button>
              
              <Button variant="ghost" className="text-sm font-medium" asChild>
                <Link to="/freelancers">פרילנסרים</Link>
              </Button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={searchOpen}
                  className="w-full justify-between bg-white dark:bg-background hover:bg-gray-50 dark:hover:bg-accent/50 border-2 border-gray-200 dark:border-border/60 h-11 px-4 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Search className="h-4 w-4" />
                    <span className="text-sm">חיפוש מוצרים, נדל"ן, רכב ועוד...</span>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[600px] p-0 shadow-2xl border-2 border-gray-200 bg-white dark:bg-background" align="start">
                <Command>
                  <CommandInput 
                    placeholder="הקלד לחיפוש..." 
                    value={searchValue}
                    onValueChange={setSearchValue}
                    className="border-none focus:ring-0"
                  />
                  <CommandList>
                    <CommandEmpty>לא נמצאו תוצאות</CommandEmpty>
                    {searchSuggestions.map((group) => (
                      <CommandGroup key={group.category} heading={group.category}>
                        {group.items
                          .filter((item) => 
                            searchValue === "" || 
                            item.toLowerCase().includes(searchValue.toLowerCase())
                          )
                          .map((item) => (
                            <CommandItem
                              key={item}
                              value={item}
                              onSelect={(value) => {
                                setSearchValue(value);
                                setSearchOpen(false);
                              }}
                              className="cursor-pointer"
                            >
                              <Search className="ml-2 h-4 w-4 opacity-50" />
                              {item}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="h-5 w-5" />
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-sm">
                        {getInitials(user.email || "")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.email?.split('@')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-semibold">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="ml-2 h-4 w-4" />
                    <span>לוח הבקרה</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="ml-2 h-4 w-4" />
                    <span>הגדרות</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive" onClick={signOut}>
                    <LogOut className="ml-2 h-4 w-4" />
                    <span>התנתק</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                className="hidden md:flex"
                onClick={() => navigate("/auth")}
              >
                התחבר
              </Button>
            )}
            
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full gap-2">
              <Plus className="h-4 w-4" />
              לפרסם מודעה
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
