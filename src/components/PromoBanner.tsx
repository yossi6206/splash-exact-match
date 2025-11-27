import { Button } from "@/components/ui/button";
import carsBanner from "@/assets/cars-banner.jpg";

const PromoBanner = () => {
  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-slate-700 via-slate-600 to-slate-800 shadow-xl">
          {/* SALE Badge */}
          <div className="absolute top-0 left-0 bg-accent text-accent-foreground px-6 py-2 text-lg font-bold rounded-br-2xl z-10">
            SALE
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 items-center min-h-[200px]">
            {/* Content */}
            <div className="order-2 md:order-1 p-8 md:pr-4 text-right">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                הזדמנויות שלא כדאי לפספס ביד2:
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-6 font-medium">
                ירידות מחירים על רכבים מסוכנות
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6 rounded-full">
                למגוון הרכבים
              </Button>
            </div>

            {/* Image */}
            <div className="order-1 md:order-2 relative h-full min-h-[200px]">
              <img
                src={carsBanner}
                alt="רכבים למכירה"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
