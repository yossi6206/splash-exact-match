import { Home, Search, Heart, User, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "בית", path: "/" },
    { icon: Search, label: "חיפוש", path: "/properties" },
    { icon: Plus, label: "פרסם", path: "/dashboard" },
    { icon: Heart, label: "מועדפים", path: "/favorites" },
    { icon: User, label: "פרופיל", path: "/dashboard" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isCenter = item.label === "פרסם";

          if (isCenter) {
            return (
              <Link key={item.path} to={item.path} className="relative -mt-8">
                <Button
                  size="icon"
                  className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
                >
                  <Icon className="h-6 w-6" />
                </Button>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
