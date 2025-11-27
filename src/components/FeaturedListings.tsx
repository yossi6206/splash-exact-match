import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "./PropertyCard";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import { useState } from "react";

const properties = [
  {
    id: 1,
    image: property1,
    price: "3,950,000",
    location: "הבנאים 44, ירושלים",
    rooms: 3,
  },
  {
    id: 2,
    image: property2,
    price: "2,690,000",
    location: "שאול אדרי 1, ירושלים",
    rooms: 2,
  },
  {
    id: 3,
    image: property3,
    price: "2,780,000",
    location: "ירושלים",
    rooms: 2,
  },
  {
    id: 4,
    image: property4,
    price: "7,800",
    location: "ירושלים",
    rooms: 2,
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
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              חדש סביבך
            </h2>
            <div className="flex items-center gap-1 text-primary">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">ירושלים</span>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className={
                  activeCategory === category.id
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full"
                    : "bg-background border-2 hover:bg-muted text-foreground font-medium rounded-full"
                }
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="relative">
          {/* Navigation Arrows */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
