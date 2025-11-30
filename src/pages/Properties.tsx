import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { PropertySidebarFilter, PropertyFilters as PropertySidebarFilters } from "@/components/PropertySidebarFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Properties = () => {
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarFilters, setSidebarFilters] = useState<PropertySidebarFilters>({
    propertyTypes: [],
    rooms: [],
    priceMin: 0,
    priceMax: 5000000,
    sizeMin: 0,
    sizeMax: 300,
    yearFrom: "",
    yearTo: "",
    floors: [],
    conditions: [],
    cities: [],
    features: [],
  });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      console.error("Error fetching properties:", error);
      toast.error("שגיאה באחזור הנכסים");
    } finally {
      setLoading(false);
    }
  };

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
  
  // Calculate counts for filter options
  const filterCounts = useMemo(() => {
    const counts = {
      propertyTypes: {} as Record<string, number>,
      rooms: {} as Record<string, number>,
      cities: {} as Record<string, number>,
      features: {} as Record<string, number>,
    };

    properties.forEach(property => {
      // Count property types
      if (property.property_type) {
        counts.propertyTypes[property.property_type] = (counts.propertyTypes[property.property_type] || 0) + 1;
      }
      
      // Count rooms
      const roomKey = property.rooms >= 6 ? "6+" : property.rooms?.toString();
      if (roomKey) {
        counts.rooms[roomKey] = (counts.rooms[roomKey] || 0) + 1;
      }
      
      // Count cities
      const city = property.location?.split(',')[0]?.trim();
      if (city) {
        counts.cities[city] = (counts.cities[city] || 0) + 1;
      }
      
      // Count features
      if (property.features) {
        property.features.forEach((feature: string) => {
          counts.features[feature] = (counts.features[feature] || 0) + 1;
        });
      }
    });

    return counts;
  }, [properties]);
  
  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let filtered = properties.filter((property) => {
      // Search query filter
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        const matchesSearch = 
          property.title?.toLowerCase().includes(query) ||
          property.description?.toLowerCase().includes(query) ||
          property.location?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      // Property type filter
      if (sidebarFilters.propertyTypes.length > 0 && !sidebarFilters.propertyTypes.includes(property.property_type)) {
        return false;
      }
      
      // Rooms filter
      if (sidebarFilters.rooms.length > 0) {
        const roomMatch = sidebarFilters.rooms.some(r => {
          if (r === "6+") return property.rooms >= 6;
          return property.rooms === parseInt(r);
        });
        if (!roomMatch) return false;
      }
      
      // Price filter
      const price = property.price;
      if (price < sidebarFilters.priceMin || price > sidebarFilters.priceMax) {
        return false;
      }
      
      // Size filter
      if (property.size && (property.size < sidebarFilters.sizeMin || property.size > sidebarFilters.sizeMax)) {
        return false;
      }
      
      // Floor filter
      if (sidebarFilters.floors.length > 0) {
        const floorMatch = sidebarFilters.floors.some(f => {
          if (f === "קרקע") return property.floor === 0;
          if (f === "1-3") return property.floor >= 1 && property.floor <= 3;
          if (f === "4-7") return property.floor >= 4 && property.floor <= 7;
          if (f === "8+") return property.floor >= 8;
          return false;
        });
        if (!floorMatch) return false;
      }
      
      // Condition filter
      if (sidebarFilters.conditions.length > 0 && !sidebarFilters.conditions.includes(property.condition)) {
        return false;
      }
      
      // City filter
      if (sidebarFilters.cities.length > 0) {
        const cityMatch = sidebarFilters.cities.some(city => property.location?.includes(city));
        if (!cityMatch) return false;
      }
      
      // Features filter
      if (sidebarFilters.features.length > 0 && property.features) {
        const hasFeature = sidebarFilters.features.every(f => 
          property.features.some((pf: string) => pf.includes(f) || f.includes(pf))
        );
        if (!hasFeature) return false;
      }
      
      return true;
    });
    
    // Sort properties
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => parseInt(a.price.replace(/,/g, '')) - parseInt(b.price.replace(/,/g, '')));
        break;
      case "price-high":
        filtered.sort((a, b) => parseInt(b.price.replace(/,/g, '')) - parseInt(a.price.replace(/,/g, '')));
        break;
      case "rooms":
        filtered.sort((a, b) => b.rooms - a.rooms);
        break;
      default:
        break;
    }
    
    return filtered;
  }, [properties, debouncedSearchQuery, sidebarFilters, sortBy]);
  
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);
  
  const handleSidebarFilterChange = (newFilters: PropertySidebarFilters) => {
    setSidebarFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                מצא את הבית המושלם שלך
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                אלפי נכסים למכירה ולהשכרה ממיטב המתווכים והבעלים
              </p>
            </div>
            
            {/* Search Bar with Auto-complete */}
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
                  placeholder="חפש לפי עיר, שכונה או תיאור..."
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
                <div className="text-3xl font-bold text-white">{properties.length}+</div>
                <div className="text-sm text-white/80">נכסים זמינים</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{Object.keys(filterCounts.cities).length}+</div>
                <div className="text-sm text-white/80">ערים</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{filteredProperties.length}</div>
                <div className="text-sm text-white/80">תוצאות</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-6">
        {/* Category Tabs - Hidden since we now have filter tags in hero */}
        
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">נכסים למכירה</h2>
            <p className="text-muted-foreground">{filteredProperties.length.toLocaleString()} תוצאות</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">מיון לפי</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">תאריך</SelectItem>
                  <SelectItem value="price-low">מחיר נמוך-גבוה</SelectItem>
                  <SelectItem value="price-high">מחיר גבוה-נמוך</SelectItem>
                  <SelectItem value="rooms">מספר חדרים</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar - Right side for RTL */}
          <PropertySidebarFilter onFilterChange={handleSidebarFilterChange} counts={filterCounts} />
          
          {/* Properties List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : currentProperties.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">לא נמצאו נכסים התואמים את החיפוש</p>
              </div>
            ) : (
              <>
                {currentProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={{
                      ...property,
                      image: property.images && property.images[0] ? property.images[0] : undefined,
                      propertyType: property.property_type,
                      subtitle: property.description?.substring(0, 100) || '',
                    }} 
                  />
                ))}
              </>
            )}
            
            {/* Pagination */}
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Properties;