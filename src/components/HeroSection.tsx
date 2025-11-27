import { Button } from "@/components/ui/button";
import heroFurniture from "@/assets/hero-furniture.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background">
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

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div className="order-2 md:order-1 flex flex-col items-end text-right">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4">
              פתוח עומס, יותר רווח
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-8 font-medium">
              למכור ביד2 ולהרוויח בקלות
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all">
              לפרסם מודעה
            </Button>
          </div>

          {/* Image with price tags */}
          <div className="order-1 md:order-2 relative">
            <img
              src={heroFurniture}
              alt="רהיטים למכירה"
              className="w-full h-auto relative z-10"
            />
            
            {/* Price tags */}
            <div className="absolute top-[15%] left-[10%] bg-accent text-accent-foreground px-4 py-2 rounded-lg font-bold text-lg shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
              ₪ 700
            </div>
            <div className="absolute top-[25%] right-[20%] bg-accent text-accent-foreground px-4 py-2 rounded-lg font-bold text-lg shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              ₪ 450
            </div>
            <div className="absolute bottom-[35%] left-[15%] bg-accent text-accent-foreground px-4 py-2 rounded-lg font-bold text-lg shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              ₪ 150
            </div>
            <div className="absolute bottom-[25%] right-[25%] bg-accent text-accent-foreground px-4 py-2 rounded-lg font-bold text-lg shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
              ₪ 200
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
