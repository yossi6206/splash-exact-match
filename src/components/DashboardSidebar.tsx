import { NavLink } from "@/components/NavLink";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  LayoutGrid, 
  Edit3, 
  BarChart3, 
  Heart, 
  Search, 
  Lightbulb, 
  Settings,
  LogOut,
  Phone,
  MessageSquare,
  Sparkles,
  TrendingUp
} from "lucide-react";

const menuItems = [
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
  { title: "הגדרות", icon: Settings, path: "/dashboard/settings" },
];

export const DashboardSidebar = () => {
  return (
    <aside className="hidden md:flex w-80 bg-white border-l border-border flex-col shadow-sm">
      {/* User Profile Section */}
      <div className="p-8 text-center border-b border-border">
        <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-primary/10">
          <AvatarFallback className="bg-gradient-to-br from-primary/30 to-secondary/30 text-primary text-2xl font-bold">
            y
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold text-foreground mb-1">yossi cohen</h2>
        <p className="text-sm text-muted-foreground">yossi6206@gmail.com</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className="flex items-center gap-4 px-6 py-4 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200 group text-right"
                activeClassName="bg-primary/10 text-primary border-r-4 border-primary"
              >
                <span className="font-medium flex-1">{item.title}</span>
                <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-border space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-between border-border hover:bg-muted"
        >
          <span>צור קשר</span>
          <Phone className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-between border-primary/30 text-primary hover:bg-primary/10"
        >
          <span>התנתקות</span>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
};
