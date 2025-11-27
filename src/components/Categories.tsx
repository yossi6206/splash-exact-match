import { useState } from "react";
import categoryBusiness from "@/assets/category-business.png";
import categoryTools from "@/assets/category-tools.png";
import categoryJobs from "@/assets/category-jobs.png";
import categorySecondhand from "@/assets/category-secondhand.png";
import categoryCars from "@/assets/category-cars.png";
import categoryRealestate from "@/assets/category-realestate.png";
import categoryApartments from "@/assets/category-apartments.png";

const categories = [
  { name: "עסקים למכירה", image: categoryBusiness },
  { name: "בגלי מקצוע", image: categoryTools },
  { name: "דרושים", image: categoryJobs },
  { name: "יד שניה", image: categorySecondhand },
  { name: "רכב", image: categoryCars },
  { 
    name: "נדל״ן", 
    image: categoryRealestate,
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
  { name: "דירות חדשות", image: categoryApartments },
];

const Categories = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-background relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
          {categories.map((category) => {
            return (
              <div 
                key={category.name}
                className="relative"
                onMouseEnter={() => setHoveredCategory(category.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <button
                  className="flex flex-col items-center gap-3 md:gap-4 group cursor-pointer transition-all duration-300"
                >
                  <div className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:scale-105 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-xs md:text-sm lg:text-base font-semibold text-foreground text-center max-w-[100px] md:max-w-none group-hover:text-primary transition-colors duration-300">
                    {category.name}
                  </span>
                </button>

                {/* Mega Menu - Hidden on mobile */}
                {category.megaMenu && hoveredCategory === category.name && (
                  <div 
                    className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 pt-6 z-50"
                  >
                    {/* Invisible bridge to prevent menu from closing */}
                    <div className="absolute top-0 left-0 right-0 h-6" />
                    <div className="bg-white dark:bg-background border-2 border-gray-200 dark:border-border rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] p-8 w-[900px] animate-fade-in">
                      <div className="grid grid-cols-5 gap-6">
                        {category.megaMenu.columns.map((column, index) => (
                          <div key={index}>
                            <h3 className="text-sm font-bold text-primary mb-3 pb-2 border-b-2 border-primary/30">
                              {column.title}
                            </h3>
                            <ul className="space-y-2">
                              {column.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <a 
                                    href="#" 
                                    className="text-sm text-foreground hover:text-primary transition-colors duration-200 block py-1.5 hover:underline hover:translate-x-1 transition-transform"
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
