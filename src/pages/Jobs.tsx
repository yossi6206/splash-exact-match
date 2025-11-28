import { useState, useEffect } from "react";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import { JobFilters } from "@/components/JobFilters";
import { JobCard } from "@/components/JobCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";


const Jobs = () => {
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchJobs();
  }, [currentPage, sortBy]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const startIndex = (currentPage - 1) * itemsPerPage;
      
      let query = supabase
        .from("jobs")
        .select("*", { count: "exact" })
        .eq("status", "active")
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

      // Transform data to match JobCard expectations
      const transformedJobs = (data || []).map((job) => ({
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

      setJobs(transformedJobs);
      setTotalCount(count || 0);
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
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header />
      
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent py-16 md:py-20 animate-gradient">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-secondary/80 to-accent/80 animate-[gradient_8s_ease_infinite] opacity-50" 
             style={{
               backgroundSize: '200% 200%',
               animation: 'gradient 8s ease infinite'
             }} 
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Heading */}
            <div className="space-y-4 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                מצא את העבודה החלומית שלך
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto animate-fade-in animation-delay-200">
                אלפי משרות מובילות ממיטב החברות בישראל
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto animate-fade-in animation-delay-400">
              <div className="relative flex items-center bg-white rounded-full shadow-2xl overflow-hidden hover-scale">
                <Search className="absolute right-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="תפקיד, חברה או מילות מפתח..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 pr-12 pl-4 h-14 text-lg rounded-full focus-visible:ring-0"
                />
                <Button
                  className="ml-2 rounded-full px-8 h-10 font-bold transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  חפש
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-8 pt-4 animate-fade-in animation-delay-600">
              <div className="text-center hover-scale cursor-default">
                <div className="text-3xl font-bold text-white transition-all duration-300">{totalCount}+</div>
                <div className="text-sm text-white/80">משרות פעילות</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center hover-scale cursor-default">
                <div className="text-3xl font-bold text-white transition-all duration-300">3,200+</div>
                <div className="text-sm text-white/80">חברות מובילות</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center hover-scale cursor-default">
                <div className="text-3xl font-bold text-white transition-all duration-300">89%</div>
                <div className="text-sm text-white/80">שיעור השמה</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated decorative elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />
      </section>

      <main className="container mx-auto px-4 py-6">
        {/* Category Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium whitespace-nowrap border-b-4 border-primary">
            כל המשרות
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            היי-טק
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            שיווק
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            מכירות
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            פיננסים
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            ניהול
          </button>
        </div>

        {/* Filters */}
        <JobFilters />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6 mt-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-primary" />
              משרות פתוחות
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
                  <SelectItem value="date">תאריך פרסום</SelectItem>
                  <SelectItem value="salary-high">שכר גבוה-נמוך</SelectItem>
                  <SelectItem value="salary-low">שכר נמוך-גבוה</SelectItem>
                  <SelectItem value="relevance">רלוונטיות</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Job Cards */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">טוען משרות...</div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Briefcase className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">לא נמצאו משרות</p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {jobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                        onClick={() => setCurrentPage(page)}
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
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Jobs;
