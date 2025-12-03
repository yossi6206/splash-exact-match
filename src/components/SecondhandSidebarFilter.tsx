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
    sizes?: Record<string, number>;
    colors?: Record<string, number>;
    materials?: Record<string, number>;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  availableBrands?: string[];
  availableSizes?: string[];
  availableColors?: string[];
  availableMaterials?: string[];
  categoryType?: string;
}

export interface SecondhandFilters {
  categories: string[];
  subcategories: string[];
  priceMin: number;
  priceMax: number;
  conditions: string[];
  cities: string[];
  brands: string[];
  sizes: string[];
  colors: string[];
  materials: string[];
  deliveryAvailable: boolean;
  negotiable: boolean;
}

const categories = ["ריהוט", "מוצרי חשמל", "ספורט ופנאי", "אופנה", "תינוקות וילדים"];

const subcategories: Record<string, string[]> = {
  "ריהוט": [
    "ספות", "כורסאות", "שולחנות אוכל", "שולחנות סלון", "כיסאות",
    "ארונות בגדים", "ארונות נעליים", "מיטות זוגיות", "מיטות יחיד",
    "שידות", "מדפים", "מראות", "ארונות מטבח", "שולחנות עבודה"
  ],
  "מוצרי חשמל": [
    "מקררים", "מקפיאים", "מכונות כביסה", "מייבשי כביסה",
    "תנורים", "כיריים", "מיקרוגל", "מזגנים", "מאווררים",
    "מדיחי כלים", "שואבי אבק", "מערכות סטריאו", "טלוויזיות"
  ],
  "ספורט ופנאי": [
    "אופני כביש", "אופני הרים", "אופניים חשמליים", "קורקינטים",
    "ציוד כושר ביתי", "משקולות", "הליכונים", "אופני כושר",
    "משחקי קופסא", "משחקי וידאו", "ספרים", "גיטרות", "פסנתרים", "תופים"
  ],
  "אופנה": [
    "חולצות", "מכנסיים", "שמלות", "חצאיות", "מעילים",
    "נעלי ספורט", "נעלי עקב", "סנדלים", "מגפיים",
    "תיקי יד", "תיקי גב", "שעונים", "תכשיטים", "משקפי שמש"
  ],
  "תינוקות וילדים": [
    "עגלות", "טיולונים", "כיסאות אוכל", "מיטות תינוק", "עריסות",
    "צעצועי התפתחות", "משחקי בנייה", "בגדי תינוקות (0-2)",
    "בגדי ילדים (2-6)", "בגדי ילדים (6-12)", "אביזרי האכלה", "מוצצים ובקבוקים"
  ]
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

// Category-specific sizes
const categorySizes: Record<string, string[]> = {
  "ריהוט": ["קטן", "בינוני", "גדול", "ענק", "חד-מושבי", "דו-מושבי", "תלת-מושבי"],
  "מוצרי חשמל": ["קטן", "בינוני", "גדול", "משפחתי"],
  "ספורט ופנאי": ["S", "M", "L", "XL", "XXL", '26"', '27.5"', '29"'],
  "אופנה": ["XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42", "43", "44"],
  "תינוקות וילדים": ["0-6 חודשים", "6-12 חודשים", "1-2 שנים", "2-4 שנים", "4-6 שנים", "6-8 שנים", "8-12 שנים"],
};

const colors = ["לבן", "שחור", "אפור", "חום", "בז'", "כחול", "ירוק", "אדום", "ורוד", "סגול", "צהוב", "כתום", "כסוף", "זהב", "צבעוני"];
const materials = ["עץ מלא", "עץ MDF", "מתכת", "פלסטיק", "זכוכית", "עור", "בד", "ראטן", "שילוב"];

export const SecondhandSidebarFilter = ({ 
  onFilterChange, 
  counts, 
  priceRange, 
  availableBrands,
  availableSizes,
  availableColors,
  availableMaterials,
  categoryType 
}: SecondhandSidebarFilterProps) => {
  const defaultPriceMax = priceRange?.max || 10000;
  const defaultPriceMin = priceRange?.min || 0;

  const [filters, setFilters] = useState<SecondhandFilters>({
    categories: [],
    subcategories: [],
    priceMin: defaultPriceMin,
    priceMax: defaultPriceMax,
    conditions: [],
    cities: [],
    brands: [],
    sizes: [],
    colors: [],
    materials: [],
    deliveryAvailable: false,
    negotiable: false,
  });

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    subcategory: false,
    price: true,
    condition: true,
    city: false,
    brand: false,
    size: false,
    color: false,
    material: false,
    options: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleArrayFilterChange = (
    key: keyof Pick<SecondhandFilters, 'categories' | 'subcategories' | 'conditions' | 'cities' | 'brands' | 'sizes' | 'colors' | 'materials'>,
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
      priceMin: defaultPriceMin,
      priceMax: defaultPriceMax,
      conditions: [],
      cities: [],
      brands: [],
      sizes: [],
      colors: [],
      materials: [],
      deliveryAvailable: false,
      negotiable: false,
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  const activeFiltersCount = 
    filters.categories.length +
    filters.subcategories.length +
    filters.conditions.length +
    filters.cities.length +
    filters.brands.length +
    filters.sizes.length +
    filters.colors.length +
    filters.materials.length +
    (filters.deliveryAvailable ? 1 : 0) +
    (filters.negotiable ? 1 : 0) +
    ((filters.priceMin !== defaultPriceMin || filters.priceMax !== defaultPriceMax) ? 1 : 0);

  const availableSubcategories = filters.categories.length === 1 
    ? subcategories[filters.categories[0]] || []
    : [];

  // Get sizes based on category
  const displaySizes = availableSizes && availableSizes.length > 0
    ? availableSizes
    : categoryType && categorySizes[categoryType]
    ? categorySizes[categoryType]
    : [];

  // Get brands to display
  const displayBrands = availableBrands && availableBrands.length > 0
    ? availableBrands
    : popularBrands;

  // Get colors to display
  const displayColors = availableColors && availableColors.length > 0
    ? availableColors
    : colors;

  // Get materials to display
  const displayMaterials = availableMaterials && availableMaterials.length > 0
    ? availableMaterials
    : materials;

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

        <div className="max-h-[calc(100vh-280px)] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-track]:bg-transparent">
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
                min={defaultPriceMin}
                max={defaultPriceMax}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₪{defaultPriceMin.toLocaleString()}</span>
                <span>₪{defaultPriceMax.toLocaleString()}+</span>
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
          {displayBrands.length > 0 && (
            <FilterSection title="מותגים" section="brand">
              <div className="space-y-3">
                {displayBrands.slice(0, 12).map((brand) => (
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
          )}

          {/* Sizes */}
          {displaySizes.length > 0 && (
            <FilterSection title="גודל/מידה" section="size">
              <div className="space-y-3">
                {displaySizes.map((size) => (
                  <div key={size} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <label
                        htmlFor={`size-${size}`}
                        className="text-sm text-foreground cursor-pointer flex-1 text-right"
                      >
                        {size}
                      </label>
                      {counts?.sizes?.[size] !== undefined && (
                        <Badge variant="outline" className="h-5 text-xs px-1.5">
                          {counts.sizes[size]}
                        </Badge>
                      )}
                    </div>
                    <Checkbox
                      id={`size-${size}`}
                      checked={filters.sizes.includes(size)}
                      onCheckedChange={() => handleArrayFilterChange('sizes', size)}
                    />
                  </div>
                ))}
              </div>
            </FilterSection>
          )}

          {/* Colors */}
          {(categoryType === "ריהוט" || categoryType === "אופנה" || categoryType === "ספורט ופנאי" || categoryType === "תינוקות וילדים") && displayColors.length > 0 && (
            <FilterSection title="צבע" section="color">
              <div className="space-y-3">
                {displayColors.slice(0, 12).map((color) => (
                  <div key={color} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <label
                        htmlFor={`color-${color}`}
                        className="text-sm text-foreground cursor-pointer flex-1 text-right"
                      >
                        {color}
                      </label>
                      {counts?.colors?.[color] !== undefined && (
                        <Badge variant="outline" className="h-5 text-xs px-1.5">
                          {counts.colors[color]}
                        </Badge>
                      )}
                    </div>
                    <Checkbox
                      id={`color-${color}`}
                      checked={filters.colors.includes(color)}
                      onCheckedChange={() => handleArrayFilterChange('colors', color)}
                    />
                  </div>
                ))}
              </div>
            </FilterSection>
          )}

          {/* Materials */}
          {categoryType === "ריהוט" && displayMaterials.length > 0 && (
            <FilterSection title="חומר" section="material">
              <div className="space-y-3">
                {displayMaterials.map((material) => (
                  <div key={material} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <label
                        htmlFor={`material-${material}`}
                        className="text-sm text-foreground cursor-pointer flex-1 text-right"
                      >
                        {material}
                      </label>
                      {counts?.materials?.[material] !== undefined && (
                        <Badge variant="outline" className="h-5 text-xs px-1.5">
                          {counts.materials[material]}
                        </Badge>
                      )}
                    </div>
                    <Checkbox
                      id={`material-${material}`}
                      checked={filters.materials.includes(material)}
                      onCheckedChange={() => handleArrayFilterChange('materials', material)}
                    />
                  </div>
                ))}
              </div>
            </FilterSection>
          )}

          {/* Additional Options */}
          <FilterSection title="אפשרויות נוספות" section="options">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <label
                    htmlFor="delivery-available"
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    אפשרות למשלוח
                  </label>
                </div>
                <Checkbox
                  id="delivery-available"
                  checked={filters.deliveryAvailable}
                  onCheckedChange={(checked) => {
                    const newFilters = { ...filters, deliveryAvailable: checked as boolean };
                    setFilters(newFilters);
                    onFilterChange?.(newFilters);
                  }}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <label
                    htmlFor="negotiable"
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    ניתן למיקוח
                  </label>
                </div>
                <Checkbox
                  id="negotiable"
                  checked={filters.negotiable}
                  onCheckedChange={(checked) => {
                    const newFilters = { ...filters, negotiable: checked as boolean };
                    setFilters(newFilters);
                    onFilterChange?.(newFilters);
                  }}
                />
              </div>
            </div>
          </FilterSection>
        </div>
      </Card>
      </div>
    </div>
  );
};
