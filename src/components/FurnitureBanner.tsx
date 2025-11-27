import { Button } from "./ui/button";
import furnitureBanner from "@/assets/furniture-banner.jpg";

const FurnitureBanner = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-l from-blue-500 to-blue-600 min-h-[280px] flex items-center">
        <div className="absolute inset-0">
          <img
            src={furnitureBanner}
            alt="ריהוט למשרד"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="relative z-10 w-full md:w-1/2 p-8 md:p-12 text-white">
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold mb-4">
            מבצע מיוחד
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
            ריהוט למשרד במחירים מיוחדים
          </h2>
          <p className="text-lg md:text-xl mb-6 text-white/90">
            שדרג את המשרד שלך עם ריהוט איכותי במחירים שלא יאומנו
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-white/90 font-semibold text-lg px-8 shadow-lg"
          >
            לכל הריהוט
          </Button>
        </div>
      </div>
  );
};

export default FurnitureBanner;
