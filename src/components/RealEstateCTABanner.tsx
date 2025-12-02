import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import propertyBanner from "@/assets/search-apartments.jpg";

const RealEstateCTABanner = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-secondary via-accent to-primary transition-all duration-500 hover:shadow-2xl">
          <div className="grid md:grid-cols-3 items-center min-h-[200px]">
            {/* Image Side - Takes 2 columns */}
            <div className="hidden md:block relative h-full md:col-span-2 overflow-hidden">
              <img
                src={propertyBanner}
                alt="נדלן למכירה"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-primary/60 to-transparent"></div>
              <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur-sm text-white px-4 py-2 rounded-full font-bold text-sm z-10">
                🏠 נכסים חמים
              </div>
            </div>

            {/* Content Side - Takes 1 column */}
            <div className="p-8 md:p-10 text-right md:col-span-1">
              <h2 className="text-2xl md:text-3xl font-danidin font-black text-white mb-3 leading-tight">
                הנכס הבא שלך
                <br />
                מחכה לך כאן
              </h2>
              <p className="text-base text-white/90 mb-6">
                מגוון דירות ונכסים למכירה ולהשכרה
              </p>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 rounded-full px-8 font-bold shadow-lg hover:scale-105 transition-all duration-300 w-full md:w-auto"
                asChild
              >
                <Link to="/properties">
                  לנדל"ן
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealEstateCTABanner;
