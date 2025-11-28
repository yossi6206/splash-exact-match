import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CarCard } from "@/components/CarCard";
import { CarSidebar, SidebarFilters } from "@/components/CarSidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Search, Loader2 } from "lucide-react";
import carImage1 from "@/assets/item-car.jpg";
import heroCar from "@/assets/hero-car.jpg";
import carsBanner from "@/assets/cars-banner.jpg";
import carsHeroBanner from "@/assets/cars-hero-modern.jpg";
import carModern1 from "@/assets/car-modern-1.jpg";

const carBrands = [
  { name: "טויוטה", models: ["קורולה", "קמרי", "יאריס", "RAV4", "אורליס"] },
  { name: "מזדה", models: ["3", "6", "CX-5", "CX-3", "2"] },
  { name: "יונדאי", models: ["i10", "i20", "i30", "טוסון", "סנטה פה", "אקסנט"] },
  { name: "קיה", models: ["ספורטאז'", "סורנטו", "סטוניק", "פיקנטו", "סיד"] },
  { name: "הונדה", models: ["סיוויק", "אקורד", "CR-V", "ג'אז", "HR-V"] },
  { name: "ניסאן", models: ["ג'וק", "קשקאי", "מיקרה", "אקס-טרייל", "ליף"] },
  { name: "פולקסווגן", models: ["גולף", "פולו", "טיגואן", "פאסאט", "ג'טה"] },
  { name: "שקודה", models: ["אוקטביה", "פאביה", "סופרב", "קודיאק", "קאמיק"] },
  { name: "סיאט", models: ["לאון", "איביזה", "ארונה", "אטקה", "טרקו"] },
  { name: "ב מ וו", models: ["סדרה 1", "סדרה 3", "סדרה 5", "סדרה 7", "X1", "X3", "X5"] },
  { name: "מרצדס", models: ["A-Class", "C-Class", "E-Class", "GLA", "GLC", "GLE"] },
  { name: "אאודי", models: ["A3", "A4", "A6", "Q3", "Q5", "Q7"] },
  { name: "רנו", models: ["קליאו", "מגאן", "קפצ'ור", "סניק", "טליסמן"] },
  { name: "פיג'ו", models: ["208", "308", "2008", "3008", "508"] },
  { name: "סיטרואן", models: ["C3", "C4", "C5", "C3 Aircross", "Berlingo"] }
];

const transmissions = ["אוט'", "ידני", "רובוטרון"];
const fuelTypes = ["היבריד", "בנזין", "דיזל", "חשמלי"];
const allFeatures = [
  "סטט בתקופה", "גלגל מגנזיום", "בקרת שיוט מרחק", "חיישני רוורס",
  "מצלמת רוורס", "מושב מחומם", "הגה מחומם", "פתיחה ללא מפתח",
  "מערכת ניווט", "מערכת בידור", "גג פנורמי", "עור מלא",
  "מושבים חשמליים", "מושב נהג חשמלי", "מערכת שמע פרימיום"
];
const images = [carImage1, heroCar, carsBanner, carModern1];

const generateCars = () => {
  const cars = [];
  for (let i = 1; i <= 110; i++) {
    const brand = carBrands[Math.floor(Math.random() * carBrands.length)];
    const model = brand.models[Math.floor(Math.random() * brand.models.length)];
    const transmission = transmissions[Math.floor(Math.random() * transmissions.length)];
    const fuelType = fuelTypes[Math.floor(Math.random() * fuelTypes.length)];
    const image = images[Math.floor(Math.random() * images.length)];
    const year = Math.floor(Math.random() * 14) + 2010; // 2010-2023
    const handNum = Math.floor(Math.random() * 4) + 1; // 1-4
    const hand = `יד ${handNum}`;
    const engineSize = (Math.random() * 2 + 1).toFixed(1); // 1.0-3.0
    const horsePower = Math.floor(Math.random() * 200) + 80; // 80-280
    const basePrice = Math.floor(Math.random() * 250000) + 20000; // 20k-270k
    
    const numFeatures = Math.floor(Math.random() * 5) + 3;
    const features = [...allFeatures].sort(() => 0.5 - Math.random()).slice(0, numFeatures);
    
    cars.push({
      id: i,
      image: image,
      title: `${brand.name} ${model}`,
      subtitle: `${transmission} ${fuelType} ${engineSize} (${horsePower} כ"ס)`,
      year: year,
      hand: hand,
      price: basePrice,
      features: features,
    });
  }
  return cars;
};

const mockCars = generateCars();

const Cars = () => {
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
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
  });
  const itemsPerPage = 10;
  
  // Debounce search query for auto-filtering
  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(false);
      setCurrentPage(1); // Reset to first page on search
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);
  
  // Filter and sort cars
  const filteredCars = useMemo(() => {
    let filtered = mockCars.filter((car) => {
      // Search query filter
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        const matchesSearch = 
          car.title.toLowerCase().includes(query) ||
          car.subtitle.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      // Sidebar manufacturers filter
      if (sidebarFilters.manufacturers.length > 0 && !sidebarFilters.manufacturers.some(m => car.title.includes(m))) {
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
      if (car.price < sidebarFilters.priceMin || car.price > sidebarFilters.priceMax) {
        return false;
      }
      
      // Sidebar fuel types filter
      if (sidebarFilters.fuelTypes.length > 0 && !sidebarFilters.fuelTypes.some(f => car.subtitle.includes(f))) {
        return false;
      }
      
      // Sidebar transmissions filter
      if (sidebarFilters.transmissions.length > 0 && !sidebarFilters.transmissions.some(t => car.subtitle.includes(t))) {
        return false;
      }
      
      // Hand filter
      if (sidebarFilters.hands.length > 0) {
        const handMatches = sidebarFilters.hands.some(h => {
          if (h === "יד ראשונה") return car.hand === "יד 1";
          if (h === "יד שנייה") return car.hand === "יד 2";
          if (h === "יד שלישית") return car.hand === "יד 3";
          if (h === "יד 4+") return parseInt(car.hand.replace("יד ", "")) >= 4;
          return false;
        });
        if (!handMatches) return false;
      }
      
      // Features filter
      if (sidebarFilters.features.length > 0) {
        const hasFeature = sidebarFilters.features.some(f => 
          car.features.some(cf => cf.includes(f) || f.includes(cf))
        );
        if (!hasFeature) return false;
      }
      
      return true;
    });
    
    // Sort cars
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "year":
        filtered.sort((a, b) => b.year - a.year);
        break;
      default:
        break;
    }
    
    return filtered;
  }, [debouncedSearchQuery, sidebarFilters, sortBy]);
  
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);
  
  const handleSidebarFilterChange = (newFilters: SidebarFilters) => {
    setSidebarFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent py-16 md:py-20">
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
                  placeholder="חפש לפי יצרן, דגם או תיאור..."
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
                <div className="text-3xl font-bold text-white">110+</div>
                <div className="text-sm text-white/80">רכבים זמינים</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">15+</div>
                <div className="text-sm text-white/80">יצרנים</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-white/80">מאומתים</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-6">
        {/* Category Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium whitespace-nowrap border-b-4 border-primary">
            פריטים ומסחרים
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            אופנועים
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            קטנועים
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            משאיות
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            כלי שיט
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            מיוחדים
          </button>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6 mt-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">רכבים למכירה</h2>
            <p className="text-muted-foreground">{filteredCars.length.toLocaleString()} תוצאות</p>
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
                  <SelectItem value="year">שנה</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar - Right side for RTL */}
          <CarSidebar onFilterChange={handleSidebarFilterChange} />
          
          {/* Cars List */}
          <div className="space-y-4">
            {currentCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
            
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

export default Cars;
