import { useState } from "react";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import RecommendedCard from "@/components/RecommendedCard";
import CategoryShowcase from "@/components/CategoryShowcase";

// Import images
import secondhandHero from "@/assets/secondhand-hero.jpg";
import furnitureImg from "@/assets/hero-furniture.png";
import laptopImg from "@/assets/hero-laptop.jpg";
import phoneImg from "@/assets/hero-phone.jpg";
import carImg from "@/assets/hero-car.jpg";
import apartmentImg from "@/assets/hero-apartment.jpg";
import watchImg from "@/assets/hero-watch.jpg";
import itemCar from "@/assets/item-car.jpg";
import itemPhone from "@/assets/item-phone.jpg";
import itemLaptop from "@/assets/item-laptop.jpg";
import itemJob from "@/assets/item-job.jpg";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";

const categories = [
  { id: 1, name: "ריהוט", image: furnitureImg, link: "/secondhand?category=furniture" },
  { id: 2, name: "מחשבים ניידים", image: laptopImg, link: "/laptops" },
  { id: 3, name: "סלולר וטאבלט", image: phoneImg, link: "/secondhand?category=phones" },
  { id: 4, name: "כלי רכב", image: carImg, link: "/cars" },
  { id: 5, name: "מוצרי חשמל", image: watchImg, link: "/secondhand?category=electronics" },
  { id: 6, name: "אביזרים לבית", image: apartmentImg, link: "/secondhand?category=home" },
  { id: 7, name: "בגדים והנעלה", image: furnitureImg, link: "/secondhand?category=clothing" },
  { id: 8, name: "תחביבים וספורט", image: carImg, link: "/secondhand?category=hobbies" },
];

const mostViewedItems = [
  {
    id: 1,
    image: itemPhone,
    title: "iPhone 14 Pro מצוין",
    price: "₪2,800",
    location: "תל אביב יפו",
    category: "חבל לפספס",
    timeAgo: "לפני שעתיים"
  },
  {
    id: 2,
    image: furnitureImg,
    title: "ספה פינתית עור",
    price: "₪700",
    location: "נשר",
    category: "במצב מושלם",
    timeAgo: "לפני 3 שעות"
  },
  {
    id: 3,
    image: carImg,
    title: "אופני הרים מירוד GT agressor L",
    price: "₪1,850",
    location: "שדמות דבורה",
    category: "בהזדמנות",
    timeAgo: "לפני יום"
  },
  {
    id: 4,
    image: laptopImg,
    title: "מסטונגו פולד 256 בן חצי שנה",
    price: "₪5,000",
    location: "חוררה",
    category: "כמו חדש",
    timeAgo: "לפני יומיים"
  },
];

const furnitureShowcase = [
  {
    id: 101,
    image: furnitureImg,
    title: "ספה איכותית מעוצבת",
    price: "₪900",
    originalPrice: "₪1,000",
    location: "גבע ביק",
    category: "יוחדי"
  },
  {
    id: 102,
    image: apartmentImg,
    title: "כורסא American Comfort",
    price: "₪2,500",
    location: "גבע תקווה",
    category: "במצב מושלם"
  },
  {
    id: 103,
    image: furnitureImg,
    title: "מיטה זוגית",
    price: "₪1,100",
    originalPrice: "₪1,200",
    location: "גבע ביק",
    category: "בהזדמנות"
  },
  {
    id: 104,
    image: apartmentImg,
    title: "ספה איכותית מעוצבת",
    price: "₪900",
    originalPrice: "₪1,000",
    location: "אור עקיבה",
    category: "כמו חדש"
  },
  {
    id: 105,
    image: property1,
    title: "סלון מעוצב מודרני",
    price: "₪3,200",
    originalPrice: "₪3,800",
    location: "תל אביב",
    category: "מומלץ"
  }
];

const electronicsShowcase = [
  {
    id: 201,
    image: laptopImg,
    title: "MacBook Pro 16 אינץ'",
    price: "₪4,500",
    originalPrice: "₪5,200",
    location: "תל אביב",
    category: "חבל לפספס"
  },
  {
    id: 202,
    image: phoneImg,
    title: "iPhone 14 Pro Max",
    price: "₪3,200",
    location: "חיפה",
    category: "כמו חדש"
  },
  {
    id: 203,
    image: watchImg,
    title: "Apple Watch Ultra",
    price: "₪2,100",
    originalPrice: "₪2,500",
    location: "ירושלים",
    category: "במצב מעולה"
  },
  {
    id: 204,
    image: laptopImg,
    title: "iPad Pro 12.9",
    price: "₪2,800",
    location: "רעננה",
    category: "בהזדמנות"
  }
];

const realEstateShowcase = [
  {
    id: 301,
    image: property1,
    title: "דירת 4 חדרים מרווחת במרכז",
    price: "₪1,850,000",
    location: "תל אביב",
    category: "למכירה"
  },
  {
    id: 302,
    image: property2,
    title: "דירת גן 5 חדרים",
    price: "₪2,200,000",
    location: "רמת גן",
    category: "חדש"
  },
  {
    id: 303,
    image: property3,
    title: "פנטהאוז יוקרתי",
    price: "₪3,500,000",
    originalPrice: "₪3,800,000",
    location: "הרצליה",
    category: "בהזדמנות"
  },
  {
    id: 304,
    image: property4,
    title: "דירה 3 חדרים משופצת",
    price: "₪1,450,000",
    location: "גבעתיים",
    category: "מומלץ"
  }
];

const vehiclesShowcase = [
  {
    id: 401,
    image: carImg,
    title: "טויוטה קורולה 2020",
    price: "₪85,000",
    originalPrice: "₪92,000",
    location: "תל אביב",
    category: "בהזדמנות"
  },
  {
    id: 402,
    image: itemCar,
    title: "הונדה סיוויק 2019",
    price: "₪75,000",
    location: "חיפה",
    category: "יד ראשונה"
  },
  {
    id: 403,
    image: carImg,
    title: "מאזדה 3 2021",
    price: "₪95,000",
    location: "ירושלים",
    category: "כמו חדש"
  },
  {
    id: 404,
    image: itemCar,
    title: "סקודה אוקטביה 2018",
    price: "₪68,000",
    originalPrice: "₪72,000",
    location: "באר שבע",
    category: "מומלץ"
  }
];

const Secondhand = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header />
      
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={secondhandHero} 
            alt="יד שניה"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-secondary/70 to-accent/60" />
        </div>
        
        {/* Content */}
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
              קל יותר למכור, לקנות ולשמור על הסביבה
            </h1>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center bg-background rounded-full shadow-2xl border-2 border-white/30 overflow-hidden backdrop-blur-sm">
                <Search className="absolute right-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="מה תרצו לחפש?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 pr-12 pl-20 h-14 text-lg rounded-full focus-visible:ring-0"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute left-2 rounded-full"
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </div>
              <Button
                className="mt-4 rounded-full px-8 bg-white text-primary hover:bg-white/90 font-bold shadow-lg"
                size="lg"
              >
                כל הקטגוריות
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-12 bg-gradient-to-l from-accent via-secondary to-primary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
            <div className="text-center md:text-right">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                הסייל הכי משתלם קורא אצלך בבית!
              </h2>
            </div>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 rounded-full px-8 font-bold text-lg shadow-lg"
            >
              למכירת פריטים
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 max-w-7xl mx-auto">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.link}
                className="group flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105"
              >
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-lg border-4 border-border group-hover:border-primary group-hover:shadow-xl transition-all duration-300">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-sm md:text-base font-medium text-foreground text-center group-hover:text-primary transition-colors duration-300">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Most Viewed Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">הכי נצפים</h2>
            <Link
              to="/secondhand?filter=most-viewed"
              className="text-primary hover:text-primary/80 font-medium flex items-center gap-2 transition-colors"
            >
              <span>כל המומרים</span>
              <span>←</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mostViewedItems.map((item) => (
              <RecommendedCard
                key={item.id}
                image={item.image}
                title={item.title}
                price={item.price}
                location={item.location}
                category={item.category}
                timeAgo={item.timeAgo}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Furniture Showcase */}
      <CategoryShowcase
        title="סלון וסביבת אירוח"
        items={furnitureShowcase}
        categoryLink="/secondhand?category=furniture"
      />

      {/* Electronics Showcase */}
      <section className="bg-muted/30">
        <CategoryShowcase
          title="אלקטרוניקה וטכנולוגיה"
          items={electronicsShowcase}
          categoryLink="/secondhand?category=electronics"
        />
      </section>

      {/* Real Estate Showcase */}
      <CategoryShowcase
        title='נדל"ן'
        items={realEstateShowcase}
        categoryLink="/properties"
      />

      {/* Vehicles Showcase */}
      <section className="bg-muted/30">
        <CategoryShowcase
          title="רכב ואופנועים"
          items={vehiclesShowcase}
          categoryLink="/cars"
        />
      </section>

      <Footer />
    </div>
  );
};

export default Secondhand;
