import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Heart, Plus } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
                <span className="text-2xl font-extrabold text-primary-foreground">yad2</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" className="text-sm font-medium">
                דלקין
              </Button>
              <Button variant="ghost" className="text-sm font-medium">
                דירות חדשות
              </Button>
              <Button variant="ghost" className="text-sm font-medium">
                רכב
              </Button>
              <Button variant="ghost" className="text-sm font-medium">
                יד שניה
              </Button>
              <Button variant="ghost" className="text-sm font-medium">
                דרושים IL
              </Button>
              <Button variant="ghost" className="text-sm font-medium">
                עסקים למכירה
              </Button>
              <Button variant="ghost" className="text-sm font-medium">
                חיות מחמד
              </Button>
              <Button variant="ghost" className="text-sm font-medium">
                בגלי מקצוע
              </Button>
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-muted text-sm">Y</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">yossi</span>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full gap-2">
              <Plus className="h-4 w-4" />
              לפרסם מודעה
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
