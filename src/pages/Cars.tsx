import { useState, useMemo, useEffect, useRef } from "react";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import { CarCard } from "@/components/CarCard";
import { CarSidebar, SidebarFilters } from "@/components/CarSidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Search, Loader2, TrendingUp, Filter } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSaveSearch } from "@/hooks/useSaveSearch";
import carImage1 from "@/assets/item-car.jpg";

interface Car {
  id: string;
  manufacturer: string | null;
  model: string;
  year: number;
  hand: number;
  km: number;
  fuel_type: string | null;
  transmission: string | null;
  condition: string | null;
  category: string | null;
  vehicle_type: string | null;
  price: string | null;
  location: string;
  description: string | null;
  features: string[] | null;
  images: string[] | null;
  status: string;
  clicks_count?: number;
}

const Cars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { saveSearch } = useSaveSearch();
  const [sidebarFilters, setSidebarFilters] = useState<SidebarFilters>({
    manufacturers: [],
    yearFrom: "",
    yearTo: "",
    priceMin: 0,
    priceMax: 300000,
    fuelTypes: [],
    transmissions: [],
    hands: [],
    kmMin: 0,
    kmMax: 300000,
    features: [],
    vehicleTypes: [],
    conditions: [],
    categories: [],
  });
  const itemsPerPage = 10;

  // Fetch cars from Supabase
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      
      // Fetch promoted cars with fair rotation
      const { data: promotedData } = await supabase
        .from("cars")
        .select("*")
        .eq("status", "active")
        .eq("is_promoted", true)
        .gte("promotion_end_date", new Date().toISOString())
        .order("promotion_impressions", { ascending: true })
        .order("last_top_position_at", { ascending: true, nullsFirst: true })
        .order("id", { ascending: true })
        .limit(3);

      // Fetch regular cars
      const { data: regularData, error } = await supabase
        .from("cars")
        .select("*")
        .eq("status", "active")
        .or(`is_promoted.is.null,is_promoted.eq.false,promotion_end_date.lt.${new Date().toISOString()}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching cars:", error);
      } else {
        // Update impressions only for the first promoted car (top position)
        if (promotedData && promotedData.length > 0) {
          const topCar = promotedData[0];
          await supabase.functions.invoke('increment-impression', {
            body: { table: 'cars', id: topCar.id }
          });
        }

        const allCars = [...(promotedData || []), ...(regularData || [])];
        setCars(allCars);
      }
      setLoading(false);
    };

    fetchCars();
  }, []);
  
  // Calculate counts for filter options
  const filterCounts = useMemo(() => {
    const counts = {
      manufacturers: {} as Record<string, number>,
      fuelTypes: {} as Record<string, number>,
      transmissions: {} as Record<string, number>,
      hands: {} as Record<string, number>,
      features: {} as Record<string, number>,
    };

    cars.forEach(car => {
      // Count manufacturers
      if (car.manufacturer) {
        counts.manufacturers[car.manufacturer] = (counts.manufacturers[car.manufacturer] || 0) + 1;
      }
      
      // Count fuel types
      if (car.fuel_type) {
        counts.fuelTypes[car.fuel_type] = (counts.fuelTypes[car.fuel_type] || 0) + 1;
      }
      
      // Count transmissions
      if (car.transmission) {
        counts.transmissions[car.transmission] = (counts.transmissions[car.transmission] || 0) + 1;
      }
      
      // Count hands
      const handLabel = `יד ${car.hand}`;
      counts.hands[handLabel] = (counts.hands[handLabel] || 0) + 1;
      
      // Count features
      if (car.features) {
        car.features.forEach(feature => {
          counts.features[feature] = (counts.features[feature] || 0) + 1;
        });
      }
    });

    return counts;
  }, [cars]);
  
  // Generate popular suggestions from existing cars
  const popularSuggestions = useMemo(() => {
    const brandCounts = new Map<string, number>();
    const modelCounts = new Map<string, number>();
    
    cars.forEach(car => {
      if (car.manufacturer) {
        brandCounts.set(car.manufacturer, (brandCounts.get(car.manufacturer) || 0) + 1);
      }
      const fullName = `${car.manufacturer || ''} ${car.model}`.trim();
      modelCounts.set(fullName, (modelCounts.get(fullName) || 0) + 1);
    });
    
    const topBrands = Array.from(brandCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([brand]) => brand);
    
    const topModels = Array.from(modelCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([model]) => model);
    
    return [...topBrands, ...topModels];
  }, [cars]);

  // Filter suggestions based on search query
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return popularSuggestions
      .filter(suggestion => suggestion.toLowerCase().includes(query))
      .slice(0, 8);
  }, [searchQuery, popularSuggestions]);

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
        category: "cars",
        resultsCount: filteredCars.length
      });
    }
  }, [debouncedSearchQuery]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(filteredSuggestions[selectedSuggestionIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };
  
  // Filter and sort cars
  const filteredCars = useMemo(() => {
    let filtered = cars.filter((car) => {
      // Search query filter
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        const fullName = `${car.manufacturer || ''} ${car.model}`.toLowerCase();
        const matchesSearch = 
          fullName.includes(query) ||
          (car.description && car.description.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }
      
      // Sidebar manufacturers filter
      if (sidebarFilters.manufacturers.length > 0 && !sidebarFilters.manufacturers.some(m => car.manufacturer === m)) {
        return false;
      }
      
      // Category filter
      if (sidebarFilters.categories.length > 0 && !sidebarFilters.categories.some(c => car.category === c)) {
        return false;
      }
      
      // Year filters
      if (sidebarFilters.yearFrom && car.year < parseInt(sidebarFilters.yearFrom)) {
        return false;
      }
      if (sidebarFilters.yearTo && car.year > parseInt(sidebarFilters.yearTo)) {
        return false;
      }
      
      // Price filters
      const carPrice = car.price ? parseFloat(car.price) : 0;
      if (carPrice < sidebarFilters.priceMin || carPrice > sidebarFilters.priceMax) {
        return false;
      }
      
      // Sidebar fuel types filter
      if (sidebarFilters.fuelTypes.length > 0 && !sidebarFilters.fuelTypes.some(f => car.fuel_type === f)) {
        return false;
      }
      
      // Sidebar transmissions filter
      if (sidebarFilters.transmissions.length > 0 && !sidebarFilters.transmissions.some(t => car.transmission === t)) {
        return false;
      }
      
      // Hand filter
      if (sidebarFilters.hands.length > 0) {
        const handMatches = sidebarFilters.hands.some(h => {
          if (h === "יד ראשונה") return car.hand === 1;
          if (h === "יד שנייה") return car.hand === 2;
          if (h === "יד שלישית") return car.hand === 3;
          if (h === "יד 4+") return car.hand >= 4;
          return false;
        });
        if (!handMatches) return false;
      }
      
      // KM filters
      if (car.km < sidebarFilters.kmMin || car.km > sidebarFilters.kmMax) {
        return false;
      }
      
      // Vehicle type filter
      if (sidebarFilters.vehicleTypes.length > 0 && !sidebarFilters.vehicleTypes.some(vt => car.vehicle_type === vt)) {
        return false;
      }
      
      // Condition filter
      if (sidebarFilters.conditions.length > 0 && !sidebarFilters.conditions.some(c => car.condition === c)) {
        return false;
      }
      
      // Features filter
      if (sidebarFilters.features.length > 0 && car.features) {
        const hasFeature = sidebarFilters.features.some(f => 
          car.features!.some(cf => cf.includes(f) || f.includes(cf))
        );
        if (!hasFeature) return false;
      }
      
      return true;
    });
    
    // Sort cars
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (parseFloat(a.price || "0") - parseFloat(b.price || "0")));
        break;
      case "price-high":
        filtered.sort((a, b) => (parseFloat(b.price || "0") - parseFloat(a.price || "0")));
        break;
      case "year":
        filtered.sort((a, b) => b.year - a.year);
        break;
      default:
        break;
    }
    
    return filtered;
  }, [cars, debouncedSearchQuery, sidebarFilters, sortBy]);
  
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);
  
  const handleSidebarFilterChange = (newFilters: SidebarFilters) => {
    setSidebarFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      <Header />
      
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                מצא את הרכב המושלם שלך
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                אלפי רכבים למכירה ממוכרים פרטיים וסוחרים מובילים
              </p>
            </div>
            
            {/* Search Bar with Autocomplete */}
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
                  ref={searchInputRef}
                  type="text"
                  placeholder="חפש לפי יצרן, דגם או תיאור..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                    setSelectedSuggestionIndex(-1);
                  }}
                  onFocus={() => searchQuery && setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  className="border-0 pr-12 pl-4 h-14 text-lg rounded-full focus-visible:ring-0"
                />
              </div>

              {/* Autocomplete Suggestions */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  {filteredSuggestions.map((suggestion, index) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full px-6 py-3 text-right hover:bg-accent/50 transition-colors flex items-center gap-3 ${
                        index === selectedSuggestionIndex ? 'bg-accent/50' : ''
                      }`}
                    >
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-foreground font-medium">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery && (
                <p className="text-center text-sm text-white/80 mt-2">
                  חיפוש אוטומטי מופעל - התוצאות מתעדכנות בזמן אמת
                </p>
              )}
            </div>

            {/* Quick Stats - Desktop */}
            <div className="hidden md:flex items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{cars.length}+</div>
                <div className="text-sm text-white/80">רכבים זמינים</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{Object.keys(filterCounts.manufacturers).length}+</div>
                <div className="text-sm text-white/80">יצרנים</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-white/80">מאומתים</div>
              </div>
            </div>

            {/* Quick Stats - Mobile */}
            <div className="flex md:hidden items-center justify-center gap-4 pt-2">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{cars.length}+</div>
                <div className="text-xs text-white/80">רכבים</div>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div className="text-center">
                <div className="text-lg font-bold text-white">{Object.keys(filterCounts.manufacturers).length}+</div>
                <div className="text-xs text-white/80">יצרנים</div>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div className="text-center">
                <div className="text-lg font-bold text-white">100%</div>
                <div className="text-xs text-white/80">מאומתים</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-4 md:py-6">

        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0 mb-4 md:mb-6 mt-4 md:mt-8">
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-foreground mb-1">רכבים למכירה</h2>
            <p className="text-sm md:text-base text-muted-foreground">{filteredCars.length.toLocaleString()} תוצאות</p>
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
                  <SheetTitle>סינון רכבים</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <CarSidebar onFilterChange={handleSidebarFilterChange} counts={filterCounts} />
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
                  <SelectItem value="date">תאריך</SelectItem>
                  <SelectItem value="price-low">מחיר נמוך-גבוה</SelectItem>
                  <SelectItem value="price-high">מחיר גבוה-נמוך</SelectItem>
                  <SelectItem value="year">שנה</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar - Hidden on mobile, shown in sheet */}
          <div className="hidden lg:block">
            <CarSidebar onFilterChange={handleSidebarFilterChange} counts={filterCounts} />
          </div>
          
          {/* Cars List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : currentCars.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">לא נמצאו רכבים התואמים את הקריטריונים</p>
              </div>
            ) : (
              currentCars.map((car) => {
                const carForCard = {
                  id: car.id,
                  image: car.images && car.images.length > 0 ? car.images[0] : carImage1,
                  title: `${car.manufacturer || ''} ${car.model}`.trim(),
                  subtitle: `${car.transmission || ''} ${car.fuel_type || ''}`,
                  manufacturer: car.manufacturer,
                  model: car.model,
                  year: car.year,
                  hand: `יד ${car.hand}`,
                  km: car.km,
                  fuel_type: car.fuel_type,
                  transmission: car.transmission,
                  condition: car.condition,
                  price: parseFloat((car.price || "0").replace(/,/g, "")),
                  location: car.location,
                  features: car.features || [],
                  clicks_count: car.clicks_count,
                };
                return <CarCard key={car.id} car={carForCard} />;
              })
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
      <MobileNav />
    </div>
  );
};

export default Cars;
