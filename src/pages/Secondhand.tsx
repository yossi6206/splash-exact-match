import { useState } from "react";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import RecommendedCard from "@/components/RecommendedCard";
import CategoryShowcase from "@/components/CategoryShowcase";
import SellCTABanner from "@/components/SellCTABanner";
import FurnitureCTABanner from "@/components/FurnitureCTABanner";
import RealEstateCTABanner from "@/components/RealEstateCTABanner";

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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-danidin font-black text-white leading-tight drop-shadow-lg">
                קל יותר למכור, לקנות ולשמור על הסביבה
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                אלפי מוצרי יד שנייה איכוותיים במחירים הכי טובים
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center bg-white rounded-full shadow-2xl overflow-hidden">
                <Search className="absolute right-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="מה תרצו לחפש?"
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
                <div className="text-3xl font-bold text-white">50,000+</div>
                <div className="text-sm text-white/80">מוצרים פעילים</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">15,000+</div>
                <div className="text-sm text-white/80">מוכרים פעילים</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">95%</div>
                <div className="text-sm text-white/80">שביעות רצון</div>
              </div>
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
      <section className="py-12 md:py-16 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">קטגוריות פופולריות</h2>
            <Link 
              to="/secondhand/all" 
              className="text-sm md:text-base font-semibold text-primary hover:text-primary/80 transition-colors duration-200 flex items-center gap-2"
            >
              צפה בכל
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 md:gap-8 lg:gap-12 max-w-7xl mx-auto">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.link}
                className="flex flex-col items-center gap-3 md:gap-4 group cursor-pointer transition-all duration-300"
              >
                <div className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:scale-105 overflow-hidden relative">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                    <div className="text-center text-white">
                      <div className="text-lg md:text-2xl lg:text-3xl font-bold">✨</div>
                      <div className="text-[10px] md:text-xs lg:text-sm font-medium mt-1">לחץ לצפייה</div>
                    </div>
                  </div>
                </div>
                <span className="text-xs md:text-sm lg:text-base font-semibold text-foreground text-center max-w-[100px] md:max-w-none group-hover:text-primary transition-colors duration-300">
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

      {/* Sell CTA Banner */}
      <SellCTABanner />

      {/* Furniture Showcase */}
      <CategoryShowcase
        title="סלון וסביבת אירוח"
        items={furnitureShowcase}
        categoryLink="/secondhand?category=furniture"
      />

      {/* Furniture CTA Banner */}
      <FurnitureCTABanner />

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

      {/* Real Estate CTA Banner */}
      <RealEstateCTABanner />

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
