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
  { name: "נדל״ן", icon: Home },
  { name: "דירות חדשות", icon: Building2 },
];

const Categories = () => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                className="flex flex-col items-center gap-3 group cursor-pointer transition-transform hover:scale-105"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-category-bg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <Icon className="w-10 h-10 md:w-12 md:h-12 text-foreground/70" />
                </div>
                <span className="text-sm md:text-base font-medium text-foreground">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
