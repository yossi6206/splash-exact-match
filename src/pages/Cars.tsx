import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CarFilters, FilterState } from "@/components/CarFilters";
import { CarCard } from "@/components/CarCard";
import { CarSidebar, SidebarFilters } from "@/components/CarSidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import carImage1 from "@/assets/item-car.jpg";
import heroCar from "@/assets/hero-car.jpg";
import carsBanner from "@/assets/cars-banner.jpg";

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
const images = [carImage1, heroCar, carsBanner];

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
  const [topFilters, setTopFilters] = useState<FilterState>({
    manufacturer: "",
    yearFrom: "",
    yearTo: "",
    priceMin: 0,
    priceMax: 300000,
    fuelType: "",
    transmission: "",
  });
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
  
  // Combine filters from top bar and sidebar
  const filteredCars = useMemo(() => {
    let filtered = mockCars.filter((car) => {
      // Top bar manufacturer filter
      if (topFilters.manufacturer && topFilters.manufacturer !== "all" && !car.title.includes(topFilters.manufacturer)) {
        return false;
      }
      
      // Sidebar manufacturers filter
      if (sidebarFilters.manufacturers.length > 0 && !sidebarFilters.manufacturers.some(m => car.title.includes(m))) {
        return false;
      }
      
      // Year filters (use sidebar if set, otherwise top bar)
      const yearFrom = sidebarFilters.yearFrom || topFilters.yearFrom;
      const yearTo = sidebarFilters.yearTo || topFilters.yearTo;
      if (yearFrom && car.year < parseInt(yearFrom)) {
        return false;
      }
      if (yearTo && car.year > parseInt(yearTo)) {
        return false;
      }
      
      // Price filters (use sidebar values)
      if (car.price < sidebarFilters.priceMin || car.price > sidebarFilters.priceMax) {
        return false;
      }
      
      // Top bar fuel type filter
      if (topFilters.fuelType && topFilters.fuelType !== "all" && !car.subtitle.includes(topFilters.fuelType)) {
        return false;
      }
      
      // Sidebar fuel types filter
      if (sidebarFilters.fuelTypes.length > 0 && !sidebarFilters.fuelTypes.some(f => car.subtitle.includes(f))) {
        return false;
      }
      
      // Top bar transmission filter
      if (topFilters.transmission && topFilters.transmission !== "all" && !car.subtitle.includes(topFilters.transmission)) {
        return false;
      }
      
      // Sidebar transmissions filter
      if (sidebarFilters.transmissions.length > 0 && !sidebarFilters.transmissions.some(t => car.subtitle.includes(t))) {
        return false;
      }
      
      // Hand filter (sidebar only)
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
      
      // Features filter (sidebar only)
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
  }, [topFilters, sidebarFilters, sortBy]);
  
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);
  
  const handleTopFilterChange = (newFilters: FilterState) => {
    setTopFilters(newFilters);
    setCurrentPage(1);
  };
  
  const handleSidebarFilterChange = (newFilters: SidebarFilters) => {
    setSidebarFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
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

        {/* Filters */}
        <CarFilters onFilterChange={handleTopFilterChange} />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6 mt-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">רכבים למכירה</h1>
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
