import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeaturedPropertyCard from "./FeaturedPropertyCard";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import { useState } from "react";

const properties = [
  {
    id: 1,
    image: property1,
    title: "דירת 3 חדרים בירושלים",
    subtitle: "דירה מרווחת ומוארת",
    propertyType: "דירה",
    condition: "משופץ",
    price: 3950000,
    location: "הבנאים 44, ירושלים",
    rooms: 3,
    size: 100,
    floor: 2,
    features: ["מעלית", "חניה"],
  },
  {
    id: 2,
    image: property2,
    title: "דירת 2 חדרים בירושלים",
    subtitle: "קרוב לתחבורה ציבורית",
    propertyType: "דירה",
    condition: "במצב טוב",
    price: 2690000,
    location: "שאול אדרי 1, ירושלים",
    rooms: 2,
    size: 75,
    floor: 4,
    features: ["מעלית", "מרפסת"],
  },
  {
    id: 3,
    image: property3,
    title: "דירת 2 חדרים בירושלים",
    subtitle: "דירה שקטה ומוארת",
    propertyType: "דירה",
    condition: "משופץ",
    price: 2780000,
    location: "ירושלים",
    rooms: 2,
    size: 80,
    floor: 1,
    features: ["מחסן"],
  },
  {
    id: 4,
    image: property4,
    title: "דירת 2 חדרים בירושלים",
    subtitle: "במיקום מעולה",
    propertyType: "דירה",
    condition: "במצב טוב",
    price: 2450000,
    location: "ירושלים",
    rooms: 2,
    size: 70,
    floor: 3,
    features: ["מעלית"],
  },
];

const categories = [
  { id: "realestate", label: "נדל״ן", active: true },
  { id: "car", label: "רכב", active: false },
  { id: "secondhand", label: "יד שניה", active: false },
];

const FeaturedListings = () => {
  const [activeCategory, setActiveCategory] = useState("realestate");

  return (
    <section className="py-6 md:py-8 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
              חדש סביבך
            </h2>
            <div className="flex items-center gap-1 text-primary">
              <MapPin className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-xs md:text-sm font-medium">ירושלים</span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Category Filters */}
            <div className="flex gap-2 flex-1 md:flex-initial overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(category.id)}
                  size="sm"
                  className={
                    activeCategory === category.id
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full text-xs md:text-sm whitespace-nowrap"
                      : "bg-background border-2 hover:bg-muted text-foreground font-medium rounded-full text-xs md:text-sm whitespace-nowrap"
                  }
                >
                  {category.label}
                </Button>
              ))}
            </div>
            
            {/* View All Link */}
            <a 
              href="/properties" 
              className="text-sm md:text-base font-semibold text-primary hover:text-primary/80 transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
            >
              צפה בכל
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="relative">
          {/* Navigation Arrows - Desktop only */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-background/90 hover:bg-background shadow-lg rounded-full hidden md:flex"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-background/90 hover:bg-background shadow-lg rounded-full hidden md:flex"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          {/* Properties */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {properties.map((property) => (
              <FeaturedPropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
