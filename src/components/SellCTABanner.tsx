import { Button } from "@/components/ui/button";
import { Camera, TrendingUp, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const SellCTABanner = () => {
  const features = [
    {
      icon: Camera,
      title: "צילום פשוט",
      description: "צלם והעלה בקלות"
    },
    {
      icon: TrendingUp,
      title: "מכירה מהירה",
      description: "קונים ממתינים"
    },
    {
      icon: Shield,
      title: "מאובטח",
      description: "עסקאות בטוחות"
    },
    {
      icon: Zap,
      title: "ללא עמלות",
      description: "פרסום חינם"
    }
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-95" />
      
      {/* Decorative Shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              מכור את מה שלא צריך,
              <br />
              הרווח מה שכן צריך
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              הצטרף לאלפי מוכרים מרוצים ומכור את הפריטים שלך בקלות ובמהירות
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-3 text-white group"
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{feature.title}</h3>
                    <p className="text-sm text-white/80">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 rounded-full px-8 font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link to="/dashboard/listings">
                התחל למכור עכשיו
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 rounded-full px-8 font-bold text-lg backdrop-blur-sm"
              asChild
            >
              <Link to="/tips">
                טיפים למכירה מוצלחת
              </Link>
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="pt-6 flex items-center justify-center gap-2 text-white/90">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-medium">
              מעל 10,000 פריטים נמכרו החודש | דירוג ממוצע 4.8 ⭐
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellCTABanner;
