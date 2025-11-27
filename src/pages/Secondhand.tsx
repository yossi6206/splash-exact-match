import { useState } from "react";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mic } from "lucide-react";
import { Link } from "react-router-dom";

// Import images
import secondhandHero from "@/assets/secondhand-hero.jpg";
import furnitureImg from "@/assets/hero-furniture.png";
import laptopImg from "@/assets/hero-laptop.jpg";
import phoneImg from "@/assets/hero-phone.jpg";
import carImg from "@/assets/hero-car.jpg";
import apartmentImg from "@/assets/hero-apartment.jpg";
import watchImg from "@/assets/hero-watch.jpg";

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

      <Footer />
    </div>
  );
};

export default Secondhand;
