import { Button } from "@/components/ui/button";
import heroPhone from "@/assets/hero-phone.jpg";
import heroLaptop from "@/assets/hero-laptop.jpg";
import heroCar from "@/assets/hero-car.jpg";
import heroApartment from "@/assets/hero-apartment.jpg";
import heroWatch from "@/assets/hero-watch.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted min-h-[700px] md:min-h-[800px] lg:min-h-[900px]">
      {/* Modern gradient background with multiple layers */}
      <div className="absolute inset-0 -z-10">
        {/* Primary gradient layer */}
        <div className="absolute right-0 top-0 h-full w-4/5 bg-gradient-to-bl from-orange-500 via-amber-500 to-yellow-500 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-secondary/30 to-accent/40 mix-blend-multiply"></div>
        </div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-64 w-80 h-80 bg-gradient-to-br from-accent/30 to-primary/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        {/* Organic SVG shapes */}
        <svg
          className="absolute inset-0 h-full w-full opacity-10"
          viewBox="0 0 1200 600"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.6 }} />
              <stop offset="100%" style={{ stopColor: 'hsl(var(--secondary))', stopOpacity: 0.4 }} />
            </linearGradient>
          </defs>
          <path
            d="M0,200 Q300,100 600,200 T1200,200 L1200,0 L0,0 Z"
            fill="url(#grad1)"
          />
          <path
            d="M0,450 Q400,300 800,450 T1200,450 L1200,600 L0,600 Z"
            fill="white"
            opacity="0.15"
          />
        </svg>
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

        {/* Statistics Section */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Active Ads */}
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
            <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-2">
              350,000+
            </div>
            <div className="text-base md:text-lg text-foreground/80 font-medium">
              מודעות פעילות
            </div>
          </div>

          {/* Registered Users */}
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
            <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-secondary mb-2">
              1.2M+
            </div>
            <div className="text-base md:text-lg text-foreground/80 font-medium">
              משתמשים רשומים
            </div>
          </div>

          {/* Completed Deals */}
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20">
            <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-accent mb-2">
              500K+
            </div>
            <div className="text-base md:text-lg text-foreground/80 font-medium">
              עסקאות שהושלמו
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
