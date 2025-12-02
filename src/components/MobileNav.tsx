import { Home, Search, Heart, User, Plus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PostAdDialog from "@/components/PostAdDialog";
import { useAuth } from "@/contexts/AuthContext";

const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const { user } = useAuth();

  // Don't show on auth page
  if (location.pathname === "/auth" || location.pathname === "/reset-password") {
    return null;
  }

  const navItems = [
    { icon: Home, label: "בית", path: "/" },
    { icon: Search, label: "חיפוש", path: "/properties" },
    { icon: Plus, label: "פרסם", path: "#post", isCenter: true },
    { icon: Heart, label: "מועדפים", path: "/favorites" },
    { icon: User, label: "פרופיל", path: user ? "/dashboard" : "/auth" },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.isCenter) {
      if (user) {
        setPostDialogOpen(true);
      } else {
        navigate("/auth");
      }
      return;
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = !item.isCenter && location.pathname === item.path;

          if (item.isCenter) {
            return (
              <div key={item.path} className="relative -mt-6">
                <Button
                  size="icon"
                  className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
                  onClick={() => handleNavClick(item)}
                >
                  <Icon className="h-6 w-6" />
                </Button>
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all min-w-[60px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      
      <PostAdDialog open={postDialogOpen} onOpenChange={setPostDialogOpen} />
    </nav>
  );
};

export default MobileNav;