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
  Phone
} from "lucide-react";

const menuItems = [
  { title: "המודעות שלי", icon: LayoutGrid, path: "/dashboard/ads" },
  { title: "עדכון פרטים", icon: Edit3, path: "/dashboard/profile" },
  { title: "סטטיסטיקות", icon: BarChart3, path: "/dashboard/stats" },
  { title: "מודעות שמורות", icon: Heart, path: "/dashboard/saved" },
  { title: "חיפושים אחרונים", icon: Search, path: "/dashboard/searches" },
  { title: "טיפים ומידע", icon: Lightbulb, path: "/dashboard/tips" },
  { title: "הגדרות", icon: Settings, path: "/dashboard/settings" },
];

export const DashboardSidebar = () => {
  return (
    <aside className="w-80 bg-slate-800/90 backdrop-blur-sm border-l border-slate-700 flex flex-col">
      {/* User Profile Section */}
      <div className="p-8 text-center border-b border-slate-700">
        <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-primary/20">
          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold">
            y
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold text-white mb-1">yossi cohen</h2>
        <p className="text-sm text-slate-400">yossi6206@gmail.com</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className="flex items-center gap-4 px-6 py-4 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 group"
                activeClassName="bg-gradient-to-l from-primary/20 to-transparent text-white border-r-4 border-primary"
              >
                <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-slate-700 space-y-3">
        <Button 
          variant="outline" 
          className="w-full bg-white/10 border-slate-600 text-white hover:bg-white/20 hover:border-slate-500"
        >
          <Phone className="ml-2 h-4 w-4" />
          צור קשר
        </Button>
        <Button 
          variant="outline" 
          className="w-full bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50"
        >
          <LogOut className="ml-2 h-4 w-4" />
          התנתקות
        </Button>
      </div>
    </aside>
  );
};
