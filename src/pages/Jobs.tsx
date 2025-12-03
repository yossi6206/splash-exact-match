import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import { JobSidebar } from "@/components/JobSidebar";
import { JobCard } from "@/components/JobCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Briefcase, Loader2, Filter } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSaveSearch } from "@/hooks/useSaveSearch";


const Jobs = () => {
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const { saveSearch } = useSaveSearch();
  const itemsPerPage = 10;

  // Calculate counts for filter options
  const filterCounts = useMemo(() => {
    const counts = {
      categories: {} as Record<string, number>,
      jobTypes: {} as Record<string, number>,
      scopes: {} as Record<string, number>,
      locations: {} as Record<string, number>,
    };

    jobs.forEach(job => {
      // Count by industry/category
      if (job.industry) counts.categories[job.industry] = (counts.categories[job.industry] || 0) + 1;
      
      // Count job types
      counts.jobTypes[job.job_type] = (counts.jobTypes[job.job_type] || 0) + 1;
      
      // Count scopes
      counts.scopes[job.scope] = (counts.scopes[job.scope] || 0) + 1;
      
      // Count locations
      counts.locations[job.location] = (counts.locations[job.location] || 0) + 1;
    });

    return counts;
  }, [jobs]);

  useEffect(() => {
    fetchJobs();
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
        category: "jobs",
        resultsCount: jobs.length
      });
    }
  }, [debouncedSearchQuery]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      // Fetch promoted jobs with fair rotation
      const { data: promotedData } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "active")
        .eq("is_promoted", true)
        .gte("promotion_end_date", new Date().toISOString())
        .order("promotion_impressions", { ascending: true })
        .order("last_top_position_at", { ascending: true, nullsFirst: true })
        .order("id", { ascending: true })
        .limit(3);

      // Fetch regular jobs with pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      let query = supabase
        .from("jobs")
        .select("*", { count: "exact" })
        .eq("status", "active")
        .or(`is_promoted.is.null,is_promoted.eq.false,promotion_end_date.lt.${new Date().toISOString()}`)
        .range(startIndex, startIndex + itemsPerPage - 1);

      // Apply sorting
      if (sortBy === "date") {
        query = query.order("created_at", { ascending: false });
      } else if (sortBy === "salary-high") {
        query = query.order("salary_max", { ascending: false, nullsFirst: false });
      } else if (sortBy === "salary-low") {
        query = query.order("salary_min", { ascending: true, nullsFirst: false });
      }

      const { data, error, count } = await query;

      if (error) throw error;

      // Update impressions only for the first promoted job (top position)
      if (promotedData && promotedData.length > 0) {
        const topJob = promotedData[0];
        await supabase.functions.invoke('increment-impression', {
          body: { table: 'jobs', id: topJob.id }
        });
      }

      // Combine promoted and regular jobs
      const allJobsData = [...(promotedData || []), ...(data || [])];

      // Transform data to match JobCard expectations
      const transformedJobs = allJobsData.map((job) => ({
        id: job.id,
        company: job.company_name,
        title: job.title,
        location: job.location,
        type: job.job_type,
        scope: job.scope,
        salary: job.salary_min && job.salary_max 
          ? `₪${job.salary_min.toLocaleString()}-${job.salary_max.toLocaleString()}`
          : null,
        experience: job.experience_min && job.experience_max
          ? `${job.experience_min}-${job.experience_max} שנות ניסיון`
          : "לא צוין",
        postedDate: getTimeAgo(job.created_at),
        requirements: job.requirements || [],
      }));

      // Apply search filter
      const filteredJobs = transformedJobs.filter(job => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          job.title?.toLowerCase().includes(query) ||
          job.company?.toLowerCase().includes(query) ||
          job.location?.toLowerCase().includes(query)
        );
      });

      setJobs(filteredJobs);
      setTotalCount(filteredJobs.length);
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      toast.error("שגיאה בטעינת המשרות");
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "היום";
    if (diffDays === 1) return "אתמול";
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
    if (diffDays < 30) return `לפני ${Math.floor(diffDays / 7)} שבועות`;
    return `לפני ${Math.floor(diffDays / 30)} חודשים`;
  };
  
  const totalPages = Math.ceil(totalCount / itemsPerPage);

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
                מצא את העבודה החלומית שלך
              </h1>
              <p className="text-sm md:text-xl text-white/90 max-w-2xl mx-auto">
                אלפי משרות מובילות ממיטב החברות בישראל
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
                  placeholder="תפקיד, חברה או מילות מפתח..."
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
                <div className="text-sm text-white/80">משרות פעילות</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">3,200+</div>
                <div className="text-sm text-white/80">חברות מובילות</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">89%</div>
                <div className="text-sm text-white/80">שיעור השמה</div>
              </div>
            </div>

            {/* Quick Stats - Mobile */}
            <div className="flex md:hidden items-center justify-center gap-4 pt-2">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{totalCount}+</div>
                <div className="text-xs text-white/80">משרות</div>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div className="text-center">
                <div className="text-lg font-bold text-white">3.2K+</div>
                <div className="text-xs text-white/80">חברות</div>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div className="text-center">
                <div className="text-lg font-bold text-white">89%</div>
                <div className="text-xs text-white/80">השמה</div>
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
              <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              משרות פתוחות
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
                  <SheetTitle>סינון משרות</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <JobSidebar counts={filterCounts} />
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
                  <SelectItem value="date">תאריך פרסום</SelectItem>
                  <SelectItem value="salary-high">שכר גבוה-נמוך</SelectItem>
                  <SelectItem value="salary-low">שכר נמוך-גבוה</SelectItem>
                  <SelectItem value="relevance">רלוונטיות</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar - Hidden on mobile, shown in sheet */}
          <div className="hidden lg:block self-start sticky top-20">
            <JobSidebar counts={filterCounts} />
          </div>
          
          {/* Jobs List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">טוען משרות...</div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Briefcase className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground mb-4" />
                <p className="text-base md:text-lg text-muted-foreground">לא נמצאו משרות</p>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4 mb-8">
                {jobs.map((job) => (
                  <JobCard key={job.id} {...job} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent className="gap-1">
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                            onClick={() => setCurrentPage(page)}
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
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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

export default Jobs;