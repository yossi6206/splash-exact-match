import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CarFilters } from "@/components/CarFilters";
import { CarCard } from "@/components/CarCard";
import { CarSidebar } from "@/components/CarSidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import carImage1 from "@/assets/item-car.jpg";

const mockCars = [
  {
    id: 1,
    image: carImage1,
    title: "יונדאי i10",
    subtitle: "Open Sky אוט' 1.2 (87 כ\"ס)",
    year: 2019,
    hand: "יד 1",
    price: 61500,
    features: ["סטט בתקופה", "גלגל מגנזיום", "בקרת שיוט מרחק"],
  },
  {
    id: 2,
    image: carImage1,
    title: "הונדה סיוויק",
    subtitle: "Comfort אוט' היבריד 5 דל' 1.8 (142 כ\"ס)",
    year: 2012,
    hand: "יד 3",
    price: 23800,
    features: ["סטט בתקופה", "גלגל מגנזיום", "בקרת שיוט מרחק"],
  },
  {
    id: 3,
    image: carImage1,
    title: "ב מ וו סדרה 7",
    subtitle: "730d M Sport אוט' 3.0 (265 כ\"ס)",
    year: 2016,
    hand: "יד 2",
    price: 189000,
    features: ["סטט בתקופה", "גלגל מגנזיום", "בקרת שיוט מרחק"],
  },
];

const Cars = () => {
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(mockCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCars = mockCars.slice(startIndex, endIndex);

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
        <CarFilters />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6 mt-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">רכבים למכירה</h1>
            <p className="text-muted-foreground">54,885 תוצאות</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
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

          {/* Sidebar */}
          <CarSidebar />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cars;
