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
  const sideItems = items.slice(1);

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

        {/* Unique Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* First Item - Large Spanning 2 rows and 7 columns */}
          {items[0] && (
            <Link
              to={`/secondhand/${items[0].id}`}
              className="group md:col-span-7 md:row-span-2"
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
                <div className="relative aspect-[4/3] md:aspect-auto md:h-full overflow-hidden bg-muted">
                  <img
                    src={items[0].image}
                    alt={items[0].title}
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
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-white">{items[0].price}</span>
                      {items[0].originalPrice && (
                        <span className="text-sm text-white/80 line-through">
                          {items[0].originalPrice}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg text-white mb-1">
                      {items[0].title}
                    </h3>
                    <p className="text-sm text-white/80">{items[0].location}</p>
                    <div className="mt-2">
                      <span className="text-xs bg-primary text-white px-3 py-1 rounded-full font-medium">
                        {items[0].category}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          )}

          {/* Second and Third Items - Stacked on right */}
          {items[1] && (
            <Link
              to={`/secondhand/${items[1].id}`}
              className="group md:col-span-5"
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={items[1].image}
                    alt={items[1].title}
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
                    <span className="text-lg font-bold text-foreground">{items[1].price}</span>
                    {items[1].originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {items[1].originalPrice}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                    {items[1].title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{items[1].location}</p>
                  <div className="pt-1">
                    <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">
                      {items[1].category}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          )}

          {items[2] && (
            <Link
              to={`/secondhand/${items[2].id}`}
              className="group md:col-span-5"
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={items[2].image}
                    alt={items[2].title}
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
                    <span className="text-lg font-bold text-foreground">{items[2].price}</span>
                    {items[2].originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {items[2].originalPrice}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                    {items[2].title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{items[2].location}</p>
                  <div className="pt-1">
                    <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">
                      {items[2].category}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          )}

          {/* Bottom Row - Two equal items */}
          {items[3] && (
            <Link
              to={`/secondhand/${items[3].id}`}
              className="group md:col-span-6"
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={items[3].image}
                    alt={items[3].title}
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
                    <span className="text-lg font-bold text-foreground">{items[3].price}</span>
                    {items[3].originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {items[3].originalPrice}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                    {items[3].title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{items[3].location}</p>
                  <div className="pt-1">
                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                      {items[3].category}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          )}

          {items[4] && (
            <Link
              to={`/secondhand/${items[4].id}`}
              className="group md:col-span-6"
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={items[4].image}
                    alt={items[4].title}
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
                    <span className="text-lg font-bold text-foreground">{items[4].price}</span>
                    {items[4].originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {items[4].originalPrice}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                    {items[4].title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{items[4].location}</p>
                  <div className="pt-1">
                    <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">
                      {items[4].category}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcaseReverse;
