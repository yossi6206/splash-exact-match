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

const propertyTypes = ["דירה", "פנטהאוז", "דירת גן", "דירת גג", "בית פרטי", "דופלקס"];
const conditions = ["חדש מקבלן", "משופץ", "במצב טוב", "דורש שיפוץ", "במצב מצוין"];
const cities = ["תל אביב", "ירושלים", "חיפה", "באר שבע", "נתניה", "פתח תקווה", "ראשון לציון", "אשדוד", "רחובות", "בני ברק", "הרצליה", "כפר סבא", "רעננה", "מודיעין", "רמת גן", "גבעתיים", "חולון"];
const neighborhoods = ["נווה צדק", "פלורנטין", "בורסה", "קריית אליעזר", "רמת אביב", "צהלה", "רמת חן", "שכון ג׳", "גבעת שאול", "הדר", "נווה שאנן", "רמת גן", "קריית מנחם", "נאות אפקה", "רמת פולג"];
const images = [property1, property2, property3, property4];

const generateProperties = () => {
  const properties = [];
  for (let i = 1; i <= 110; i++) {
    const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
    const image = images[Math.floor(Math.random() * images.length)];
    const rooms = Math.floor(Math.random() * 5) + 2; // 2-6 חדרים
    const size = Math.floor(Math.random() * 100) + 60; // 60-160 מ״ר
    const floor = Math.floor(Math.random() * 10) + 1; // קומה 1-10
    const basePrice = Math.floor(Math.random() * 3000000) + 800000; // 800k-3.8M
    const formattedPrice = basePrice.toLocaleString('he-IL');
    
    const allFeatures = ["מעלית", "חניה", "מרפסת", "מחסן", "ממ״ד", "מרפסת שמש", "נגיש לנכים", "משופץ", "אויר מרכזי"];
    const numFeatures = Math.floor(Math.random() * 4) + 2;
    const features = [...allFeatures].sort(() => 0.5 - Math.random()).slice(0, numFeatures);
    
    const subtitles = [
      "דירה מרווחת ומוארת במיקום מעולה",
      "קרוב לתחבורה ציבורית ושירותים",
      "דירה שקטה במיקום מעולה",
      "במיקום מרכזי וחיוני",
      "דירה מושקעת ומעוצבת",
      "נוף פתוח ללא מפגעים",
      "בלב השכונה המבוקשת",
      "קרוב לבתי ספר וגני ילדים",
      "דירה יוקרתית במיקום מעולה",
      "דירה מתוחזקת היטב"
    ];
    
    properties.push({
      id: i,
      image: image,
      title: `${propertyType} ${rooms} חדרים ב${neighborhood}`,
      subtitle: subtitles[Math.floor(Math.random() * subtitles.length)],
      propertyType: propertyType,
      condition: condition,
      price: formattedPrice,
      location: `${city}, ${neighborhood}`,
      rooms: rooms,
      size: size,
      floor: floor,
      features: features,
    });
  }
  return properties;
};

const mockProperties = generateProperties();

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