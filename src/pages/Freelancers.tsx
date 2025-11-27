import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import FreelancerCard from "@/components/FreelancerCard";
import { FreelancerFilters } from "@/components/FreelancerFilters";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Freelancer = Tables<"freelancers">;

const ITEMS_PER_PAGE = 12;

const Freelancers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchFreelancers();
  }, [currentPage]);

  const fetchFreelancers = async () => {
    try {
      setLoading(true);
      
      // Get total count
      const { count } = await supabase
        .from("freelancers")
        .select("*", { count: "exact", head: true })
        .eq("availability", "available");
      
      setTotalCount(count || 0);

      // Get paginated data
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from("freelancers")
        .select("*")
        .eq("availability", "available")
        .order("rating", { ascending: false })
        .range(from, to);

      if (error) throw error;
      setFreelancers(data || []);
    } catch (error) {
      console.error("Error fetching freelancers:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(250,70%,55%)] via-[hsl(240,65%,50%)] to-[hsl(200,70%,50%)]">
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              מצא את העבודה החלומית שלך
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              אלפי משרות מובילות ממיטב החברות בישראל
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-full shadow-2xl p-2 flex items-center gap-2 max-w-3xl mx-auto">
              <div className="flex-1 flex items-center gap-2 px-4">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="תפקיד, חברה או מילות חפש..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button 
                size="lg" 
                onClick={handleSearch}
                className="rounded-full px-8 bg-[hsl(250,70%,55%)] hover:bg-[hsl(250,70%,50%)]"
              >
                חפש
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  89%
                </div>
                <div className="text-white/80 text-lg">
                  שיעור השמה
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  +3,200
                </div>
                <div className="text-white/80 text-lg">
                  הצעות מועמדות
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  +10
                </div>
                <div className="text-white/80 text-lg">
                  משרות פעילות
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Freelancers Grid with Filters */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-right">פרילנסרים מובילים</h2>
          <p className="text-muted-foreground text-right">מצא את המומחה המושלם לפרויקט שלך</p>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <FreelancerFilters />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : freelancers.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg mb-4">
                  אין פרילנסרים זמינים כרגע
                </p>
                <Button asChild>
                  <a href="/dashboard">הצטרף כפרילנסר</a>
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {freelancers.map((freelancer) => (
                    <FreelancerCard
                      key={freelancer.id}
                      id={freelancer.id}
                      full_name={freelancer.full_name}
                      avatar_url={freelancer.avatar_url || undefined}
                      title={freelancer.title}
                      bio={freelancer.bio || undefined}
                      skills={freelancer.skills}
                      hourly_rate={freelancer.hourly_rate}
                      rating={Number(freelancer.rating)}
                      total_reviews={freelancer.total_reviews || 0}
                      location={freelancer.location || undefined}
                      category={freelancer.category}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center" dir="rtl">
                    <Pagination>
                      <PaginationContent className="gap-2">
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>

                        {[...Array(totalPages)].map((_, index) => {
                          const page = index + 1;
                          
                          // Show first page, last page, current page, and pages around current
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
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
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return null;
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
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Freelancers;
