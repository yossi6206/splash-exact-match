import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import FreelancerCard from "@/components/FreelancerCard";
import { FreelancerFilters } from "@/components/FreelancerFilters";
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
import { Search, Users, Loader2, Filter } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSaveSearch } from "@/hooks/useSaveSearch";
import type { Tables } from "@/integrations/supabase/types";

type Freelancer = Tables<"freelancers">;

const ITEMS_PER_PAGE = 12;

const Freelancers = () => {
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { saveSearch } = useSaveSearch();

  useEffect(() => {
    fetchFreelancers();
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

  // Save search to history
  useEffect(() => {
    if (debouncedSearchQuery) {
      saveSearch({
        searchQuery: debouncedSearchQuery,
        category: "freelancers",
        resultsCount: freelancers.length
      });
    }
  }, [debouncedSearchQuery]);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      
      // Fetch promoted freelancers with fair rotation
      const { data: promotedData } = await supabase
        .from("freelancers")
        .select("*")
        .eq("availability", "available")
        .eq("is_promoted", true)
        .gte("promotion_end_date", new Date().toISOString())
        .order("promotion_impressions", { ascending: true })
        .order("last_top_position_at", { ascending: true, nullsFirst: true })
        .order("id", { ascending: true })
        .limit(3);

      // Fetch regular freelancers with pagination
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      let query = supabase
        .from("freelancers")
        .select("*", { count: "exact" })
        .eq("availability", "available")
        .or(`is_promoted.is.null,is_promoted.eq.false,promotion_end_date.lt.${new Date().toISOString()}`)
        .range(startIndex, startIndex + ITEMS_PER_PAGE - 1);

      // Apply sorting
      if (sortBy === "newest") {
        query = query.order("created_at", { ascending: false });
      } else if (sortBy === "rating") {
        query = query.order("rating", { ascending: false });
      } else if (sortBy === "rate-low") {
        query = query.order("hourly_rate", { ascending: true });
      } else if (sortBy === "rate-high") {
        query = query.order("hourly_rate", { ascending: false });
      } else if (sortBy === "reviews") {
        query = query.order("total_reviews", { ascending: false });
      }

      const { data, error, count } = await query;

      if (error) throw error;

      // Update impressions only for the first promoted freelancer (top position)
      if (promotedData && promotedData.length > 0) {
        const topFreelancer = promotedData[0];
        await supabase.functions.invoke('increment-impression', {
          body: { table: 'freelancers', id: topFreelancer.id }
        });
      }

      // Combine promoted and regular freelancers
      const allFreelancers = [...(promotedData || []), ...(data || [])];
      
      // Apply search filter
      const filteredFreelancers = allFreelancers.filter(freelancer => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          freelancer.full_name?.toLowerCase().includes(query) ||
          freelancer.title?.toLowerCase().includes(query) ||
          freelancer.bio?.toLowerCase().includes(query) ||
          freelancer.category?.toLowerCase().includes(query) ||
          freelancer.skills?.some(skill => skill.toLowerCase().includes(query))
        );
      });
      
      setFreelancers(filteredFreelancers);
      setTotalCount(filteredFreelancers.length);
    } catch (error: any) {
      console.error("Error fetching freelancers:", error);
      toast.error("שגיאה בטעינת בעלי המקצוע");
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
      languages: {} as Record<string, number>,
    };

    freelancers.forEach(freelancer => {
      // Count by category
      if (freelancer.category) {
        counts.categories[freelancer.category] = (counts.categories[freelancer.category] || 0) + 1;
      }
      
      // Count locations
      if (freelancer.location) {
        counts.locations[freelancer.location] = (counts.locations[freelancer.location] || 0) + 1;
      }
      
      // Count languages
      if (freelancer.languages) {
        freelancer.languages.forEach(language => {
          counts.languages[language] = (counts.languages[language] || 0) + 1;
        });
      }
    });

    return counts;
  }, [freelancers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      <Header />
      
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent py-6 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-8">
            {/* Main Heading */}
            <div className="space-y-2 md:space-y-4">
              <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                מצא את בעל המקצוע המושלם
              </h1>
              <p className="text-sm md:text-xl text-white/90 max-w-2xl mx-auto">
                אלפי מומחים מנוסים בכל תחומי הפרילנס
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center bg-white rounded-full shadow-2xl overflow-hidden">
                <div className="absolute right-3 md:right-4 h-4 w-4 md:h-5 md:w-5 text-muted-foreground">
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 md:h-5 md:w-5" />
                  )}
                </div>
                <Input
                  type="text"
                  placeholder="תחום מקצועי, מיומנות או שם..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 pr-10 md:pr-12 pl-2 md:pl-4 h-12 md:h-14 text-base md:text-lg rounded-full focus-visible:ring-0"
                />
              </div>

              {searchQuery && (
                <p className="text-center text-xs md:text-sm text-white/80 mt-2">
                  חיפוש אוטומטי מופעל - התוצאות מתעדכנות בזמן אמת
                </p>
              )}
            </div>

            {/* Quick Stats - Desktop */}
            <div className="hidden md:flex items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{totalCount}+</div>
                <div className="text-sm text-white/80">בעלי מקצוע</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">4.8</div>
                <div className="text-sm text-white/80">דירוג ממוצע</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">95%</div>
                <div className="text-sm text-white/80">שביעות רצון</div>
              </div>
            </div>

            {/* Quick Stats - Mobile */}
            <div className="flex md:hidden items-center justify-center gap-4 pt-2">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{totalCount}+</div>
                <div className="text-xs text-white/80">בעלי מקצוע</div>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div className="text-center">
                <div className="text-lg font-bold text-white">4.8</div>
                <div className="text-xs text-white/80">דירוג</div>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div className="text-center">
                <div className="text-lg font-bold text-white">95%</div>
                <div className="text-xs text-white/80">שביעות רצון</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-4 md:py-6">

        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0 mb-4 md:mb-6 mt-4 md:mt-8">
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              בעלי מקצוע זמינים
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">{totalCount} תוצאות</p>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Filter className="w-4 h-4 ml-2" />
                  סינון
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>סינון בעלי מקצוע</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <FreelancerFilters counts={filterCounts} />
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm text-muted-foreground hidden sm:inline">מיון לפי</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 md:w-40 bg-background text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">חדש ביותר</SelectItem>
                  <SelectItem value="rating">דירוג גבוה</SelectItem>
                  <SelectItem value="reviews">מספר ביקורות</SelectItem>
                  <SelectItem value="rate-low">תעריף נמוך-גבוה</SelectItem>
                  <SelectItem value="rate-high">תעריף גבוה-נמוך</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar - Hidden on mobile, shown in sheet */}
          <div className="hidden lg:block">
            <FreelancerFilters counts={filterCounts} />
          </div>
          
          {/* Freelancers Grid */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">טוען בעלי מקצוע...</div>
              </div>
            ) : freelancers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Users className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground mb-4" />
                <p className="text-base md:text-lg text-muted-foreground">לא נמצאו בעלי מקצוע</p>
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                  {freelancers.map((freelancer) => (
                    <FreelancerCard
                      key={freelancer.id}
                      id={freelancer.id}
                      full_name={freelancer.full_name}
                      avatar_url={freelancer.avatar_url || undefined}
                      title={freelancer.title}
                      bio={freelancer.bio || undefined}
                      skills={freelancer.skills}
                      user_id={freelancer.user_id}
                      hourly_rate={freelancer.hourly_rate}
                      rating={Number(freelancer.rating)}
                      total_reviews={freelancer.total_reviews || 0}
                      location={freelancer.location || undefined}
                      category={freelancer.category}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent className="gap-1">
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} h-8 md:h-10 text-sm`}
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
                            className="cursor-pointer h-8 w-8 md:h-10 md:w-10 text-sm"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} h-8 md:h-10 text-sm`}
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
      <MobileNav />
    </div>
  );
};

export default Freelancers;