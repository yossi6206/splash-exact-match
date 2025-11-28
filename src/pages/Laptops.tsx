import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LaptopSidebarFilter } from "@/components/LaptopSidebarFilter";
import { LaptopCard } from "@/components/LaptopCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, Search, TrendingUp, Eye, Package } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useCountUp } from "@/hooks/useCountUp";
import laptopImage from "@/assets/item-laptop.jpg";
import phoneImage from "@/assets/item-phone.jpg";
import heroLaptopImage from "@/assets/hero-laptop.jpg";
import heroPhoneImage from "@/assets/hero-phone.jpg";
import laptopsHeroBanner from "@/assets/laptops-hero-banner.jpg";

const laptopBrands = ["MacBook Pro", "MacBook Air", "Dell XPS", "HP Pavilion", "Lenovo ThinkPad", "ASUS VivoBook", "Acer Aspire", "MSI Gaming", "Razer Blade", "Surface Laptop"];
const processors = ["M3 Pro", "M2", "M1", "Intel i9", "Intel i7", "Intel i5", "AMD Ryzen 9", "AMD Ryzen 7", "AMD Ryzen 5"];
const ramOptions = ["8GB", "16GB", "18GB", "32GB", "64GB"];
const storageOptions = ["256GB", "512GB", "1TB", "2TB"];
const screenSizes = ['13"', '13.3"', '14"', '14.2"', '15"', '15.6"', '16"', '17"'];
const conditions = ["כמו חדש", "משומש", "חדש באריזה", "משומש במצב טוב"];
const cities = ["תל אביב", "חיפה", "ירושלים", "באר שבע", "נתניה", "פתח תקווה", "ראשון לציון", "אשדוד", "רחובות", "בני ברק", "הרצליה", "כפר סבא", "רעננה", "מודיעין"];
const images = [laptopImage, phoneImage, heroLaptopImage, heroPhoneImage];

const generateLaptops = () => {
  const laptops = [];
  for (let i = 1; i <= 120; i++) {
    const brand = laptopBrands[Math.floor(Math.random() * laptopBrands.length)];
    const processor = processors[Math.floor(Math.random() * processors.length)];
    const ram = ramOptions[Math.floor(Math.random() * ramOptions.length)];
    const storage = storageOptions[Math.floor(Math.random() * storageOptions.length)];
    const screen = screenSizes[Math.floor(Math.random() * screenSizes.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const location = cities[Math.floor(Math.random() * cities.length)];
    const image = images[Math.floor(Math.random() * images.length)];
    const basePrice = Math.floor(Math.random() * 8000) + 2000;
    
    const featuresList = [
      ["במצב מושלם", "חבילה מלאה", "אחריות יבואן"],
      ["במצב טוב", "תיק כלול", "מטען מקורי"],
      ["מתאים לסטודנטים", "במצב מצוין"],
      ["שדרוג אחרון", "מעט שימוש", "כמו חדש"],
      ["אחריות עד שנה", "שירות מלא"],
      ["מושלם לעיצוב גרפי", "מסך רטינה"],
      ["גיימינג מתקדם", "כרטיס מסך חזק"],
      ["קל למשיאים", "נייד במיוחד"],
      ["מושלם לעבודה מהבית"],
      ["סוללה חדשה", "מקלדת מוארת"]
    ];
    
    const features = featuresList[Math.floor(Math.random() * featuresList.length)];
    
    laptops.push({
      id: i,
      image: image,
      title: `${brand} ${Math.floor(Math.random() * 20) + 10}`,
      subtitle: `מעבד ${processor}, ${ram} RAM, ${storage} SSD, מסך ${screen}`,
      price: basePrice,
      condition: condition,
      location: location,
      features: features,
    });
  }
  return laptops;
};

const mockLaptops = generateLaptops();

const quickFilters = [
  "Apple MacBook",
  "Gaming Laptops",
  "עסקי ונייד",
  "למעצבים",
  "תחת ₪3,000",
  "חדש באריזה"
];

const Laptops = () => {
  const [sortBy, setSortBy] = useState("date");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 12;
  
  // Calculate counts for filter options
  const filterCounts = useMemo(() => {
    const counts = {
      brands: {} as Record<string, number>,
      processors: {} as Record<string, number>,
      ramOptions: {} as Record<string, number>,
      storageOptions: {} as Record<string, number>,
      screenSizes: {} as Record<string, number>,
      conditions: {} as Record<string, number>,
      cities: {} as Record<string, number>,
    };

    mockLaptops.forEach(laptop => {
      // Count brands
      const brand = laptop.title.split(' ')[0];
      counts.brands[brand] = (counts.brands[brand] || 0) + 1;
      
      // Count processors, RAM, storage, screen from subtitle
      const subtitle = laptop.subtitle;
      processors.forEach(proc => {
        if (subtitle.includes(proc)) counts.processors[proc] = (counts.processors[proc] || 0) + 1;
      });
      ramOptions.forEach(ram => {
        if (subtitle.includes(ram)) counts.ramOptions[ram] = (counts.ramOptions[ram] || 0) + 1;
      });
      storageOptions.forEach(storage => {
        if (subtitle.includes(storage)) counts.storageOptions[storage] = (counts.storageOptions[storage] || 0) + 1;
      });
      screenSizes.forEach(size => {
        if (subtitle.includes(size)) counts.screenSizes[size] = (counts.screenSizes[size] || 0) + 1;
      });
      
      // Count condition
      counts.conditions[laptop.condition] = (counts.conditions[laptop.condition] || 0) + 1;
      
      // Count cities
      counts.cities[laptop.location] = (counts.cities[laptop.location] || 0) + 1;
    });

    return counts;
  }, []);
  
  const totalLaptops = useCountUp({ end: mockLaptops.length, duration: 2000, startOnView: false });
  const activeListings = useCountUp({ end: Math.floor(mockLaptops.length * 0.85), duration: 2000, startOnView: false });
  const avgViews = useCountUp({ end: 245, duration: 1500, startOnView: false });
  
  const totalPages = Math.ceil(mockLaptops.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLaptops = mockLaptops.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                מצא את המחשב הנייד המושלם
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                מבחר ענק של מחשבים ניידים חדשים ומשומשים במחירים הכי טובים
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center bg-white rounded-full shadow-2xl overflow-hidden">
                <Search className="absolute right-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="חפש לפי יצרן, דגם או תיאור..."
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
                <div className="text-3xl font-bold text-white">{totalLaptops.count}+</div>
                <div className="text-sm text-white/80">מחשבים זמינים</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{activeListings.count}+</div>
                <div className="text-sm text-white/80">מודעות פעילות</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{avgViews.count}+</div>
                <div className="text-sm text-white/80">ממוצע צפיות</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-6">
        {/* Mobile Filters Button */}
        <div className="lg:hidden mb-4">
          <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="ml-2 h-4 w-4" />
                סינון ומיון
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>סינון תוצאות</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <LaptopSidebarFilter counts={filterCounts} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">מיון לפי</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                <SelectItem value="date">רלוונטיות</SelectItem>
                <SelectItem value="price-low">מחיר נמוך-גבוה</SelectItem>
                <SelectItem value="price-high">מחיר גבוה-נמוך</SelectItem>
                <SelectItem value="newest">הכי חדש</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-muted-foreground">{mockLaptops.length.toLocaleString()} תוצאות</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar Filters - Desktop */}
          <LaptopSidebarFilter counts={filterCounts} />

          {/* Laptops Grid */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-end" dir="rtl">
              {currentLaptops.map((laptop) => (
                <LaptopCard key={laptop.id} laptop={laptop} />
              ))}
            </div>
            
            {/* Pagination */}
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {[...Array(Math.min(totalPages, 5))].map((_, i) => (
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

export default Laptops;
