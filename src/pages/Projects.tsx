import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Search, SlidersHorizontal, Building2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import ProjectCard from "@/components/ProjectCard";
import ProjectSidebarFilter from "@/components/ProjectSidebarFilter";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useSaveSearch } from "@/hooks/useSaveSearch";
import projectsHeroBanner from "@/assets/projects-hero-banner.jpg";

interface Project {
  id: string;
  title: string;
  developer_name: string;
  location: string;
  neighborhood: string | null;
  project_type: string;
  listing_type: string;
  min_price: number | null;
  max_price: number | null;
  min_rooms: number | null;
  max_rooms: number | null;
  delivery_date: string | null;
  description: string | null;
  images: string[] | null;
  features: string[] | null;
  amenities: string[] | null;
  total_units: number | null;
  available_units: number | null;
  floors_count: number | null;
  buildings_count: number | null;
  parking_included: boolean | null;
  storage_included: boolean | null;
  is_promoted: boolean | null;
  promotion_end_date: string | null;
  created_at: string;
}

interface SidebarFilters {
  listingType: string[];
  projectType: string[];
  location: string[];
  priceRange: [number, number];
  roomsRange: [number, number];
  deliveryYear: string[];
  amenities: string[];
}

const listingTypeCategories = [
  { id: "all", label: "הכל" },
  { id: "מכירה", label: "מכירה" },
  { id: "השכרה", label: "השכרה" },
  { id: "מסחרי", label: "מסחרי" },
];

const Projects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sidebarFilters, setSidebarFilters] = useState<SidebarFilters>({
    listingType: [],
    projectType: [],
    location: [],
    priceRange: [0, 10000000],
    roomsRange: [1, 6],
    deliveryYear: [],
    amenities: [],
  });

  const loaderRef = useRef<HTMLDivElement>(null);
  const { saveSearch } = useSaveSearch();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      saveSearch({ searchQuery: debouncedSearchQuery, category: "projects" });
    }
  }, [debouncedSearchQuery, saveSearch]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(12);
  }, [activeCategory, debouncedSearchQuery, sidebarFilters]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("status", "active")
        .order("is_promoted", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Filter by active category
    if (activeCategory !== "all") {
      filtered = filtered.filter((p) => p.listing_type === activeCategory);
    }

    // Filter by search query
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.developer_name.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query) ||
          (p.neighborhood && p.neighborhood.toLowerCase().includes(query))
      );
    }

    // Apply sidebar filters
    if (sidebarFilters.listingType.length > 0) {
      filtered = filtered.filter((p) =>
        sidebarFilters.listingType.includes(p.listing_type)
      );
    }

    if (sidebarFilters.projectType.length > 0) {
      filtered = filtered.filter((p) =>
        sidebarFilters.projectType.includes(p.project_type)
      );
    }

    if (sidebarFilters.location.length > 0) {
      filtered = filtered.filter((p) =>
        sidebarFilters.location.includes(p.location)
      );
    }

    // Price filter
    filtered = filtered.filter((p) => {
      const minPrice = p.min_price || 0;
      return (
        minPrice >= sidebarFilters.priceRange[0] &&
        minPrice <= sidebarFilters.priceRange[1]
      );
    });

    // Rooms filter
    filtered = filtered.filter((p) => {
      const minRooms = p.min_rooms || 1;
      return (
        minRooms >= sidebarFilters.roomsRange[0] &&
        minRooms <= sidebarFilters.roomsRange[1]
      );
    });

    if (sidebarFilters.amenities.length > 0) {
      filtered = filtered.filter((p) =>
        sidebarFilters.amenities.some((a) => p.amenities?.includes(a))
      );
    }

    return filtered;
  }, [projects, activeCategory, debouncedSearchQuery, sidebarFilters]);

  const displayedProjects = filteredProjects.slice(0, displayCount);
  const hasMore = displayCount < filteredProjects.length;

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loadingMore) {
        setLoadingMore(true);
        setTimeout(() => {
          setDisplayCount((prev) => prev + 12);
          setLoadingMore(false);
        }, 500);
      }
    },
    [hasMore, loadingMore]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  const handleSidebarFilterChange = (filters: SidebarFilters) => {
    setSidebarFilters(filters);
  };

  const filterCounts = useMemo(() => {
    const counts = {
      projectTypes: {} as Record<string, number>,
      locations: {} as Record<string, number>,
      listingTypes: {} as Record<string, number>,
      amenities: {} as Record<string, number>,
    };

    projects.forEach((p) => {
      counts.projectTypes[p.project_type] =
        (counts.projectTypes[p.project_type] || 0) + 1;
      counts.locations[p.location] = (counts.locations[p.location] || 0) + 1;
      counts.listingTypes[p.listing_type] =
        (counts.listingTypes[p.listing_type] || 0) + 1;
      p.amenities?.forEach((a) => {
        counts.amenities[a] = (counts.amenities[a] || 0) + 1;
      });
    });

    return counts;
  }, [projects]);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <MobileHeader />

      {/* Hero Section */}
      <section
        className="relative h-[300px] md:h-[400px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${projectsHeroBanner})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4 w-full max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            פרויקטים חדשים בכל רחבי הארץ
          </h1>

          {/* Category Tabs */}
          <div className="flex justify-center gap-2 md:gap-4 mb-6 flex-wrap">
            {listingTypeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                }}
                className={`px-4 py-2 rounded-full text-sm md:text-base transition-all ${
                  activeCategory === cat.id
                    ? "bg-white text-primary font-semibold"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="חיפוש לפי חברה, פרויקט או מיקום"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 md:h-14 pr-12 rounded-full bg-white text-foreground text-right placeholder:text-muted-foreground"
            />
            <Button
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 md:h-10 md:w-10"
            >
              <Search className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-20 self-start">
              <ProjectSidebarFilter
                onFilterChange={handleSidebarFilterChange}
                filterCounts={filterCounts}
              />
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  סינון תוצאות
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>סינון פרויקטים</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <ProjectSidebarFilter
                    onFilterChange={handleSidebarFilterChange}
                    filterCounts={filterCounts}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Projects Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {loading ? (
                  <Skeleton className="h-5 w-32" />
                ) : (
                  `נמצאו ${filteredProjects.length} פרויקטים`
                )}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : displayedProjects.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>

                {/* Infinite Scroll Loader */}
                <div ref={loaderRef} className="flex justify-center py-8">
                  {loadingMore && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>טוען עוד פרויקטים...</span>
                    </div>
                  )}
                  {!hasMore && filteredProjects.length > 12 && (
                    <p className="text-muted-foreground">הגעת לסוף הרשימה</p>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">לא נמצאו פרויקטים</h3>
                <p className="text-muted-foreground">
                  נסה לשנות את הסינון או החיפוש
                </p>
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

export default Projects;