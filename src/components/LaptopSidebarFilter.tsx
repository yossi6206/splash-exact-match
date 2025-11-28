import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface LaptopSidebarFilterProps {
  onFilterChange?: (filters: LaptopFilters) => void;
}

export interface LaptopFilters {
  brands: string[];
  processors: string[];
  ramOptions: string[];
  storageOptions: string[];
  screenSizes: string[];
  priceMin: number;
  priceMax: number;
  conditions: string[];
  cities: string[];
}

const brands = ["Apple", "Lenovo", "HP", "Dell", "ASUS", "Microsoft", "MSI", "Acer"];
const processors = ["Intel Core i9", "Intel Core i7", "Intel Core i5", "AMD Ryzen 9", "AMD Ryzen 7", "Apple M3", "Apple M2", "Apple M1"];
const ramOptions = ["4GB", "8GB", "16GB", "32GB", "64GB+"];
const storageOptions = ["128GB", "256GB", "512GB", "1TB", "2TB+"];
const screenSizes = ['עד 13"', '13"-14"', '14"-15"', '15"-16"', '16"+'];
const conditions = ["חדש באריזה", "כמו חדש", "משומש - במצב טוב", "משומש - במצב סביר"];
const cities = [
  "תל אביב", "ירושלים", "חיפה", "באר שבע", "נתניה", "פתח תקווה",
  "ראשון לציון", "אשדוד", "רחובות", "בני ברק", "הרצליה", "כפר סבא"
];

export const LaptopSidebarFilter = ({ onFilterChange }: LaptopSidebarFilterProps) => {
  const [filters, setFilters] = useState<LaptopFilters>({
    brands: [],
    processors: [],
    ramOptions: [],
    storageOptions: [],
    screenSizes: [],
    priceMin: 0,
    priceMax: 20000,
    conditions: [],
    cities: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    processors: false,
    ram: false,
    storage: false,
    screenSize: false,
    price: true,
    condition: false,
    city: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleArrayFilterChange = (
    key: keyof Pick<LaptopFilters, 'brands' | 'processors' | 'ramOptions' | 'storageOptions' | 'screenSizes' | 'conditions' | 'cities'>,
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
      brands: [],
      processors: [],
      ramOptions: [],
      storageOptions: [],
      screenSizes: [],
      priceMin: 0,
      priceMax: 20000,
      conditions: [],
      cities: [],
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  const activeFiltersCount = 
    filters.brands.length +
    filters.processors.length +
    filters.ramOptions.length +
    filters.storageOptions.length +
    filters.screenSizes.length +
    filters.conditions.length +
    filters.cities.length;

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
    <div className="hidden lg:block sticky top-20">
      <Card className="overflow-hidden">
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

        <div className="h-[calc(100vh-120px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Brands */}
          <FilterSection title="יצרן" section="brands">
            <div className="space-y-3">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={`brand-${brand}`}
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    {brand}
                  </label>
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={() => handleArrayFilterChange('brands', brand)}
                  />
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Processors */}
          <FilterSection title="מעבד" section="processors">
            <div className="space-y-3">
              {processors.map((processor) => (
                <div key={processor} className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={`processor-${processor}`}
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    {processor}
                  </label>
                  <Checkbox
                    id={`processor-${processor}`}
                    checked={filters.processors.includes(processor)}
                    onCheckedChange={() => handleArrayFilterChange('processors', processor)}
                  />
                </div>
              ))}
            </div>
          </FilterSection>

          {/* RAM */}
          <FilterSection title="זיכרון RAM" section="ram">
            <div className="space-y-3">
              {ramOptions.map((ram) => (
                <div key={ram} className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={`ram-${ram}`}
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    {ram}
                  </label>
                  <Checkbox
                    id={`ram-${ram}`}
                    checked={filters.ramOptions.includes(ram)}
                    onCheckedChange={() => handleArrayFilterChange('ramOptions', ram)}
                  />
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Storage */}
          <FilterSection title="נפח אחסון" section="storage">
            <div className="space-y-3">
              {storageOptions.map((storage) => (
                <div key={storage} className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={`storage-${storage}`}
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    {storage}
                  </label>
                  <Checkbox
                    id={`storage-${storage}`}
                    checked={filters.storageOptions.includes(storage)}
                    onCheckedChange={() => handleArrayFilterChange('storageOptions', storage)}
                  />
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Screen Size */}
          <FilterSection title="גודל מסך" section="screenSize">
            <div className="space-y-3">
              {screenSizes.map((size) => (
                <div key={size} className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={`size-${size}`}
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    {size}
                  </label>
                  <Checkbox
                    id={`size-${size}`}
                    checked={filters.screenSizes.includes(size)}
                    onCheckedChange={() => handleArrayFilterChange('screenSizes', size)}
                  />
                </div>
              ))}
            </div>
          </FilterSection>

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
                max={20000}
                step={500}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₪0</span>
                <span>₪20,000+</span>
              </div>
            </div>
          </FilterSection>

          {/* Condition */}
          <FilterSection title="מצב המוצר" section="condition">
            <div className="space-y-3">
              {conditions.map((condition) => (
                <div key={condition} className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={`condition-${condition}`}
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    {condition}
                  </label>
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
              {cities.map((city) => (
                <div key={city} className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={`city-${city}`}
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    {city}
                  </label>
                  <Checkbox
                    id={`city-${city}`}
                    checked={filters.cities.includes(city)}
                    onCheckedChange={() => handleArrayFilterChange('cities', city)}
                  />
                </div>
              ))}
            </div>
          </FilterSection>
        </div>
      </Card>
    </div>
  );
};
