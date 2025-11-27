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
    <section className="py-12 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
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
                  className="flex flex-col items-center gap-3 group cursor-pointer transition-transform hover:scale-105"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-category-bg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <Icon className="w-10 h-10 md:w-12 md:h-12 text-foreground/70" />
                  </div>
                  <span className="text-sm md:text-base font-medium text-foreground">
                    {category.name}
                  </span>
                </button>

                {/* Mega Menu */}
                {category.megaMenu && hoveredCategory === category.name && (
                  <div 
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50"
                    onMouseEnter={() => setHoveredCategory(category.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className="bg-background border border-border rounded-lg shadow-lg p-8 w-[800px] animate-fade-in">
                      <div className="grid grid-cols-5 gap-8">
                        {category.megaMenu.columns.map((column, index) => (
                          <div key={index}>
                            <h3 className="text-base font-bold text-primary mb-4 pb-2 border-b-2 border-primary/20">
                              {column.title}
                            </h3>
                            <ul className="space-y-2">
                              {column.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <a 
                                    href="#" 
                                    className="text-sm text-foreground hover:text-primary transition-colors block py-1"
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
