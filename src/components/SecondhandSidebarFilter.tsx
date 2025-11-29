import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface SecondhandSidebarFilterProps {
  onFilterChange?: (filters: SecondhandFilters) => void;
  counts?: {
    categories?: Record<string, number>;
    subcategories?: Record<string, number>;
    conditions?: Record<string, number>;
    cities?: Record<string, number>;
    brands?: Record<string, number>;
  };
}

export interface SecondhandFilters {
  categories: string[];
  subcategories: string[];
  priceMin: number;
  priceMax: number;
  conditions: string[];
  cities: string[];
  brands: string[];
}

const categories = ["ריהוט", "מוצרי חשמל", "ספורט ופנאי", "אופנה", "תינוקות וילדים"];

const subcategories: Record<string, string[]> = {
  "ריהוט": ["ספות וכורסאות", "שולחנות", "כיסאות", "ארונות", "מיטות"],
  "מוצרי חשמל": ["מקררים", "מכונות כביסה", "תנורים", "מיקרוגלים", "מזגנים"],
  "ספורט ופנאי": ["אופניים", "ציוד כושר", "משחקים", "ספרים", "כלי נגינה"],
  "אופנה": ["בגדים", "נעליים", "תיקים", "אביזרים", "תכשיטים"],
  "תינוקות וילדים": ["עגלות", "כיסאות אוכל", "מיטות", "צעצועים", "בגדי ילדים"],
};

const conditions = ["חדש באריזה", "כמו חדש", "במצב מצוין", "במצב טוב", "במצב סביר", "לשיפוץ"];

const cities = [
  "תל אביב", "ירושלים", "חיפה", "באר שבע", "נתניה", "פתח תקווה",
  "ראשון לציון", "אשדוד", "רחובות", "בני ברק", "הרצליה", "כפר סבא",
  "רעננה", "מודיעין", "רמת גן", "גבעתיים", "חולון", "אשקלון"
];

const popularBrands = [
  "IKEA", "Samsung", "LG", "Bosch", "Nike", "Adidas", "Zara", "H&M",
  "Bugaboo", "Maxi-Cosi", "Giant", "Trek"
];

export const SecondhandSidebarFilter = ({ onFilterChange, counts }: SecondhandSidebarFilterProps) => {
  const [filters, setFilters] = useState<SecondhandFilters>({
    categories: [],
    subcategories: [],
    priceMin: 0,
    priceMax: 10000,
    conditions: [],
    cities: [],
    brands: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    subcategory: false,
    price: true,
    condition: true,
    city: false,
    brand: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleArrayFilterChange = (
    key: keyof Pick<SecondhandFilters, 'categories' | 'subcategories' | 'conditions' | 'cities' | 'brands'>,
    value: string
  ) => {
    const currentValues = filters[key] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    const newFilters = { ...filters, [key]: newValues };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...filters, priceMin: value[0], priceMax: value[1] };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      categories: [],
      subcategories: [],
      priceMin: 0,
      priceMax: 10000,
      conditions: [],
      cities: [],
      brands: [],
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  const activeFiltersCount = 
    filters.categories.length +
    filters.subcategories.length +
    filters.conditions.length +
    filters.cities.length +
    filters.brands.length;

  const availableSubcategories = filters.categories.length === 1 
    ? subcategories[filters.categories[0]] || []
    : [];

  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string; 
    section: keyof typeof expandedSections; 
    children: React.ReactNode;
  }) => (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-right"
      >
        {expandedSections[section] ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="font-semibold text-foreground flex-1 text-right">{title}</span>
      </button>
      {expandedSections[section] && (
        <div className="px-4 pb-4">{children}</div>
      )}
    </div>
  );

  return (
    <div className="hidden lg:block">
      <div className="sticky top-20 max-h-[calc(100vh-96px)]">
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 backdrop-blur-md bg-background/95 border-2">
        <div className="bg-card border-b border-border p-4 flex items-center justify-center relative">
          {activeFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={resetFilters}
              className="h-8 gap-1 absolute left-4"
            >
              <X className="h-3 w-3" />
              נקה
            </Button>
          )}
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="h-5">
                {activeFiltersCount}
              </Badge>
            )}
            <h3 className="font-bold text-foreground">סינון תוצאות</h3>
          </div>
        </div>

        <div className="max-h-[calc(100vh-280px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-track]:bg-transparent">
          {/* Category */}
          <FilterSection title="קטגוריה" section="category">
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm text-foreground cursor-pointer flex-1 text-right"
                    >
                      {category}
                    </label>
                    {counts?.categories?.[category] !== undefined && (
                      <Badge variant="outline" className="h-5 text-xs px-1.5">
                        {counts.categories[category]}
                      </Badge>
                    )}
                  </div>
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => handleArrayFilterChange('categories', category)}
                  />
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Subcategory - show only if one category is selected */}
          {availableSubcategories.length > 0 && (
            <FilterSection title="תת-קטגוריה" section="subcategory">
              <div className="space-y-3">
                {availableSubcategories.map((subcat) => (
                  <div key={subcat} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <label
                        htmlFor={`subcat-${subcat}`}
                        className="text-sm text-foreground cursor-pointer flex-1 text-right"
                      >
                        {subcat}
                      </label>
                      {counts?.subcategories?.[subcat] !== undefined && (
                        <Badge variant="outline" className="h-5 text-xs px-1.5">
                          {counts.subcategories[subcat]}
                        </Badge>
                      )}
                    </div>
                    <Checkbox
                      id={`subcat-${subcat}`}
                      checked={filters.subcategories.includes(subcat)}
                      onCheckedChange={() => handleArrayFilterChange('subcategories', subcat)}
                    />
                  </div>
                ))}
              </div>
            </FilterSection>
          )}

          {/* Price Range */}
          <FilterSection title="טווח מחירים" section="price">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-foreground font-medium">
                  ₪{filters.priceMin.toLocaleString()}
                </span>
                <span className="text-foreground font-medium">
                  ₪{filters.priceMax.toLocaleString()}
                </span>
              </div>
              <Slider
                value={[filters.priceMin, filters.priceMax]}
                onValueChange={handlePriceChange}
                min={0}
                max={10000}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₪0</span>
                <span>₪10,000+</span>
              </div>
            </div>
          </FilterSection>

          {/* Condition */}
          <FilterSection title="מצב המוצר" section="condition">
            <div className="space-y-3">
              {conditions.map((condition) => (
                <div key={condition} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <label
                      htmlFor={`condition-${condition}`}
                      className="text-sm text-foreground cursor-pointer flex-1 text-right"
                    >
                      {condition}
                    </label>
                    {counts?.conditions?.[condition] !== undefined && (
                      <Badge variant="outline" className="h-5 text-xs px-1.5">
                        {counts.conditions[condition]}
                      </Badge>
                    )}
                  </div>
                  <Checkbox
                    id={`condition-${condition}`}
                    checked={filters.conditions.includes(condition)}
                    onCheckedChange={() => handleArrayFilterChange('conditions', condition)}
                  />
                </div>
              ))}
            </div>
          </FilterSection>

          {/* City */}
          <FilterSection title="עיר" section="city">
            <div className="space-y-3">
              {cities.slice(0, 10).map((city) => (
                <div key={city} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <label
                      htmlFor={`city-${city}`}
                      className="text-sm text-foreground cursor-pointer flex-1 text-right"
                    >
                      {city}
                    </label>
                    {counts?.cities?.[city] !== undefined && (
                      <Badge variant="outline" className="h-5 text-xs px-1.5">
                        {counts.cities[city]}
                      </Badge>
                    )}
                  </div>
                  <Checkbox
                    id={`city-${city}`}
                    checked={filters.cities.includes(city)}
                    onCheckedChange={() => handleArrayFilterChange('cities', city)}
                  />
                </div>
              ))}
              {cities.length > 10 && (
                <Button variant="ghost" size="sm" className="w-full text-primary">
                  הצג עוד ערים
                </Button>
              )}
            </div>
          </FilterSection>

          {/* Brands */}
          <FilterSection title="מותגים פופולריים" section="brand">
            <div className="space-y-3">
              {popularBrands.map((brand) => (
                <div key={brand} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <label
                      htmlFor={`brand-${brand}`}
                      className="text-sm text-foreground cursor-pointer flex-1 text-right"
                    >
                      {brand}
                    </label>
                    {counts?.brands?.[brand] !== undefined && (
                      <Badge variant="outline" className="h-5 text-xs px-1.5">
                        {counts.brands[brand]}
                      </Badge>
                    )}
                  </div>
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={() => handleArrayFilterChange('brands', brand)}
                  />
                </div>
              ))}
            </div>
          </FilterSection>
        </div>
      </Card>
      </div>
    </div>
  );
};
