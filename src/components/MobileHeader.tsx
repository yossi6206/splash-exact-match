import { Menu, Bell, MessageSquare, Search, User, LogOut, Heart, LayoutGrid, Settings, Home, Car, Building2, Laptop, Package, Briefcase, Users, Store, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MobileHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = useUnreadMessages(user?.id);

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "ראשי";
    if (path === "/properties") return "נדל\"ן";
    if (path === "/cars") return "רכב";
    if (path === "/laptops") return "מחשבים";
    if (path === "/secondhand") return "יד שניה";
    if (path === "/jobs") return "דרושים";
    if (path === "/freelancers") return "פרילנסרים";
    if (path === "/businesses") return "עסקים למכירה";
    if (path === "/favorites") return "מועדפים";
    if (path === "/messages") return "הודעות";
    if (path === "/tips") return "טיפים ומידע";
    if (path.startsWith("/dashboard")) return "האזור האישי";
    return "SecondHandPro";
  };

  const categories = [
    { title: "נדל\"ן", icon: Building2, path: "/properties" },
    { title: "רכב", icon: Car, path: "/cars" },
    { title: "מחשבים", icon: Laptop, path: "/laptops" },
    { title: "יד שניה", icon: Package, path: "/secondhand" },
    { title: "דרושים", icon: Briefcase, path: "/jobs" },
    { title: "פרילנסרים", icon: Users, path: "/freelancers" },
    { title: "עסקים למכירה", icon: Store, path: "/businesses" },
  ];

  const userMenuItems = user ? [
    { title: "המודעות שלי", icon: LayoutGrid, path: "/dashboard/ads" },
    { title: "מועדפים", icon: Heart, path: "/favorites" },
    { title: "הודעות", icon: MessageSquare, path: "/messages" },
    { title: "פרסום מודעה", icon: Menu, path: "/dashboard/post-wizard" },
    { title: "עדכון פרטים", icon: Settings, path: "/dashboard/profile" },
  ] : [];

  return (
    <header className="md:hidden sticky top-0 z-50 w-full bg-background border-b border-border safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] overflow-y-auto">
            <SheetHeader className="border-b pb-4 mb-4">
              {user ? (
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="w-16 h-16 ring-4 ring-primary/10">
                    <AvatarFallback className="bg-gradient-to-br from-primary/30 to-secondary/30 text-primary text-xl font-bold">
                      {getInitials(user.email || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-lg font-bold text-foreground">{user.email?.split('@')[0]}</h2>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex h-12 w-auto items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary px-4">
                    <span className="text-sm font-extrabold text-primary-foreground whitespace-nowrap">
                      SecondHandPro
                    </span>
                  </div>
                  <Button 
                    className="w-full mt-2"
                    onClick={() => navigate("/auth")}
                  >
                    התחבר / הרשם
                  </Button>
                </div>
              )}
            </SheetHeader>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">קטגוריות</h3>
              <nav className="space-y-1">
                {categories.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-right ${
                      location.pathname === item.path 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <span className="font-medium flex-1">{item.title}</span>
                    <item.icon className="h-5 w-5" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* User Menu */}
            {user && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-2">האזור האישי</h3>
                <nav className="space-y-1">
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-right ${
                        location.pathname === item.path 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <span className="font-medium flex-1">{item.title}</span>
                      <item.icon className="h-5 w-5" />
                    </Link>
                  ))}
                </nav>
              </div>
            )}

            {/* Footer Actions */}
            <div className="space-y-2 pt-4 border-t">
              <Link to="/">
                <Button variant="outline" className="w-full justify-between border-border hover:bg-muted">
                  <span>דף הבית</span>
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              {user && (
                <Button 
                  variant="outline" 
                  className="w-full justify-between border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={() => signOut()}
                >
                  <span>התנתקות</span>
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo / Page Title */}
        <Link to="/" className="flex items-center">
          <div className="flex h-10 w-auto items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary px-3">
            <span className="text-xs font-extrabold text-primary-foreground whitespace-nowrap">
              SecondHandPro
            </span>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {user ? (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/messages")}
                className="relative"
              >
                <MessageSquare className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/favorites")}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/auth")}
            >
              התחבר
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;