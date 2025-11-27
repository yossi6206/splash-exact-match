import { Button } from "./ui/button";
import rentalBanner from "@/assets/rental-banner.jpg";

const RentalBanner = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-l from-green-500 to-green-600 min-h-[280px] flex items-center">
        <div className="absolute inset-0">
          <img
            src={rentalBanner}
            alt="דירות להשכרה"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="relative z-10 w-full md:w-1/2 p-8 md:p-12 text-white">
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold mb-4">
            חדש באתר
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
            דירות להשכרה במחירים הוגנים
          </h2>
          <p className="text-lg md:text-xl mb-6 text-white/90">
            מאות דירות חדשות מתעדכנות מדי יום - מצא את הבית המושלם שלך
          </p>
          <Button 
            size="lg" 
            className="bg-white text-green-600 hover:bg-white/90 font-semibold text-lg px-8 shadow-lg"
          >
            לכל הדירות
          </Button>
        </div>
      </div>
  );
};

export default RentalBanner;
