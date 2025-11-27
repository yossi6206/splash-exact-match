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
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-6 md:mb-8 text-right">
          חיפושים שאסור לפספס
        </h2>
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
