import { Card } from "@/components/ui/card";
import { Home, FileText, ShieldCheck, Calculator, ChevronLeft } from "lucide-react";

const sidebarItems = [
  {
    icon: Home,
    title: "מדריך לקניית דירה",
    subtitle: "כל מה שצריך לדעת"
  },
  {
    icon: FileText,
    title: "בדיקת מסמכים",
    subtitle: "רשימת מסמכים נדרשים"
  },
  {
    icon: ShieldCheck,
    title: "ביטוח דירה",
    subtitle: "למה זה חשוב?"
  },
  {
    icon: Calculator,
    title: "מחשבון משכנתא",
    subtitle: "חשב את התשלום החודשי"
  }
];

export const PropertySidebar = () => {
  return (
    <div className="hidden lg:block space-y-4">
      <h2 className="text-xl font-bold text-foreground mb-4">כל מה שצריך לדעת בקניית נכס</h2>
      
      {sidebarItems.map((item, index) => (
        <Card 
          key={index}
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
              </div>
            </div>
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>
      ))}
    </div>
  );
};