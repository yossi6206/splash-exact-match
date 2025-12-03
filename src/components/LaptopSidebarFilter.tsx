import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Laptop, DollarSign, Cpu, HardDrive, Monitor, MapPin } from "lucide-react";
import { useState } from "react";

interface LaptopSidebarFilterProps {
  onFilterChange?: (filters: LaptopFilters) => void;
  counts?: {
    brands?: Record<string, number>;
    processors?: Record<string, number>;
    ramOptions?: Record<string, number>;
    storageOptions?: Record<string, number>;
    screenSizes?: Record<string, number>;
    conditions?: Record<string, number>;
    cities?: Record<string, number>;
  };
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

export const LaptopSidebarFilter = ({ onFilterChange, counts }: LaptopSidebarFilterProps) => {
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

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Laptop className="w-5 h-5 text-primary" />
          סינון מחשבים
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
              max={20000}
              step={500}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₪{filters.priceMin.toLocaleString()}</span>
              <span>₪{filters.priceMax.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Brands */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Laptop className="w-4 h-4 text-primary" />
            יצרן
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
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

        {/* Processors */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            מעבד
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {processors.map((processor) => (
              <div key={processor} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`processor-${processor}`}
                    checked={filters.processors.includes(processor)}
                    onCheckedChange={() => handleArrayFilterChange('processors', processor)}
                  />
                  <Label
                    htmlFor={`processor-${processor}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {processor}
                  </Label>
                </div>
                {counts?.processors?.[processor] && (
                  <span className="text-xs text-muted-foreground">
                    ({counts.processors[processor]})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* RAM */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-primary" />
            זיכרון RAM
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {ramOptions.map((ram) => (
              <div key={ram} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`ram-${ram}`}
                    checked={filters.ramOptions.includes(ram)}
                    onCheckedChange={() => handleArrayFilterChange('ramOptions', ram)}
                  />
                  <Label
                    htmlFor={`ram-${ram}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {ram}
                  </Label>
                </div>
                {counts?.ramOptions?.[ram] && (
                  <span className="text-xs text-muted-foreground">
                    ({counts.ramOptions[ram]})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Screen Size */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Monitor className="w-4 h-4 text-primary" />
            גודל מסך
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {screenSizes.map((size) => (
              <div key={size} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`size-${size}`}
                    checked={filters.screenSizes.includes(size)}
                    onCheckedChange={() => handleArrayFilterChange('screenSizes', size)}
                  />
                  <Label
                    htmlFor={`size-${size}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {size}
                  </Label>
                </div>
                {counts?.screenSizes?.[size] && (
                  <span className="text-xs text-muted-foreground">
                    ({counts.screenSizes[size]})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Condition */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Laptop className="w-4 h-4 text-primary" />
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
      </CardContent>
    </Card>
  );
};
