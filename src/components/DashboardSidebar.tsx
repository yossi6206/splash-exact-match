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
  { title: "פרסום מודעה חדשה", icon: PlusCircle, path: "/dashboard/post-wizard", color: "text-emerald-600", bgColor: "bg-gradient-to-br from-emerald-100 to-emerald-200" },
  { title: "המודעות שלי", icon: LayoutGrid, path: "/dashboard/ads", color: "text-blue-600", bgColor: "bg-gradient-to-br from-blue-100 to-blue-200" },
  { title: "קידום מודעות", icon: Sparkles, path: "/dashboard/promote", color: "text-amber-600", bgColor: "bg-gradient-to-br from-amber-100 to-amber-200" },
  { title: "ניתוח קידום מתקדם", icon: TrendingUp, path: "/dashboard/promotion-analytics", color: "text-violet-600", bgColor: "bg-gradient-to-br from-violet-100 to-violet-200" },
  { title: "הודעות", icon: MessageSquare, path: "/messages", color: "text-sky-600", bgColor: "bg-gradient-to-br from-sky-100 to-sky-200" },
  { title: "פרסם פרופיל פרילנסר", icon: Edit3, path: "/dashboard/post-freelancer", color: "text-orange-600", bgColor: "bg-gradient-to-br from-orange-100 to-orange-200" },
  { title: "עדכון פרטים", icon: Edit3, path: "/dashboard/profile", color: "text-slate-600", bgColor: "bg-gradient-to-br from-slate-100 to-slate-200" },
  { title: "סטטיסטיקות", icon: BarChart3, path: "/dashboard/stats", color: "text-indigo-600", bgColor: "bg-gradient-to-br from-indigo-100 to-indigo-200" },
  { title: "מודעות שמורות", icon: Heart, path: "/dashboard/saved", color: "text-rose-600", bgColor: "bg-gradient-to-br from-rose-100 to-rose-200" },
  { title: "חיפושים אחרונים", icon: Search, path: "/dashboard/searches", color: "text-teal-600", bgColor: "bg-gradient-to-br from-teal-100 to-teal-200" },
  { title: "טיפים ומידע", icon: Lightbulb, path: "/dashboard/tips", color: "text-yellow-600", bgColor: "bg-gradient-to-br from-yellow-100 to-yellow-200" },
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
                <div className={`w-10 h-10 rounded-xl ${item.bgColor} flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-200`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
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
            className="w-full justify-between h-11 text-sm"
          >
            <span>חזרה לדף הבית</span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-sm">
              <Home className="h-4 w-4 text-blue-600" />
            </div>
          </Button>
        </Link>
        <Button 
          variant="secondary" 
          className="w-full justify-between h-11 text-sm"
        >
          <span>צור קשר</span>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center shadow-sm">
            <Phone className="h-4 w-4 text-emerald-600" />
          </div>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-between text-destructive hover:bg-destructive/10 hover:text-destructive h-11 text-sm"
          onClick={signOut}
        >
          <span>התנתקות</span>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center shadow-sm">
            <LogOut className="h-4 w-4 text-red-600" />
          </div>
        </Button>
      </div>
    </aside>
  );
};
