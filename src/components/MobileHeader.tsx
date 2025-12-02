import { Menu, Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MobileHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const unreadCount = useUnreadMessages(user?.id);

  return (
    <header className="md:hidden sticky top-0 z-50 w-full bg-background border-b border-border safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <SheetHeader>
              <SheetTitle>תפריט</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 space-y-4">
              <Link
                to="/properties"
                className="block px-4 py-3 text-lg font-medium hover:bg-muted rounded-lg transition-colors"
              >
                נדל"ן
              </Link>
              <Link
                to="/cars"
                className="block px-4 py-3 text-lg font-medium hover:bg-muted rounded-lg transition-colors"
              >
                רכב
              </Link>
              <Link
                to="/laptops"
                className="block px-4 py-3 text-lg font-medium hover:bg-muted rounded-lg transition-colors"
              >
                מחשבים
              </Link>
              <Link
                to="/"
                className="block px-4 py-3 text-lg font-medium hover:bg-muted rounded-lg transition-colors"
              >
                יד שניה
              </Link>
              <Link
                to="/"
                className="block px-4 py-3 text-lg font-medium hover:bg-muted rounded-lg transition-colors"
              >
                דרושים
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Link to="/" className="flex items-center">
          <div className="flex h-10 w-24 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary px-2">
            <span className="text-sm font-danidin font-black text-primary-foreground whitespace-nowrap">
              שוק יד שנייה
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          {user && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/dashboard/messages")}
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
          )}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
