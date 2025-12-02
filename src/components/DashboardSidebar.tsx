import { NavLink } from "@/components/NavLink";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  LayoutGrid, 
  Edit3, 
  BarChart3, 
  Heart, 
  Search, 
  Lightbulb, 
  LogOut,
  Phone,
  MessageSquare,
  Sparkles,
  TrendingUp,
  PlusCircle,
  Home
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const menuItems = [
  { title: "פרסום מודעה חדשה", icon: PlusCircle, path: "/dashboard/post-wizard" },
  { title: "המודעות שלי", icon: LayoutGrid, path: "/dashboard/ads" },
  { title: "קידום מודעות", icon: Sparkles, path: "/dashboard/promote" },
  { title: "ניתוח קידום מתקדם", icon: TrendingUp, path: "/dashboard/promotion-analytics" },
  { title: "הודעות", icon: MessageSquare, path: "/messages" },
  { title: "פרסם פרופיל פרילנסר", icon: Edit3, path: "/dashboard/post-freelancer" },
  { title: "עדכון פרטים", icon: Edit3, path: "/dashboard/profile" },
  { title: "סטטיסטיקות", icon: BarChart3, path: "/dashboard/stats" },
  { title: "מודעות שמורות", icon: Heart, path: "/dashboard/saved" },
  { title: "חיפושים אחרונים", icon: Search, path: "/dashboard/searches" },
  { title: "טיפים ומידע", icon: Lightbulb, path: "/dashboard/tips" },
];

export const DashboardSidebar = () => {
  const { user, signOut } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'משתמש';
  const displayEmail = user?.email || '';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <aside className="hidden md:flex w-80 bg-gradient-to-b from-background to-muted/30 border-l border-border flex-col shadow-lg">
      {/* User Profile Section */}
      <div className="p-6 text-center border-b border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="relative inline-block">
          <Avatar className="w-20 h-20 mx-auto mb-3 ring-4 ring-primary/20 shadow-lg">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-0.5">{displayName}</h2>
        <p className="text-xs text-muted-foreground">{displayEmail}</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-primary/5 hover:text-foreground transition-all duration-200 group text-right"
                activeClassName="bg-primary/10 text-primary shadow-sm border-r-4 border-primary"
              >
                <span className="font-medium flex-1 text-sm">{item.title}</span>
                <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border/50 space-y-2 bg-muted/20">
        <Link to="/">
          <Button 
            variant="secondary" 
            className="w-full justify-between h-10 text-sm"
          >
            <span>חזרה לדף הבית</span>
            <Home className="h-4 w-4" />
          </Button>
        </Link>
        <Button 
          variant="secondary" 
          className="w-full justify-between h-10 text-sm"
        >
          <span>צור קשר</span>
          <Phone className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-between text-destructive hover:bg-destructive/10 hover:text-destructive h-10 text-sm"
          onClick={signOut}
        >
          <span>התנתקות</span>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
};
