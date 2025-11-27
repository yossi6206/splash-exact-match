import { Card, CardContent } from "@/components/ui/card";
import { Calculator, CreditCard, Gavel, ClipboardCheck, Shield, ChevronLeft } from "lucide-react";

const sidebarItems = [
  {
    icon: Calculator,
    title: "מחירון",
    subtitle: "שבדקו את שווי הרכב שמעניין אותך",
  },
  {
    icon: CreditCard,
    title: "מימון רכב",
    subtitle: "למה להתפשר על רכב?",
  },
  {
    icon: Gavel,
    title: "רכבים במכירה פומבית",
    subtitle: "לרכוש את הרכב שרצית, כולל לשכירות, כלי השקעה",
  },
  {
    icon: ClipboardCheck,
    title: "בדיקת רכב לפני קנייה",
    subtitle: "טיולנו לך החגה בעלארית באפו בלבדיקה ממומש",
  },
  {
    icon: Shield,
    title: "השוואת ביטוח רכב",
    subtitle: "ריכזו עבר הצעות הביטוח הכי טובות ומשתלם",
  },
];

export const CarSidebar = () => {
  return (
    <div className="space-y-4 hidden lg:block">
      <h3 className="text-lg font-bold text-foreground mb-4">כל מה שצריך לדעת בקניית רכב</h3>
      {sidebarItems.map((item, index) => (
        <Card 
          key={index} 
          className="overflow-hidden hover:shadow-md transition-all cursor-pointer border-border bg-white group"
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-foreground mb-1 text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.subtitle}</p>
              </div>
              <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
