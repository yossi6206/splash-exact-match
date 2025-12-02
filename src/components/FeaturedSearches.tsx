import SearchCard from "./SearchCard";
import searchDesign from "@/assets/search-design.jpg";
import searchShopping from "@/assets/search-shopping.jpg";
import searchApartments from "@/assets/search-apartments.jpg";
import searchCars from "@/assets/search-cars.jpg";

const searches = [
  {
    id: 1,
    image: searchDesign,
    title: "מגוון הפריטים - המקום שבו אתה לעבודה הבאה שלך",
  },
  {
    id: 2,
    image: searchShopping,
    title: "המוצרים הפופולריים ביותר המשובצע האחרון",
  },
  {
    id: 3,
    image: searchApartments,
    title: "דירות מתחת ל-2,000,000 ש״ח באזור תל אביב",
  },
  {
    id: 4,
    image: searchCars,
    title: "הרכבים הכי נמכרים סביבך עד 60,000 ש״ח",
  },
];

const FeaturedSearches = () => {
  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-danidin font-black text-foreground text-right">
            חיפושים שאסור לפספס
          </h2>
          <a 
            href="#" 
            className="text-sm md:text-base font-semibold text-primary hover:text-primary/80 transition-colors duration-200 flex items-center gap-2"
          >
            צפה בכל
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {searches.map((search) => (
            <SearchCard key={search.id} image={search.image} title={search.title} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSearches;
