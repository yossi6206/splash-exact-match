import { Link } from "react-router-dom";
import categoryBusiness from "@/assets/category-business.png";
import categoryTools from "@/assets/category-tools.png";
import categoryJobs from "@/assets/category-jobs.png";
import categorySecondhand from "@/assets/category-secondhand.png";
import categoryCars from "@/assets/category-cars.png";
import categoryRealestate from "@/assets/category-realestate.png";
import categoryApartments from "@/assets/category-apartments.png";

const categories = [
  { name: "עסקים למכירה", image: categoryBusiness, items: "2,345", link: "/secondhand?category=business" },
  { name: "בגלי מקצוע", image: categoryTools, items: "8,932", link: "/secondhand?category=tools" },
  { name: "דרושים", image: categoryJobs, items: "5,678", link: "/jobs" },
  { name: "יד שניה", image: categorySecondhand, items: "12,456", link: "/secondhand" },
  { name: "רכב", image: categoryCars, items: "9,234", link: "/cars" },
  { name: "נדל״ן", image: categoryRealestate, items: "7,891", link: "/properties" },
  { name: "דירות חדשות", image: categoryApartments, items: "3,567", link: "/properties?type=new" },
];

const Categories = () => {
  return (
    <section className="py-12 md:py-16 bg-white dark:bg-background relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-danidin font-black text-foreground">קטגוריות פופולריות</h2>
          <a 
            href="#" 
            className="text-sm md:text-base font-semibold text-primary hover:text-primary/80 transition-colors duration-200 flex items-center gap-2"
          >
            צפה בכל
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.link}
              className="flex flex-col items-center gap-3 md:gap-4 group cursor-pointer transition-all duration-300"
            >
              <div className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center shadow-[0_2px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:scale-105 overflow-hidden relative">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Hover overlay with item count */}
                <div className="absolute inset-0 bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                  <div className="text-center text-white">
                    <div className="text-lg md:text-2xl lg:text-3xl font-bold">{category.items}</div>
                    <div className="text-[10px] md:text-xs lg:text-sm font-medium mt-1">פריטים</div>
                  </div>
                </div>
              </div>
              <span className="text-xs md:text-sm lg:text-base font-semibold text-foreground text-center max-w-[100px] md:max-w-none group-hover:text-primary transition-colors duration-300">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
