import { Menu, Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MobileHeader = () => {
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
                דרושים IL
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Link to="/" className="flex items-center">
          <div className="flex h-10 w-24 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary px-2">
            <span className="text-sm font-extrabold text-primary-foreground whitespace-nowrap">
              שוק יד שנייה
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
