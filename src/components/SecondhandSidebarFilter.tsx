import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Package, DollarSign, CheckSquare, MapPin, Tag, Palette } from "lucide-react";
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
  priceRange?: { min: number; max: number };
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
const conditions = ["חדש", "כמו חדש", "במצב טוב", "משומש", "דורש תיקון"];
const cities = [
  "תל אביב", "ירושלים", "חיפה", "באר שבע", "נתניה", "פתח תקווה",
  "ראשון לציון", "אשדוד", "רחובות", "בני ברק", "הרצליה", "כפר סבא"
];
const defaultBrands = ["איקאה", "עמינח", "נטורה", "ACE", "הום סנטר"];
const colors = ["שחור", "לבן", "חום", "אפור", "כחול", "ירוק", "אדום"];

export const SecondhandSidebarFilter = ({ 
  onFilterChange, 
  counts,
  priceRange = { min: 0, max: 10000 },
  availableBrands = defaultBrands,
  availableColors = colors,
  categoryType
}: SecondhandSidebarFilterProps) => {
  const [filters, setFilters] = useState<SecondhandFilters>({
    categories: [],
    subcategories: [],
    priceMin: priceRange.min,
    priceMax: priceRange.max,
    conditions: [],
    cities: [],
    brands: [],
    sizes: [],
    colors: [],
    materials: [],
    deliveryAvailable: false,
    negotiable: false,
  });

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

  const handleBooleanChange = (key: 'deliveryAvailable' | 'negotiable') => {
    const newFilters = { ...filters, [key]: !filters[key] };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          סינון מוצרים
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto overscroll-contain">
        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <Label className="font-semibold">טווח מחירים</Label>
          </div>
          <div className="space-y-4">
            <Slider
              value={[filters.priceMin, filters.priceMax]}
              onValueChange={handlePriceChange}
              min={priceRange.min}
              max={priceRange.max}
              step={50}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₪{filters.priceMin.toLocaleString()}</span>
              <span>₪{filters.priceMax.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Categories */}
        {!categoryType && (
          <>
            <div className="space-y-3">
              <Label className="font-semibold flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                קטגוריה
              </Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox 
                        id={`category-${category}`}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={() => handleArrayFilterChange('categories', category)}
                      />
                      <Label
                        htmlFor={`category-${category}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {category}
                      </Label>
                    </div>
                    {counts?.categories?.[category] && (
                      <span className="text-xs text-muted-foreground">
                        ({counts.categories[category]})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Condition */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-primary" />
            מצב המוצר
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {conditions.map((condition) => (
              <div key={condition} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`condition-${condition}`}
                    checked={filters.conditions.includes(condition)}
                    onCheckedChange={() => handleArrayFilterChange('conditions', condition)}
                  />
                  <Label
                    htmlFor={`condition-${condition}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {condition}
                  </Label>
                </div>
                {counts?.conditions?.[condition] && (
                  <span className="text-xs text-muted-foreground">
                    ({counts.conditions[condition]})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Brands */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            מותג
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableBrands.map((brand) => (
              <div key={brand} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`brand-${brand}`}
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={() => handleArrayFilterChange('brands', brand)}
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {brand}
                  </Label>
                </div>
                {counts?.brands?.[brand] && (
                  <span className="text-xs text-muted-foreground">
                    ({counts.brands[brand]})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Colors */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            צבע
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableColors.map((color) => (
              <div key={color} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`color-${color}`}
                    checked={filters.colors.includes(color)}
                    onCheckedChange={() => handleArrayFilterChange('colors', color)}
                  />
                  <Label
                    htmlFor={`color-${color}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {color}
                  </Label>
                </div>
                {counts?.colors?.[color] && (
                  <span className="text-xs text-muted-foreground">
                    ({counts.colors[color]})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* City */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            מיקום
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {cities.map((city) => (
              <div key={city} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`city-${city}`}
                    checked={filters.cities.includes(city)}
                    onCheckedChange={() => handleArrayFilterChange('cities', city)}
                  />
                  <Label
                    htmlFor={`city-${city}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {city}
                  </Label>
                </div>
                {counts?.cities?.[city] && (
                  <span className="text-xs text-muted-foreground">
                    ({counts.cities[city]})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Additional Options */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-primary" />
            אפשרויות נוספות
          </Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox 
                id="delivery"
                checked={filters.deliveryAvailable}
                onCheckedChange={() => handleBooleanChange('deliveryAvailable')}
              />
              <Label
                htmlFor="delivery"
                className="text-sm font-normal cursor-pointer"
              >
                משלוח זמין
              </Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox 
                id="negotiable"
                checked={filters.negotiable}
                onCheckedChange={() => handleBooleanChange('negotiable')}
              />
              <Label
                htmlFor="negotiable"
                className="text-sm font-normal cursor-pointer"
              >
                מחיר גמיש
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecondhandSidebarFilter;
