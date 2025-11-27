import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Heart, Plus, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-12 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
                <span className="text-2xl font-extrabold text-primary-foreground">yad2</span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" className="text-sm font-medium" asChild>
                <Link to="/properties">נדל"ן</Link>
              </Button>
              <Button variant="ghost" className="text-sm font-medium" asChild>
                <Link to="/cars">רכב</Link>
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
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-sm">
                        {getInitials(user.email || "")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.email?.split('@')[0]}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-semibold">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="ml-2 h-4 w-4" />
                    <span>לוח הבקרה</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="ml-2 h-4 w-4" />
                    <span>הגדרות</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive" onClick={signOut}>
                    <LogOut className="ml-2 h-4 w-4" />
                    <span>התנתק</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                className="hidden md:flex"
                onClick={() => navigate("/auth")}
              >
                התחבר
              </Button>
            )}
            
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
