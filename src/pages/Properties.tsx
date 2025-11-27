import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PropertyFilters } from "@/components/PropertyFilters";
import PropertyCard from "@/components/PropertyCard";
import { PropertySidebar } from "@/components/PropertySidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";

const mockProperties = [
  {
    id: 1,
    image: property1,
    title: "דירת 4 חדרים בנווה צדק",
    subtitle: "דירה מרווחת ומוארת במיקום מעולה",
    propertyType: "דירה",
    condition: "משופץ",
    price: "2,450,000",
    location: "תל אביב, נווה צדק",
    rooms: 4,
    size: 120,
    floor: 3,
    features: ["מעלית", "חניה", "מרפסת"],
  },
  {
    id: 2,
    image: property2,
    title: "דירת 3 חדרים בבורסה",
    subtitle: "קרוב לתחבורה ציבורית ושירותים",
    propertyType: "דירה",
    condition: "במצב טוב",
    price: "1,890,000",
    location: "רמת גן, בורסה",
    rooms: 3,
    size: 95,
    floor: 5,
    features: ["מעלית", "מחסן", "ממ״ד"],
  },
  {
    id: 3,
    image: property3,
    title: "דירת 5 חדרים בפלורנטין",
    subtitle: "דירת גג עם מרפסת גדולה",
    propertyType: "פנטהאוז",
    condition: "חדש מקבלן",
    price: "3,200,000",
    location: "תל אביב, פלורנטין",
    rooms: 5,
    size: 140,
    floor: 6,
    features: ["מעלית", "חניה", "מרפסת שמש"],
  },
  {
    id: 4,
    image: property4,
    title: "דירת 3 חדרים בקריית אליעזר",
    subtitle: "דירה שקטה ומוארת",
    propertyType: "דירה",
    condition: "משופץ",
    price: "1,650,000",
    location: "חולון, קריית אליעזר",
    rooms: 3,
    size: 85,
    floor: 2,
    features: ["מרפסת", "מחסן"],
  },
];

const Properties = () => {
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(mockProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = mockProperties.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Category Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium whitespace-nowrap border-b-4 border-primary">
            דירות למכירה
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            דירות להשכרה
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            דירות שותפים
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            בתים פרטיים
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            מסחרי
          </button>
        </div>

        {/* Filters */}
        <PropertyFilters />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6 mt-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">נכסים למכירה</h1>
            <p className="text-muted-foreground">12,543 תוצאות</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Properties List */}
          <div className="space-y-4">
            {currentProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
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
          <PropertySidebar />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Properties;