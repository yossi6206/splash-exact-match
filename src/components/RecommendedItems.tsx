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
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            מומלצים עבורך
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <RecommendedCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedItems;
