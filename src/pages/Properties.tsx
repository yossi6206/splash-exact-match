import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { PropertySidebarFilter, PropertyFilters as PropertySidebarFilters } from "@/components/PropertySidebarFilter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Search } from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import propertiesHeroBanner from "@/assets/properties-hero-modern.jpg";
import propertyModern1 from "@/assets/property-modern-1.jpg";
import propertyModern2 from "@/assets/property-modern-2.jpg";
import propertyModern3 from "@/assets/property-modern-3.jpg";

const propertyTypes = ["דירה", "פנטהאוז", "דירת גן", "דירת גג", "בית פרטי", "דופלקס"];
const conditions = ["חדש מקבלן", "משופץ", "במצב טוב", "דורש שיפוץ", "במצב מצוין"];
const cities = ["תל אביב", "ירושלים", "חיפה", "באר שבע", "נתניה", "פתח תקווה", "ראשון לציון", "אשדוד", "רחובות", "בני ברק", "הרצליה", "כפר סבא", "רעננה", "מודיעין", "רמת גן", "גבעתיים", "חולון"];
const neighborhoods = ["נווה צדק", "פלורנטין", "בורסה", "קריית אליעזר", "רמת אביב", "צהלה", "רמת חן", "שכון ג׳", "גבעת שאול", "הדר", "נווה שאנן", "רמת גן", "קריית מנחם", "נאות אפקה", "רמת פולג"];
const images = [property1, property2, property3, property4, propertyModern1, propertyModern2, propertyModern3];

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
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarFilters, setSidebarFilters] = useState<PropertySidebarFilters>({
    propertyTypes: [],
    rooms: [],
    priceMin: 0,
    priceMax: 5000000,
    sizeMin: 0,
    sizeMax: 300,
    cities: [],
    features: [],
  });
  const itemsPerPage = 10;
  
  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let filtered = mockProperties.filter((property) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          property.title.toLowerCase().includes(query) ||
          property.subtitle.toLowerCase().includes(query) ||
          property.location.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      // Property type filter
      if (sidebarFilters.propertyTypes.length > 0 && !sidebarFilters.propertyTypes.includes(property.propertyType)) {
        return false;
      }
      
      // Rooms filter
      if (sidebarFilters.rooms.length > 0) {
        const roomMatch = sidebarFilters.rooms.some(r => {
          if (r === "6+") return property.rooms >= 6;
          return property.rooms === parseInt(r);
        });
        if (!roomMatch) return false;
      }
      
      // Price filter
      const price = parseInt(property.price.replace(/,/g, ''));
      if (price < sidebarFilters.priceMin || price > sidebarFilters.priceMax) {
        return false;
      }
      
      // Size filter
      if (property.size && (property.size < sidebarFilters.sizeMin || property.size > sidebarFilters.sizeMax)) {
        return false;
      }
      
      // City filter
      if (sidebarFilters.cities.length > 0) {
        const cityMatch = sidebarFilters.cities.some(city => property.location.includes(city));
        if (!cityMatch) return false;
      }
      
      // Features filter
      if (sidebarFilters.features.length > 0) {
        const hasFeature = sidebarFilters.features.every(f => 
          property.features.some(pf => pf.includes(f) || f.includes(pf))
        );
        if (!hasFeature) return false;
      }
      
      return true;
    });
    
    // Sort properties
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => parseInt(a.price.replace(/,/g, '')) - parseInt(b.price.replace(/,/g, '')));
        break;
      case "price-high":
        filtered.sort((a, b) => parseInt(b.price.replace(/,/g, '')) - parseInt(a.price.replace(/,/g, '')));
        break;
      case "rooms":
        filtered.sort((a, b) => b.rooms - a.rooms);
        break;
      default:
        break;
    }
    
    return filtered;
  }, [searchQuery, sidebarFilters, sortBy]);
  
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);
  
  const handleSidebarFilterChange = (newFilters: PropertySidebarFilters) => {
    setSidebarFilters(newFilters);
    setCurrentPage(1);
  };
  
  const handleSearch = () => {
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                מצא את הבית המושלם שלך
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                אלפי נכסים למכירה ולהשכרה ממיטב המתווכים והבעלים
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center bg-white rounded-full shadow-2xl overflow-hidden">
                <Search className="absolute right-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="חפש לפי עיר, שכונה או תיאור..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 pr-12 pl-4 h-14 text-lg rounded-full focus-visible:ring-0"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button
                  className="ml-2 rounded-full px-8 h-10 font-bold"
                  size="lg"
                  onClick={handleSearch}
                >
                  חפש
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">110+</div>
                <div className="text-sm text-white/80">נכסים זמינים</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">17+</div>
                <div className="text-sm text-white/80">ערים</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-sm text-white/80">שביעות רצון</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-6">
        {/* Category Tabs - Hidden since we now have filter tags in hero */}
        
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">נכסים למכירה</h2>
            <p className="text-muted-foreground">{filteredProperties.length.toLocaleString()} תוצאות</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar - Right side for RTL */}
          <PropertySidebarFilter onFilterChange={handleSidebarFilterChange} />
          
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Properties;