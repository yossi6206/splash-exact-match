import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import officeFurnitureHero from "@/assets/office-furniture-hero.jpg";

const FurnitureBanner = () => {
  return (
    <section className="py-8 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-l from-[#5B7CFF] to-[#7C5FDC] min-h-[320px] md:min-h-[380px] flex items-stretch shadow-2xl">
        {/* Image Section - Left Side */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src={officeFurnitureHero}
            alt="ריהוט משרדי איכותי"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content Section - Right Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12 text-white">
          <div className="inline-block self-start bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            מבצע מיוחד
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            ריהוט איכותי במחירים שווים
          </h2>
          
          <p className="text-lg md:text-xl mb-8 text-white/95 leading-relaxed">
            עדכנו את הבית בסגנון חדש עם מגוון רהיטי יד שנייה
          </p>
          
          <Link to="/secondhand?category=ריהוט">
            <Button 
              size="lg" 
              className="bg-white text-[#5B7CFF] hover:bg-white/95 font-semibold text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              למגוון ריהוט
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FurnitureBanner;
