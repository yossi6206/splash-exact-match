import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import secondhandBanner from "@/assets/furniture-banner.jpg";

const SellCTABanner = () => {
  const [offsetY, setOffsetY] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bannerRef.current) {
        const rect = bannerRef.current.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        setOffsetY(scrollPercent * 50); // Adjust 50 for parallax intensity
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="py-8" ref={bannerRef}>
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-l from-primary via-secondary to-accent">
          <div className="grid md:grid-cols-2 items-center min-h-[200px]">
            {/* Image Side */}
            <div className="hidden md:block relative h-full overflow-hidden">
              <img
                src={secondhandBanner}
                alt="מכירת פריטים"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-100"
                style={{ transform: `translateY(${offsetY}px)` }}
              />
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-accent text-white px-4 py-2 rounded-full font-bold text-sm">
                  SALE
                </span>
              </div>
            </div>

            {/* Content Side */}
            <div className="p-8 md:p-12 text-right">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                ההזדמנות שלא כדאי לפספס ביד2:
              </h2>
              <p className="text-lg text-white/90 mb-6">
                ירידות מחירים על רכבים מסוכנות
              </p>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 rounded-full px-8 font-bold shadow-lg hover:scale-105 transition-transform"
                asChild
              >
                <Link to="/cars">
                  למגוון הרכבים
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellCTABanner;
