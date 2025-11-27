import { Button } from "@/components/ui/button";
import heroPhone from "@/assets/hero-phone.jpg";
import heroLaptop from "@/assets/hero-laptop.jpg";
import heroCar from "@/assets/hero-car.jpg";
import heroApartment from "@/assets/hero-apartment.jpg";
import heroWatch from "@/assets/hero-watch.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background min-h-[700px] md:min-h-[800px] lg:min-h-[900px]">
      {/* Organic gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-0 h-full w-3/4 bg-gradient-to-bl from-secondary via-primary to-primary opacity-90">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1200 600"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0,300 Q300,150 600,300 T1200,300 L1200,0 L0,0 Z"
              fill="white"
              opacity="0.3"
            />
            <path
              d="M0,400 Q400,250 800,400 T1200,400 L1200,600 L0,600 Z"
              fill="white"
              opacity="0.2"
            />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-32 lg:py-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="order-2 md:order-1 flex flex-col items-end text-right">
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-foreground mb-6 leading-tight">
              פתוח עומס, יותר רווח
            </h1>
            <p className="text-2xl md:text-3xl lg:text-4xl text-foreground/80 mb-10 font-medium">
              למכור ביד2 ולהרוויח בקלות
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl px-16 py-8 rounded-full shadow-lg hover:shadow-xl transition-all">
              לפרסם מודעה
            </Button>
          </div>

          {/* Gallery of product images */}
          <div className="order-1 md:order-2 relative">
            <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-lg mx-auto">
              {/* Phone */}
              <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500 group cursor-pointer">
                <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-xl border-4 border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-2xl">
                  <img
                    src={heroPhone}
                    alt="טלפון למכירה"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground px-3 py-1 rounded-lg font-bold text-sm md:text-base shadow-lg transition-transform duration-300 group-hover:scale-110">
                  ₪ 2,500
                </div>
              </div>

              {/* Laptop */}
              <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 group cursor-pointer">
                <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-xl border-4 border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-2xl">
                  <img
                    src={heroLaptop}
                    alt="מחשב נייד למכירה"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground px-3 py-1 rounded-lg font-bold text-sm md:text-base shadow-lg transition-transform duration-300 group-hover:scale-110">
                  ₪ 3,800
                </div>
              </div>

              {/* Car */}
              <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 group cursor-pointer">
                <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-xl border-4 border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-2xl">
                  <img
                    src={heroCar}
                    alt="רכב למכירה"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground px-3 py-1 rounded-lg font-bold text-sm md:text-base shadow-lg transition-transform duration-300 group-hover:scale-110">
                  ₪ 150,000
                </div>
              </div>

              {/* Watch */}
              <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 group cursor-pointer">
                <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-xl border-4 border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-2xl">
                  <img
                    src={heroWatch}
                    alt="שעון למכירה"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground px-3 py-1 rounded-lg font-bold text-sm md:text-base shadow-lg transition-transform duration-300 group-hover:scale-110">
                  ₪ 8,500
                </div>
              </div>
            </div>

            {/* Center apartment image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 animate-in fade-in scale-in duration-700 delay-700 group cursor-pointer">
              <div className="w-40 h-40 md:w-52 md:h-52 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-2xl border-8 border-white/30 bg-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-3xl">
                <img
                  src={heroApartment}
                  alt="דירה למכירה"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-base md:text-xl shadow-xl transition-transform duration-300 group-hover:scale-110">
                ₪ 1,850,000
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
