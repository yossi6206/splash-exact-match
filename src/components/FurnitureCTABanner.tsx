import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import furnitureBanner from "@/assets/furniture-banner.jpg";

const FurnitureCTABanner = () => {
  return (
    <section className="py-8">
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
            <div className="hidden md:block relative h-full order-1 md:order-2">
              <img
                src={furnitureBanner}
                alt="ריהוט יד שניה"
                className="absolute inset-0 w-full h-full object-cover"
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
