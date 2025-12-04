import RecommendedCard from "./RecommendedCard";
import itemPhone from "@/assets/item-phone.jpg";
import itemLaptop from "@/assets/item-laptop.jpg";
import itemCar from "@/assets/item-car.jpg";
import itemJob from "@/assets/item-job.jpg";

const items = [
  {
    id: 1,
    image: itemPhone,
    title: "iPhone 14 Pro Max 256GB כחול - מצב מצוין",
    price: "4,200",
    location: "תל אביב",
    category: "יד שניה",
    timeAgo: "לפני שעה",
  },
  {
    id: 2,
    image: itemLaptop,
    title: "מחשב נייד גיימינג ASUS ROG - RTX 4060",
    price: "6,500",
    location: "ירושלים",
    category: "יד שניה",
    timeAgo: "לפני 3 שעות",
  },
  {
    id: 3,
    image: itemCar,
    title: "מאזדה 3 2020 אוטומט - יד ראשונה",
    price: "85,000",
    location: "חיפה",
    category: "רכב",
    timeAgo: "לפני יום",
  },
  {
    id: 4,
    image: itemJob,
    title: "מפתח/ת Full Stack - חברת הייטק מובילה",
    price: "25,000",
    location: "תל אביב",
    category: "דרושים",
    timeAgo: "לפני יומיים",
  },
];

const RecommendedItems = () => {
  return (
    <section className="py-8 md:py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
            מומלצים עבורך
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
          {items.map((item) => (
            <RecommendedCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedItems;
