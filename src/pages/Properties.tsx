import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PropertyFilters } from "@/components/PropertyFilters";
import PropertyCard from "@/components/PropertyCard";
import { PropertySidebar } from "@/components/PropertySidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";

const mockProperties = [
  {
    id: 1,
    image: property1,
    price: "2,450,000",
    location: "תל אביב, נווה צדק",
    rooms: 4,
  },
  {
    id: 2,
    image: property2,
    price: "1,890,000",
    location: "רמת גן, בורסה",
    rooms: 3,
  },
  {
    id: 3,
    image: property3,
    price: "3,200,000",
    location: "תל אביב, פלורנטין",
    rooms: 5,
  },
  {
    id: 4,
    image: property4,
    price: "1,650,000",
    location: "חולון, קריית אליעזר",
    rooms: 3,
  },
];

const Properties = () => {
  const [sortBy, setSortBy] = useState("date");

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
          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
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