import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LaptopFilters } from "@/components/LaptopFilters";
import { LaptopCard } from "@/components/LaptopCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import laptopImage from "@/assets/item-laptop.jpg";
import phoneImage from "@/assets/item-phone.jpg";
import heroLaptopImage from "@/assets/hero-laptop.jpg";
import heroPhoneImage from "@/assets/hero-phone.jpg";

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

const Laptops = () => {
  const [sortBy, setSortBy] = useState("date");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(mockLaptops.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLaptops = mockLaptops.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">מחשבים ניידים - לפטופים ומחשבים</h1>
          <p className="text-muted-foreground">1,598 תוצאות</p>
        </div>

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
                <LaptopFilters />
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
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <LaptopFilters />
            </div>
          </aside>

          {/* Laptops Grid */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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

export default Laptops;