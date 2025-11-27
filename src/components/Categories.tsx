import { useState } from "react";
import { 
  Store, 
  Wrench, 
  Briefcase, 
  Sofa, 
  Car, 
  Home, 
  Building2 
} from "lucide-react";

const categories = [
  { name: "עסקים למכירה", icon: Store },
  { name: "בגלי מקצוע", icon: Wrench },
  { name: "דרושים", icon: Briefcase },
  { name: "יד שניה", icon: Sofa },
  { name: "רכב", icon: Car },
  { 
    name: "נדל״ן", 
    icon: Home,
    megaMenu: {
      columns: [
        {
          title: "דירות למכירה",
          items: ["דירות גן", "פנטהאוז", "דירות סטודיו", "דירות דופלקס", "דירות רגילות"]
        },
        {
          title: "בתים ונכסים מיוחדים",
          items: ["בתים פרטיים", "קוטג'ים", "וילות", "משקים וחוות", "מגרשים"]
        },
        {
          title: "לפי אזור",
          items: ["מרכז", "צפון", "דרום", "ירושלים והסביבה", "השרון", "השפלה"]
        },
        {
          title: "נכסים מסחריים",
          items: ["נכסים להשקעה", "חניות", "נכסי נופש"]
        },
        {
          title: "דירות להשכרה",
          items: ["דירות לטווח ארוך", "דירות לטווח קצר", "חדרים בשותפות", "מחסנים"]
        }
      ]
    }
  },
  { name: "דירות חדשות", icon: Building2 },
];

const Categories = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <section className="py-8 md:py-12 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div 
                key={category.name}
                className="relative"
                onMouseEnter={() => setHoveredCategory(category.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <button
                  className="flex flex-col items-center gap-2 md:gap-3 group cursor-pointer transition-transform hover:scale-105"
                >
                  <div className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full bg-category-bg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <Icon className="w-7 h-7 md:w-10 md:h-10 lg:w-12 lg:h-12 text-foreground/70" />
                  </div>
                  <span className="text-xs md:text-sm lg:text-base font-medium text-foreground text-center max-w-[80px] md:max-w-none">
                    {category.name}
                  </span>
                </button>

                {/* Mega Menu - Hidden on mobile */}
                {category.megaMenu && hoveredCategory === category.name && (
                  <div 
                    className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50"
                  >
                    {/* Invisible bridge to prevent menu from closing */}
                    <div className="absolute top-0 left-0 right-0 h-4" />
                    <div className="bg-background border border-border rounded-lg shadow-xl p-8 w-[900px] animate-fade-in">
                      <div className="grid grid-cols-5 gap-6">
                        {category.megaMenu.columns.map((column, index) => (
                          <div key={index}>
                            <h3 className="text-sm font-bold text-primary mb-3 pb-2 border-b-2 border-primary/20">
                              {column.title}
                            </h3>
                            <ul className="space-y-1.5">
                              {column.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <a 
                                    href="#" 
                                    className="text-sm text-foreground hover:text-primary transition-colors block py-1.5 hover:underline"
                                  >
                                    {item}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
