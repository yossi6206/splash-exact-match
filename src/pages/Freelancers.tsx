import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
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
import { Search, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Freelancer = Tables<"freelancers">;

const ITEMS_PER_PAGE = 12;

const Freelancers = () => {
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchFreelancers();
  }, [currentPage, sortBy]);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      
      let query = supabase
        .from("freelancers")
        .select("*", { count: "exact" })
        .eq("availability", "available")
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

      setFreelancers(data || []);
      setTotalCount(count || 0);
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
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header />
      
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                מצא את בעל המקצוע המושלם
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                אלפי מומחים מנוסים בכל תחומי הפרילנס
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center bg-white rounded-full shadow-2xl overflow-hidden">
                <Search className="absolute right-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="תחום מקצועי, מיומנות או שם..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 pr-12 pl-4 h-14 text-lg rounded-full focus-visible:ring-0"
                />
                <Button
                  className="ml-2 rounded-full px-8 h-10 font-bold"
                  size="lg"
                >
                  חפש
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-8 pt-4">
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
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-6">
        {/* Category Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium whitespace-nowrap border-b-4 border-primary">
            כל התחומים
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            עיצוב גרפי
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            פיתוח
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            כתיבה
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            שיווק
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            וידאו
          </button>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6 mt-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              בעלי מקצוע זמינים
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
          {/* Sidebar - Right side for RTL */}
          <FreelancerFilters counts={filterCounts} />
          
          {/* Freelancers Grid */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">טוען בעלי מקצוע...</div>
              </div>
            ) : freelancers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Users className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">לא נמצאו בעלי מקצוע</p>
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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

export default Freelancers;
