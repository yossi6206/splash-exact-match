import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import furnitureBanner from "@/assets/furniture-banner.jpg";

const FurnitureCTABanner = () => {
  const [offsetY, setOffsetY] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bannerRef.current) {
        const rect = bannerRef.current.getBoundingClientRect();
        const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        setOffsetY(scrollPercent * 50);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="py-8" ref={bannerRef}>
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-r from-accent via-primary to-secondary">
          <div className="grid md:grid-cols-2 items-center min-h-[200px]">
            {/* Content Side - Right */}
            <div className="p-8 md:p-12 text-right order-2 md:order-1">
              <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                מבצע מיוחד
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                רהיטים איכותיים במחירים שווים
              </h2>
              <p className="text-lg text-white/90 mb-6">
                עדכנו את הבית בסגנון חדש עם מגוון רהיטי יד שניה
              </p>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 rounded-full px-8 font-bold shadow-lg hover:scale-105 transition-transform"
                asChild
              >
                <Link to="/secondhand?category=furniture">
                  למוצרי ריהוט
                </Link>
              </Button>
            </div>

            {/* Image Side - Left */}
            <div className="hidden md:block relative h-full order-1 md:order-2 overflow-hidden">
              <img
                src={furnitureBanner}
                alt="ריהוט יד שניה"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-100"
                style={{ transform: `translateY(${offsetY}px)` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FurnitureCTABanner;
