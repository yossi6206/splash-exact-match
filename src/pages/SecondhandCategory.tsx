import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileHeader from "@/components/MobileHeader";
import { SecondhandSidebarFilter, SecondhandFilters } from "@/components/SecondhandSidebarFilter";
import { SecondhandCard } from "@/components/SecondhandCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, Search, Loader2, Sofa, Zap, Dumbbell, Shirt, Baby } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useCountUp } from "@/hooks/useCountUp";
import { supabase } from "@/integrations/supabase/client";
import { useSaveSearch } from "@/hooks/useSaveSearch";

// Category configurations - all using same gradient as Properties/Cars/Laptops
const categoryConfig: Record<string, {
  title: string;
  description: string;
  icon: any;
  subcategories: string[];
  hebrewCategory: string;
  subcategoryGroups?: Record<string, string[]>;
}> = {
  "furniture": {
    title: "ריהוט",
    hebrewCategory: "ריהוט",
    description: "מבחר ענק של ריהוט יד שנייה במחירים מעולים - ספות, שולחנות, כיסאות ועוד",
    icon: Sofa,
    subcategories: ["ספות", "כורסאות", "שולחנות אוכל", "שולחנות סלון", "כיסאות", "ארונות בגדים", "מיטות זוגיות", "מיטות יחיד", "שידות", "מדפים"],
    subcategoryGroups: {
      "סלון": ["ספות", "כורסאות", "שולחנות סלון", "מדפים", "מראות"],
      "חדר שינה": ["מיטות זוגיות", "מיטות יחיד", "ארונות בגדים", "שידות", "מראות"],
      "פינת אוכל": ["שולחנות אוכל", "כיסאות", "ארונות מטבח"],
      "משרד וחדר עבודה": ["שולחנות עבודה", "כיסאות משרדיים", "ארונות תיקיות", "מדפים"]
    }
  },
  "electronics": {
    title: "מוצרי חשמל",
    hebrewCategory: "מוצרי חשמל",
    description: "מוצרי חשמל יד שנייה באיכות גבוהה - מקררים, מכונות כביסה, תנורים ועוד",
    icon: Zap,
    subcategories: ["מקררים", "מקפיאים", "מכונות כביסה", "מייבשי כביסה", "תנורים", "כיריים", "מיקרוגל", "מזגנים", "טלוויזיות"],
    subcategoryGroups: {
      "מטבח": ["מקררים", "מקפיאים", "תנורים", "כיריים", "מיקרוגל", "מדיחי כלים"],
      "כביסה": ["מכונות כביסה", "מייבשי כביסה"],
      "אקלים": ["מזגנים", "מאווררים"],
      "בידור": ["טלוויזיות", "מערכות סטריאו", "שואבי אבק"]
    }
  },
  "computers": {
    title: "מחשבים",
    hebrewCategory: "מחשבים",
    description: "מחשבים ורכיבי מחשב יד שנייה - מחשבים ניידים, נייחים, גיימינג ואביזרים",
    icon: Zap,
    subcategories: ["מחשבים ניידים", "מחשבים נייחים", "מסכים", "כרטיסי מסך", "מעבדים", "זיכרון RAM", "כוננים", "לוחות אם", "מקלדות", "עכברים", "אוזניות", "מצלמות"],
    // Hierarchical subcategories for professional display
    subcategoryGroups: {
      "מחשבים ניידים": ["מחשבי גיימינג", "מחשבים לעבודה", "מקבוק", "אולטרה בוק", "טאבלטים"],
      "מחשבים נייחים": ["מחשבי גיימינג", "תחנות עבודה", "מחשבי all-in-one", "מחשבים מורכבים"],
      "רכיבי מחשב": ["כרטיסי מסך", "מעבדים", "זיכרון RAM", "כוננים", "לוחות אם"],
      "אביזרים": ["מסכים", "מקלדות", "עכברים", "אוזניות", "מצלמות"]
    }
  },
  "phones": {
    title: "מכשירים סלולריים",
    hebrewCategory: "מכשירים סלולריים",
    description: "טלפונים ניידים ואביזרים יד שנייה - אייפון, סמסונג, שעונים חכמים ועוד",
    icon: Zap,
    subcategories: ["אייפון", "סמסונג גלקסי", "שיאומי", "שעונים חכמים", "אוזניות אלחוטיות", "מטענים", "כיסויים"],
    subcategoryGroups: {
      "סמארטפונים": ["אייפון", "סמסונג גלקסי", "שיאומי", "וואווי", "אופו", "וואן פלוס", "גוגל פיקסל", "נוקיה", "מוטורולה"],
      "שעונים חכמים": ["Apple Watch", "Samsung Galaxy Watch", "Garmin", "Fitbit", "שעוני ספורט"],
      "אוזניות": ["אוזניות אלחוטיות", "אוזניות בלוטות'", "אוזניות TWS", "אוזניות חוטיות"],
      "אביזרים": ["מטענים", "כיסויים", "מגני מסך", "סוללות חיצוניות", "מעמדים"]
    }
  },
  "sports": {
    title: "ספורט ופנאי",
    hebrewCategory: "ספורט ופנאי",
    description: "ציוד ספורט ופנאי יד שנייה - אופניים, ציוד כושר, משחקים וכלי נגינה",
    icon: Dumbbell,
    subcategories: ["אופני כביש", "אופני הרים", "אופניים חשמליים", "קורקינטים", "ציוד כושר ביתי", "משקולות", "גיטרות", "פסנתרים"],
    subcategoryGroups: {
      "אופניים": ["אופני כביש", "אופני הרים", "אופניים חשמליים", "קורקינטים"],
      "כושר ביתי": ["ציוד כושר ביתי", "משקולות", "הליכונים", "אופני כושר"],
      "משחקים": ["משחקי קופסא", "משחקי וידאו", "ספרים"],
      "כלי נגינה": ["גיטרות", "פסנתרים", "תופים", "כינורות"]
    }
  },
  "fashion": {
    title: "אופנה",
    hebrewCategory: "אופנה",
    description: "בגדים ואביזרים יד שנייה במצב מעולה - בגדים, נעליים, תיקים ותכשיטים",
    icon: Shirt,
    subcategories: ["חולצות", "מכנסיים", "שמלות", "חצאיות", "מעילים", "נעלי ספורט", "תיקי יד", "שעונים", "תכשיטים"],
    subcategoryGroups: {
      "בגדים": ["חולצות", "מכנסיים", "שמלות", "חצאיות", "מעילים"],
      "נעליים": ["נעלי ספורט", "נעלי עקב", "סנדלים", "מגפיים"],
      "תיקים": ["תיקי יד", "תיקי גב", "ארנקים", "מזוודות"],
      "אביזרים": ["שעונים", "תכשיטים", "משקפי שמש", "חגורות"]
    }
  },
  "kids": {
    title: "תינוקות וילדים",
    hebrewCategory: "תינוקות וילדים",
    description: "ציוד לתינוקות וילדים יד שנייה - עגלות, כיסאות אוכל, מיטות וצעצועים",
    icon: Baby,
    subcategories: ["עגלות", "טיולונים", "כיסאות אוכל", "מיטות תינוק", "צעצועי התפתחות", "בגדי תינוקות (0-2)", "בגדי ילדים (2-6)"],
    subcategoryGroups: {
      "ציוד תינוקות": ["עגלות", "טיולונים", "כיסאות אוכל", "מיטות תינוק", "עריסות"],
      "צעצועים": ["צעצועי התפתחות", "משחקי בנייה", "בובות", "משחקים חינוכיים"],
      "בגדים": ["בגדי תינוקות (0-2)", "בגדי ילדים (2-6)", "בגדי ילדים (6-12)"],
      "אביזרי האכלה": ["כיסאות אוכל", "בקבוקים", "מוצצים", "צלחות וסכו״ם"]
    }
  }
};

const SecondhandCategory = () => {
  const { category } = useParams<{ category: string }>();
  const [sortBy, setSortBy] = useState("date");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(undefined);
  const { saveSearch } = useSaveSearch();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [filters, setFilters] = useState<SecondhandFilters>({
    categories: [],
    subcategories: [],
    priceMin: 0,
    priceMax: 10000,
    conditions: [],
    cities: [],
    brands: [],
    sizes: [],
    colors: [],
    materials: [],
    deliveryAvailable: false,
    negotiable: false,
    types: [],
    features: [],
  });
  const itemsPerPage = 12;

  // Get category configuration with safe fallback
  const config = (category && categoryConfig[category]) ? categoryConfig[category] : categoryConfig["furniture"];
  const CategoryIcon = config?.icon || Sofa;

  const categoryMap: Record<string, string> = {
    "furniture": "ריהוט",
    "electronics": "מוצרי חשמל",
    "computers": "מחשבים",
    "phones": "מכשירים סלולריים",
    "sports": "ספורט ופנאי",
    "fashion": "אופנה",
    "kids": "תינוקות וילדים"
  };

  useEffect(() => {
    fetchItems();
  }, [category]);

  useEffect(() => {
    applyFilters();
  }, [filters, allItems, sortBy, debouncedSearchQuery]);

  // Debounce search query for auto-filtering
  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(false);
      setCurrentPage(1);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Save search to history
  useEffect(() => {
    if (debouncedSearchQuery) {
      saveSearch({
        searchQuery: debouncedSearchQuery,
        category: "secondhand",
        resultsCount: items.length
      });
    }
  }, [debouncedSearchQuery]);

  const fetchItems = async () => {
    setLoading(true);
    
    // Fetch promoted items with fair rotation
    let promotedQuery = supabase
      .from("secondhand_items")
      .select("*")
      .eq("status", "active")
      .eq("is_promoted", true)
      .gte("promotion_end_date", new Date().toISOString())
      .order("promotion_impressions", { ascending: true })
      .order("last_top_position_at", { ascending: true, nullsFirst: true })
      .order("id", { ascending: true })
      .limit(3);

    // Filter by category if specified
    if (category) {
      promotedQuery = promotedQuery.eq("category", categoryMap[category]);
    }

    const { data: promotedData } = await promotedQuery;

    // Fetch regular items
    let query = supabase
      .from("secondhand_items")
      .select("*")
      .eq("status", "active")
      .or(`is_promoted.is.null,is_promoted.eq.false,promotion_end_date.lt.${new Date().toISOString()}`);

    // Filter by category if specified
    if (category) {
      query = query.eq("category", categoryMap[category]);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching items:", error);
    } else {
      // Update impressions only for the first promoted item (top position)
      if (promotedData && promotedData.length > 0) {
        const topItem = promotedData[0];
        await supabase.functions.invoke('increment-impression', {
          body: { table: 'secondhand_items', id: topItem.id }
        });
      }

      const allItemsData = [...(promotedData || []), ...(data || [])];
      setAllItems(allItemsData);
      setItems(allItemsData);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...allItems];

    // Search filter
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.brand?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(item => filters.categories.includes(item.category));
    }

    // Subcategory filter
    if (filters.subcategories.length > 0) {
      filtered = filtered.filter(item => filters.subcategories.includes(item.subcategory));
    }

    // Price filter
    filtered = filtered.filter(item =>
      item.price >= filters.priceMin && item.price <= filters.priceMax
    );

    // Condition filter
    if (filters.conditions.length > 0) {
      filtered = filtered.filter(item => filters.conditions.includes(item.condition));
    }

    // City filter
    if (filters.cities.length > 0) {
      filtered = filtered.filter(item => filters.cities.includes(item.location));
    }

    // Brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter(item => filters.brands.includes(item.brand));
    }

    // Size filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(item => filters.sizes.includes(item.size));
    }

    // Color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter(item => filters.colors.includes(item.color));
    }

    // Material filter
    if (filters.materials.length > 0) {
      filtered = filtered.filter(item => filters.materials.includes(item.material));
    }

    // Delivery available filter
    if (filters.deliveryAvailable) {
      filtered = filtered.filter(item => item.delivery_available === true);
    }

    // Negotiable filter
    if (filters.negotiable) {
      filtered = filtered.filter(item => item.negotiable === true);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default:
        // Keep default order
        break;
    }

    setItems(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: SecondhandFilters) => {
    setFilters(newFilters);
  };

  // Calculate dynamic data for filters
  const priceRange = useMemo(() => {
    if (allItems.length === 0) return { min: 0, max: 10000 };
    const prices = allItems.map(item => item.price).filter(p => p > 0);
    return {
      min: Math.floor(Math.min(...prices) / 50) * 50,
      max: Math.ceil(Math.max(...prices) / 50) * 50
    };
  }, [allItems]);

  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    allItems.forEach(item => {
      if (item.brand) brandsSet.add(item.brand);
    });
    return Array.from(brandsSet).sort();
  }, [allItems]);

  const availableSizes = useMemo(() => {
    const sizesSet = new Set<string>();
    allItems.forEach(item => {
      if (item.size) sizesSet.add(item.size);
    });
    return Array.from(sizesSet).sort();
  }, [allItems]);

  const availableColors = useMemo(() => {
    const colorsSet = new Set<string>();
    allItems.forEach(item => {
      if (item.color) colorsSet.add(item.color);
    });
    return Array.from(colorsSet).sort();
  }, [allItems]);

  const availableMaterials = useMemo(() => {
    const materialsSet = new Set<string>();
    allItems.forEach(item => {
      if (item.material) materialsSet.add(item.material);
    });
    return Array.from(materialsSet).sort();
  }, [allItems]);

  // Calculate counts for filter options
  const filterCounts = useMemo(() => {
    const counts = {
      categories: {} as Record<string, number>,
      subcategories: {} as Record<string, number>,
      conditions: {} as Record<string, number>,
      cities: {} as Record<string, number>,
      brands: {} as Record<string, number>,
      sizes: {} as Record<string, number>,
      colors: {} as Record<string, number>,
      materials: {} as Record<string, number>,
    };

    items.forEach(item => {
      if (item.category) counts.categories[item.category] = (counts.categories[item.category] || 0) + 1;
      if (item.subcategory) counts.subcategories[item.subcategory] = (counts.subcategories[item.subcategory] || 0) + 1;
      if (item.condition) counts.conditions[item.condition] = (counts.conditions[item.condition] || 0) + 1;
      if (item.location) counts.cities[item.location] = (counts.cities[item.location] || 0) + 1;
      if (item.brand) counts.brands[item.brand] = (counts.brands[item.brand] || 0) + 1;
      if (item.size) counts.sizes[item.size] = (counts.sizes[item.size] || 0) + 1;
      if (item.color) counts.colors[item.color] = (counts.colors[item.color] || 0) + 1;
      if (item.material) counts.materials[item.material] = (counts.materials[item.material] || 0) + 1;
    });

    return counts;
  }, [items]);

  const totalItems = useCountUp({ end: items.length, duration: 2000, startOnView: false });
  const activeListings = useCountUp({ end: Math.floor(items.length * 0.85), duration: 2000, startOnView: false });
  const avgViews = useCountUp({ end: 158, duration: 1500, startOnView: false });

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header />

      {/* Hero Banner Section - Same gradient as Properties/Cars/Laptops */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CategoryIcon className="h-12 w-12 text-white drop-shadow-lg" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                {config.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                {config.description}
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center bg-white rounded-full shadow-2xl overflow-hidden">
                <div className="absolute right-4 h-5 w-5 text-muted-foreground">
                  {isSearching ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </div>
                <Input
                  type="text"
                  placeholder="חפש לפי תיאור, מותג או מיקום..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 pr-12 pl-4 h-14 text-lg rounded-full focus-visible:ring-0"
                />
              </div>

              {searchQuery && (
                <p className="text-center text-sm text-white/80 mt-2">
                  חיפוש אוטומטי מופעל - התוצאות מתעדכנות בזמן אמת
                </p>
              )}
            </div>

            {/* Quick Subcategories */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {config.subcategories.map((subcategory) => (
                <button
                  key={subcategory}
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      subcategories: prev.subcategories.includes(subcategory)
                        ? prev.subcategories.filter(s => s !== subcategory)
                        : [...prev.subcategories, subcategory]
                    }));
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filters.subcategories.includes(subcategory)
                      ? "bg-white text-primary shadow-lg"
                      : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                  }`}
                >
                  {subcategory}
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{totalItems.count}+</div>
                <div className="text-sm text-white/80">מוצרים זמינים</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{activeListings.count}+</div>
                <div className="text-sm text-white/80">מודעות פעילות</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{avgViews.count}+</div>
                <div className="text-sm text-white/80">ממוצע צפיות</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Subcategory Navigation - Only for categories with subcategoryGroups */}
      {config.subcategoryGroups && (
        <section className="bg-card border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-end gap-2 mb-6 text-primary">
              <span className="font-medium">כל {config.title}</span>
              <CategoryIcon className="h-5 w-5" />
              <span className="text-muted-foreground">›</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-right" dir="rtl">
              {Object.entries(config.subcategoryGroups).map(([groupName, items]) => (
                <div key={groupName} className="space-y-3">
                  <h3 className="font-bold text-foreground">{groupName}</h3>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item}>
                        <button
                          onClick={() => {
                            setFilters(prev => ({
                              ...prev,
                              subcategories: [item]
                            }));
                            setSelectedSubcategory(item);
                          }}
                          className={`text-sm hover:text-primary transition-colors ${
                            filters.subcategories.includes(item) ? "text-primary font-medium" : "text-muted-foreground"
                          }`}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <main className="container mx-auto px-4 py-6">
        {/* Mobile Filters Button */}
        <div className="lg:hidden mb-4">
          <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="ml-2 h-4 w-4" />
                סינון ומיון
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>סינון תוצאות</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
              <SecondhandSidebarFilter 
                  counts={filterCounts}
                  onFilterChange={handleFilterChange}
                  priceRange={priceRange}
                  availableBrands={availableBrands}
                  availableSizes={availableSizes}
                  availableColors={availableColors}
                  availableMaterials={availableMaterials}
                  categoryType={category || undefined}
                  selectedSubcategory={filters.subcategories.length > 0 ? filters.subcategories[0] : undefined}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">מיון לפי</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="date">רלוונטיות</SelectItem>
                <SelectItem value="price-low">מחיר נמוך-גבוה</SelectItem>
                <SelectItem value="price-high">מחיר גבוה-נמוך</SelectItem>
                <SelectItem value="newest">הכי חדש</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-muted-foreground">{items.length.toLocaleString()} תוצאות</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block">
            <SecondhandSidebarFilter 
              counts={filterCounts}
              onFilterChange={handleFilterChange}
              priceRange={priceRange}
              availableBrands={availableBrands}
              availableSizes={availableSizes}
              availableColors={availableColors}
              availableMaterials={availableMaterials}
              categoryType={category || undefined}
              selectedSubcategory={filters.subcategories.length > 0 ? filters.subcategories[0] : undefined}
            />
          </div>

          {/* Items Grid */}
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : currentItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">לא נמצאו מוצרים</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-end" dir="rtl">
                {currentItems.map((item) => (
                  <SecondhandCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => handlePageChange(i + 1)}
                        isActive={currentPage === i + 1}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SecondhandCategory;
