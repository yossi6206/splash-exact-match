import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import BusinessCard from "@/components/BusinessCard";
import { BusinessFilters } from "@/components/BusinessFilters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Building2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Business = Tables<"businesses">;

const ITEMS_PER_PAGE = 12;

const Businesses = () => {
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchBusinesses();
  }, [currentPage, sortBy]);

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

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      
      // Fetch promoted businesses
      const { data: promotedData } = await supabase
        .from("businesses")
        .select("*")
        .eq("status", "active")
        .eq("is_promoted", true)
        .gte("promotion_end_date", new Date().toISOString())
        .order("promotion_impressions", { ascending: true })
        .order("last_top_position_at", { ascending: true, nullsFirst: true })
        .order("id", { ascending: true })
        .limit(3);

      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      let regularQuery = supabase
        .from("businesses")
        .select("*", { count: "exact" })
        .eq("status", "active")
        .or(`is_promoted.is.null,is_promoted.eq.false,promotion_end_date.lt.${new Date().toISOString()}`)
        .range(startIndex, startIndex + ITEMS_PER_PAGE - 1);

      // Apply sorting
      if (sortBy === "newest") {
        regularQuery = regularQuery.order("created_at", { ascending: false });
      } else if (sortBy === "price-low") {
        regularQuery = regularQuery.order("price", { ascending: true });
      } else if (sortBy === "price-high") {
        regularQuery = regularQuery.order("price", { ascending: false });
      } else if (sortBy === "revenue") {
        regularQuery = regularQuery.order("annual_revenue", { ascending: false, nullsFirst: false });
      } else if (sortBy === "profit") {
        regularQuery = regularQuery.order("monthly_profit", { ascending: false, nullsFirst: false });
      }

      const { data: regularData, error, count } = await regularQuery;

      if (error) throw error;

      // Update impressions only for the first promoted business (top position)
      if (promotedData && promotedData.length > 0) {
        const topBusiness = promotedData[0];
        await supabase.functions.invoke('increment-impression', {
          body: { table: 'businesses', id: topBusiness.id }
        });
      }

      const allBusinesses = [...(promotedData || []), ...(regularData || [])];
      
      // Apply search filter
      const filteredBusinesses = allBusinesses.filter(business => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          business.title?.toLowerCase().includes(query) ||
          business.description?.toLowerCase().includes(query) ||
          business.category?.toLowerCase().includes(query) ||
          business.location?.toLowerCase().includes(query) ||
          business.business_type?.toLowerCase().includes(query)
        );
      });
      
      setBusinesses(filteredBusinesses);
      setTotalCount(filteredBusinesses.length);
    } catch (error: any) {
      console.error("Error fetching businesses:", error);
      toast.error("שגיאה בטעינת העסקים");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Calculate counts for filter options
  const filterCounts = useMemo(() => {
    const counts = {
      categories: {} as Record<string, number>,
      locations: {} as Record<string, number>,
      businessTypes: {} as Record<string, number>,
    };

    businesses.forEach(business => {
      // Count by category
      if (business.category) {
        counts.categories[business.category] = (counts.categories[business.category] || 0) + 1;
      }
      
      // Count locations
      if (business.location) {
        counts.locations[business.location] = (counts.locations[business.location] || 0) + 1;
      }
      
      // Count business types
      if (business.business_type) {
        counts.businessTypes[business.business_type] = (counts.businessTypes[business.business_type] || 0) + 1;
      }
    });

    return counts;
  }, [businesses]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header />
      
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-danidin font-black text-white leading-tight drop-shadow-lg">
                עסקים למכירה
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                מצא את העסק המושלם שלך - מאות הזדמנויות עסקיות מנצחות
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
                  placeholder="סוג עסק, מיקום או קטגוריה..."
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

            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{totalCount}+</div>
                <div className="text-sm text-white/80">עסקים למכירה</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">מגוון</div>
                <div className="text-sm text-white/80">קטגוריות</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">מאומתים</div>
                <div className="text-sm text-white/80">עסקים רווחיים</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-6">
        {/* Category Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium whitespace-nowrap border-b-4 border-primary">
            כל העסקים
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            מזון ומשקאות
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            קמעונאי
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            שירותים
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            טכנולוגיה
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            בריאות ויופי
          </button>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6 mt-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-primary" />
              עסקים זמינים
            </h2>
            <p className="text-muted-foreground">{totalCount} תוצאות</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">מיון לפי</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">חדשים ביותר</SelectItem>
                  <SelectItem value="price-low">מחיר נמוך-גבוה</SelectItem>
                  <SelectItem value="price-high">מחיר גבוה-נמוך</SelectItem>
                  <SelectItem value="revenue">מחזור גבוה</SelectItem>
                  <SelectItem value="profit">רווח גבוה</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar - Right side for RTL */}
          <BusinessFilters counts={filterCounts} />
          
          {/* Business Grid */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">טוען עסקים...</div>
              </div>
            ) : businesses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Building2 className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">לא נמצאו עסקים</p>
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {businesses.map((business) => (
                    <BusinessCard
                      key={business.id}
                      id={business.id}
                      title={business.title}
                      description={business.description || undefined}
                      business_type={business.business_type}
                      category={business.category}
                      price={business.price}
                      location={business.location}
                      annual_revenue={business.annual_revenue || undefined}
                      monthly_profit={business.monthly_profit || undefined}
                      years_operating={business.years_operating || undefined}
                      employees_count={business.employees_count || undefined}
                      images={business.images || undefined}
                      clicks_count={business.clicks_count || 0}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Businesses;