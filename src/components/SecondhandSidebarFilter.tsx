import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, CheckSquare, MapPin, Tag, Palette, RotateCcw, Settings2, Ruler, Zap, Sofa, BedDouble, UtensilsCrossed, Shirt, Baby, Dumbbell, Music, Laptop, Smartphone, Tv, Refrigerator, WashingMachine, Car, Bike, Watch, Gem, ShoppingBag, Armchair } from "lucide-react";
import { useState, useMemo } from "react";
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
  categoryType?: string;
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
  [key: string]: string[] | number | boolean;
}

// Map filter keys to Hebrew labels and icons
const filterLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  // General
  types: { label: "סוג", icon: <Settings2 className="w-4 h-4 text-primary" /> },
  brands: { label: "מותג", icon: <Tag className="w-4 h-4 text-primary" /> },
  sizes: { label: "מידה", icon: <Ruler className="w-4 h-4 text-primary" /> },
  materials: { label: "חומר", icon: <Tag className="w-4 h-4 text-primary" /> },
  features: { label: "תכונות", icon: <CheckSquare className="w-4 h-4 text-primary" /> },
  styles: { label: "סגנון", icon: <Sofa className="w-4 h-4 text-primary" /> },
  assembly: { label: "הרכבה", icon: <Settings2 className="w-4 h-4 text-primary" /> },
  
  // Furniture - Sofas
  upholstery: { label: "חומר ריפוד", icon: <Sofa className="w-4 h-4 text-primary" /> },
  seating: { label: "מספר מושבים", icon: <Armchair className="w-4 h-4 text-primary" /> },
  filling: { label: "סוג מילוי", icon: <Sofa className="w-4 h-4 text-primary" /> },
  
  // Furniture - Beds
  bedSizes: { label: "מידת מיטה", icon: <BedDouble className="w-4 h-4 text-primary" /> },
  mattressTypes: { label: "סוג מזרן", icon: <BedDouble className="w-4 h-4 text-primary" /> },
  hardness: { label: "קשיחות מזרן", icon: <BedDouble className="w-4 h-4 text-primary" /> },
  frame: { label: "חומר מסגרת", icon: <BedDouble className="w-4 h-4 text-primary" /> },
  
  // Furniture - Tables
  shapes: { label: "צורה", icon: <UtensilsCrossed className="w-4 h-4 text-primary" /> },
  extension: { label: "הרחבה", icon: <Settings2 className="w-4 h-4 text-primary" /> },
  tableTop: { label: "חומר משטח", icon: <UtensilsCrossed className="w-4 h-4 text-primary" /> },
  
  // Furniture - Chairs
  base: { label: "סוג בסיס", icon: <Armchair className="w-4 h-4 text-primary" /> },
  
  // Furniture - Closets
  doors: { label: "מספר דלתות", icon: <Settings2 className="w-4 h-4 text-primary" /> },
  internalOrg: { label: "ארגון פנימי", icon: <Settings2 className="w-4 h-4 text-primary" /> },
  
  // Electronics - General
  energyRating: { label: "דירוג אנרגיה", icon: <Zap className="w-4 h-4 text-primary" /> },
  
  // Electronics - Fridges
  fridgeSizes: { label: "נפח", icon: <Refrigerator className="w-4 h-4 text-primary" /> },
  
  // Electronics - Washers
  capacity: { label: "קיבולת", icon: <WashingMachine className="w-4 h-4 text-primary" /> },
  spin: { label: "מהירות סחיטה", icon: <WashingMachine className="w-4 h-4 text-primary" /> },
  
  // Electronics - Ovens
  ovenSize: { label: "גודל תנור", icon: <Settings2 className="w-4 h-4 text-primary" /> },
  
  // Electronics - Cooktops
  burners: { label: "מספר להבות", icon: <Settings2 className="w-4 h-4 text-primary" /> },
  
  // Electronics - AC
  installation: { label: "התקנה", icon: <Settings2 className="w-4 h-4 text-primary" /> },
  
  // Electronics - TVs
  tvSizes: { label: "גודל מסך", icon: <Tv className="w-4 h-4 text-primary" /> },
  os: { label: "מערכת הפעלה", icon: <Tv className="w-4 h-4 text-primary" /> },
  
  // Computers
  processors: { label: "מעבד", icon: <Laptop className="w-4 h-4 text-primary" /> },
  ramOptions: { label: "זיכרון RAM", icon: <Laptop className="w-4 h-4 text-primary" /> },
  storageOptions: { label: "נפח אחסון", icon: <Laptop className="w-4 h-4 text-primary" /> },
  screenSizes: { label: "גודל מסך", icon: <Laptop className="w-4 h-4 text-primary" /> },
  
  // Phones
  phoneConditions: { label: "מצב מכשיר", icon: <Smartphone className="w-4 h-4 text-primary" /> },
  
  // Sports - Bikes
  bikeSizes: { label: "גודל אופניים", icon: <Bike className="w-4 h-4 text-primary" /> },
  gears: { label: "הילוכים", icon: <Bike className="w-4 h-4 text-primary" /> },
  
  // Sports - E-Bikes
  battery: { label: "סוללה", icon: <Zap className="w-4 h-4 text-primary" /> },
  range: { label: "טווח נסיעה", icon: <Bike className="w-4 h-4 text-primary" /> },
  motorLocation: { label: "מיקום מנוע", icon: <Bike className="w-4 h-4 text-primary" /> },
  speed: { label: "מהירות מקסימלית", icon: <Bike className="w-4 h-4 text-primary" /> },
  
  // Sports - Gym
  maxWeight: { label: "משקל מקסימלי", icon: <Dumbbell className="w-4 h-4 text-primary" /> },
  
  // Sports - Instruments
  instrumentConditions: { label: "מצב כלי", icon: <Music className="w-4 h-4 text-primary" /> },
  accessories: { label: "אביזרים", icon: <Music className="w-4 h-4 text-primary" /> },
  
  // Fashion
  genders: { label: "מגדר", icon: <Shirt className="w-4 h-4 text-primary" /> },
  seasons: { label: "עונה", icon: <Shirt className="w-4 h-4 text-primary" /> },
  
  // Fashion - Shoes
  shoeBrands: { label: "מותג נעליים", icon: <Tag className="w-4 h-4 text-primary" /> },
  shoeSizes: { label: "מידת נעל", icon: <Ruler className="w-4 h-4 text-primary" /> },
  width: { label: "רוחב נעל", icon: <Ruler className="w-4 h-4 text-primary" /> },
  
  // Fashion - Bags
  bagBrands: { label: "מותג תיק", icon: <ShoppingBag className="w-4 h-4 text-primary" /> },
  bagMaterials: { label: "חומר תיק", icon: <ShoppingBag className="w-4 h-4 text-primary" /> },
  bagSizes: { label: "גודל תיק", icon: <ShoppingBag className="w-4 h-4 text-primary" /> },
  
  // Fashion - Jewelry
  jewelryMaterials: { label: "חומר תכשיט", icon: <Gem className="w-4 h-4 text-primary" /> },
  stones: { label: "אבן", icon: <Gem className="w-4 h-4 text-primary" /> },
  
  // Fashion - Watches
  watchBrands: { label: "מותג שעון", icon: <Watch className="w-4 h-4 text-primary" /> },
  
  // Baby & Kids
  safety: { label: "תקן בטיחות", icon: <Baby className="w-4 h-4 text-primary" /> },
  weight: { label: "משקל", icon: <Ruler className="w-4 h-4 text-primary" /> },
  maxAge: { label: "גיל מקסימלי", icon: <Baby className="w-4 h-4 text-primary" /> },
  
  // Baby - Cribs
  cribSizes: { label: "מידת מיטת תינוק", icon: <BedDouble className="w-4 h-4 text-primary" /> },
  cribMaterial: { label: "חומר מיטת תינוק", icon: <BedDouble className="w-4 h-4 text-primary" /> },
  
  // Baby - Car Seats
  carSeatDirection: { label: "כיוון ישיבה", icon: <Car className="w-4 h-4 text-primary" /> },
  
  // Baby - Toys
  ageGroups: { label: "קבוצת גיל", icon: <Baby className="w-4 h-4 text-primary" /> },
  toyCondition: { label: "מצב צעצוע", icon: <Baby className="w-4 h-4 text-primary" /> },
  
  // Baby - Clothes
  clothingConditions: { label: "מצב בגד", icon: <Shirt className="w-4 h-4 text-primary" /> },
};

// Keys to skip (already handled separately or are base filters)
const skipKeys = ['conditions', 'cities', 'colors'];

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

  // Get all dynamic filter keys that should be rendered
  const dynamicFilterKeys = useMemo(() => {
    return Object.keys(dynamicFilters).filter(key => 
      !skipKeys.includes(key) && 
      Array.isArray(dynamicFilters[key]) && 
      dynamicFilters[key].length > 0
    );
  }, [dynamicFilters]);

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

  // Render a dynamic filter section
  const renderDynamicFilter = (filterKey: string) => {
    const options = dynamicFilters[filterKey] as string[];
    if (!options || options.length === 0) return null;
    
    const labelConfig = filterLabels[filterKey] || { 
      label: filterKey, 
      icon: <Tag className="w-4 h-4 text-primary" /> 
    };
    
    return renderFilterSection(
      labelConfig.label,
      labelConfig.icon,
      options,
      filterKey
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

        {/* Dynamic Filters - render ALL filters from getFiltersForCategory */}
        {dynamicFilterKeys.map(filterKey => (
          <div key={filterKey}>
            {renderDynamicFilter(filterKey)}
          </div>
        ))}

        {/* Colors - always show */}
        {renderFilterSection(
          "צבע",
          <Palette className="w-4 h-4 text-primary" />,
          availableColors || colors,
          "colors",
          "colors"
        )}

        {/* City - always show */}
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
