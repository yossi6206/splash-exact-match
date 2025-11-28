import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CarFilters } from "@/components/CarFilters";
import { CarCard } from "@/components/CarCard";
import { CarSidebar } from "@/components/CarSidebar";
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
