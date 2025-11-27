import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ShowcaseItem {
  id: number;
  image: string;
  title: string;
  price: string;
  originalPrice?: string;
  location: string;
  category: string;
}

interface CategoryShowcaseReverseProps {
  title: string;
  items: ShowcaseItem[];
  categoryLink: string;
}

const CategoryShowcaseReverse = ({ title, items, categoryLink }: CategoryShowcaseReverseProps) => {
  if (items.length < 4) return null;

  const mainItem = items[0];
  const sideItems = items.slice(1, 4);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h2>
          <Link
            to={categoryLink}
            className="text-primary hover:text-primary/80 font-medium flex items-center gap-2 transition-colors"
          >
            <span>לכל המוצרים</span>
            <span>←</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Side Items Grid - Left Side */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-6">
            {/* Top Row - Two Small Items */}
            {sideItems.slice(0, 2).map((item) => (
              <Link
                key={item.id}
                to={`/secondhand/${item.id}`}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 bg-background/90 hover:bg-background rounded-full h-9 w-9"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-foreground">{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {item.originalPrice}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.location}</p>
                    <div className="pt-1">
                      <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
            
            {/* Bottom Row - One Wide Item */}
            {sideItems[2] && (
              <Link
                to={`/secondhand/${sideItems[2].id}`}
                className="group col-span-2"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={sideItems[2].image}
                      alt={sideItems[2].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 bg-background/90 hover:bg-background rounded-full h-9 w-9"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-foreground">{sideItems[2].price}</span>
                      {sideItems[2].originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {sideItems[2].originalPrice}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                      {sideItems[2].title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{sideItems[2].location}</p>
                    <div className="pt-1">
                      <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">
                        {sideItems[2].category}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            )}
          </div>

          {/* Main Large Item - Right Side */}
          <Link
            to={`/secondhand/${mainItem.id}`}
            className="lg:col-span-1 group lg:order-first"
          >
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
              <div className="relative aspect-[3/4] lg:h-full overflow-hidden bg-muted">
                <img
                  src={mainItem.image}
                  alt={mainItem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-3 right-3 bg-background/90 hover:bg-background rounded-full h-9 w-9"
                  onClick={(e) => e.preventDefault()}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-foreground">{mainItem.price}</span>
                  {mainItem.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {mainItem.originalPrice}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {mainItem.title}
                </h3>
                <p className="text-sm text-muted-foreground">{mainItem.location}</p>
                <div className="flex gap-2 pt-1">
                  <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    {mainItem.category}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcaseReverse;
