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

const mockLaptops = [
  {
    id: 1,
    image: laptopImage,
    title: "MacBook Pro 14",
    subtitle: 'מעבד M3 Pro, 18GB RAM, 512GB SSD, מסך 14.2"',
    price: 9200,
    condition: "כמו חדש",
    location: "תל אביב",
    features: ["במצב מושלם", "חבילה מלאה", "אחריות יבואן"],
  },
  {
    id: 2,
    image: laptopImage,
    title: "Lenovo ThinkPad X1",
    subtitle: 'Intel i7, 16GB RAM, 512GB SSD, מסך 14"',
    price: 4500,
    condition: "משומש",
    location: "חיפה",
    features: ["במצב טוב", "תיק כלול", "מטען מקורי"],
  },
  {
    id: 3,
    image: laptopImage,
    title: "HP Pavilion 15",
    subtitle: 'Intel i5, 8GB RAM, 256GB SSD, מסך 15.6"',
    price: 2800,
    condition: "משומש",
    location: "ירושלים",
    features: ["במצב טוב", "מתאים לסטודנטים"],
  },
];

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