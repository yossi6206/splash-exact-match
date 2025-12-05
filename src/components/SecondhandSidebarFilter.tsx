import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, CheckSquare, MapPin, Tag, Palette, RotateCcw, Settings2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { 
  categories as allCategories, 
  subcategories as allSubcategories, 
  conditions, 
  cities, 
  colors,
  getFiltersForCategory,
  categorySlugToHebrew
} from "@/data/secondhandFilterConfig";

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
  categoryType?: string; // URL slug like "furniture", "electronics"
  selectedSubcategory?: string;
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
  // Dynamic filters
  types: string[];
  features: string[];
  [key: string]: string[] | number | boolean;
}

export const SecondhandSidebarFilter = ({ 
  onFilterChange, 
  counts,
  priceRange = { min: 0, max: 10000 },
  availableBrands,
  availableColors,
  categoryType,
  selectedSubcategory
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
    types: [],
    features: [],
  });

  // Get Hebrew category name from slug
  const hebrewCategory = categoryType ? categorySlugToHebrew[categoryType] : undefined;
  
  // Get dynamic filters based on category and subcategory
  const dynamicFilters = useMemo((): Record<string, string[]> => {
    if (!hebrewCategory) return {};
    return getFiltersForCategory(hebrewCategory, selectedSubcategory) as Record<string, string[]>;
  }, [hebrewCategory, selectedSubcategory]);

  // Get subcategories for current category
  const currentSubcategories = useMemo(() => {
    if (!hebrewCategory) return [];
    return allSubcategories[hebrewCategory] || [];
  }, [hebrewCategory]);

  const handleArrayFilterChange = (key: string, value: string) => {
    const currentValues = (filters[key] as string[]) || [];
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

  const resetFilters = () => {
    const defaultFilters: SecondhandFilters = {
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
      types: [],
      features: [],
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  const renderFilterSection = (
    title: string,
    icon: React.ReactNode,
    options: string[],
    filterKey: string,
    countsKey?: string
  ) => {
    if (!options || options.length === 0) return null;
    
    return (
      <>
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            {icon}
            {title}
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {options.map((option) => (
              <div key={option} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`${filterKey}-${option}`}
                    checked={((filters[filterKey] as string[]) || []).includes(option)}
                    onCheckedChange={() => handleArrayFilterChange(filterKey, option)}
                  />
                  <Label
                    htmlFor={`${filterKey}-${option}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
                {countsKey && counts?.[countsKey as keyof typeof counts]?.[option] && (
                  <span className="text-xs text-muted-foreground">
                    ({counts[countsKey as keyof typeof counts]![option]})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <Separator />
      </>
    );
  };

  return (
    <Card className="sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          סינון מוצרים
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-muted-foreground hover:text-foreground">
          <RotateCcw className="w-4 h-4 ml-1" />
          איפוס
        </Button>
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

        {/* Subcategories - only show if we have a category */}
        {categoryType && currentSubcategories.length > 0 && renderFilterSection(
          "תת-קטגוריה",
          <Package className="w-4 h-4 text-primary" />,
          currentSubcategories,
          "subcategories",
          "subcategories"
        )}

        {/* Categories - only show if no category is selected */}
        {!categoryType && renderFilterSection(
          "קטגוריה",
          <Package className="w-4 h-4 text-primary" />,
          allCategories,
          "categories",
          "categories"
        )}

        {/* Condition */}
        {renderFilterSection(
          "מצב המוצר",
          <CheckSquare className="w-4 h-4 text-primary" />,
          conditions,
          "conditions",
          "conditions"
        )}

        {/* Dynamic Type Filters (based on subcategory) */}
        {dynamicFilters.types && renderFilterSection(
          "סוג",
          <Settings2 className="w-4 h-4 text-primary" />,
          dynamicFilters.types as string[],
          "types"
        )}

        {/* Brands */}
        {(dynamicFilters.brands || availableBrands) && renderFilterSection(
          "מותג",
          <Tag className="w-4 h-4 text-primary" />,
          (dynamicFilters.brands as string[]) || availableBrands || [],
          "brands",
          "brands"
        )}

        {/* Sizes */}
        {dynamicFilters.sizes && renderFilterSection(
          "מידה",
          <Tag className="w-4 h-4 text-primary" />,
          dynamicFilters.sizes as string[],
          "sizes",
          "sizes"
        )}

        {/* Materials */}
        {dynamicFilters.materials && renderFilterSection(
          "חומר",
          <Tag className="w-4 h-4 text-primary" />,
          dynamicFilters.materials as string[],
          "materials",
          "materials"
        )}

        {/* Features */}
        {dynamicFilters.features && renderFilterSection(
          "תכונות",
          <CheckSquare className="w-4 h-4 text-primary" />,
          dynamicFilters.features as string[],
          "features"
        )}

        {/* Colors */}
        {renderFilterSection(
          "צבע",
          <Palette className="w-4 h-4 text-primary" />,
          availableColors || colors,
          "colors",
          "colors"
        )}

        {/* City */}
        {renderFilterSection(
          "מיקום",
          <MapPin className="w-4 h-4 text-primary" />,
          cities,
          "cities",
          "cities"
        )}

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
              <Label htmlFor="delivery" className="text-sm font-normal cursor-pointer">
                משלוח זמין
              </Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox 
                id="negotiable"
                checked={filters.negotiable}
                onCheckedChange={() => handleBooleanChange('negotiable')}
              />
              <Label htmlFor="negotiable" className="text-sm font-normal cursor-pointer">
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
