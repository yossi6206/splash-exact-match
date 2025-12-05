import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Laptop, DollarSign, Cpu, HardDrive, Monitor, MapPin, RotateCcw, Wifi, Battery, MonitorSmartphone, Settings } from "lucide-react";
import { useState } from "react";

interface LaptopSidebarFilterProps {
  onFilterChange?: (filters: LaptopFilters) => void;
  counts?: {
    brands?: Record<string, number>;
    processors?: Record<string, number>;
    ramOptions?: Record<string, number>;
    storageOptions?: Record<string, number>;
    storageTypes?: Record<string, number>;
    screenSizes?: Record<string, number>;
    resolutions?: Record<string, number>;
    graphicsCards?: Record<string, number>;
    operatingSystems?: Record<string, number>;
    conditions?: Record<string, number>;
    cities?: Record<string, number>;
    features?: Record<string, number>;
  };
}

export interface LaptopFilters {
  brands: string[];
  processors: string[];
  ramOptions: string[];
  storageOptions: string[];
  storageTypes: string[];
  screenSizes: string[];
  resolutions: string[];
  graphicsCards: string[];
  operatingSystems: string[];
  priceMin: number;
  priceMax: number;
  conditions: string[];
  cities: string[];
  features: string[];
}

// יצרנים - תואמים לטופס PostLaptop
const brands = ["Dell", "HP", "Lenovo", "Apple", "Asus", "Acer", "MSI", "Microsoft", "אחר"];

// מעבדים
const processors = [
  "Intel Core i9", 
  "Intel Core i7", 
  "Intel Core i5", 
  "Intel Core i3",
  "AMD Ryzen 9", 
  "AMD Ryzen 7", 
  "AMD Ryzen 5",
  "AMD Ryzen 3",
  "Apple M3 Pro",
  "Apple M3",
  "Apple M2 Pro", 
  "Apple M2", 
  "Apple M1"
];

// זיכרון RAM - תואם לטופס
const ramOptions = ["4GB", "8GB", "16GB", "32GB", "64GB"];

// נפח אחסון
const storageOptions = ["128GB", "256GB", "512GB", "1TB", "2TB+"];

// סוג אחסון - תואם לטופס
const storageTypes = ["SSD", "HDD", "SSD + HDD"];

// גודל מסך - תואם לטופס
const screenSizes = ['13.3"', '14"', '15.6"', '17.3"'];

// רזולוציות נפוצות
const resolutions = [
  "1366 x 768 (HD)",
  "1920 x 1080 (Full HD)",
  "2560 x 1440 (QHD)",
  "2560 x 1600",
  "3840 x 2160 (4K)",
  "2880 x 1800 (Retina)"
];

// כרטיסי גרפיקה נפוצים
const graphicsCards = [
  "Intel Integrated",
  "Intel Iris Xe",
  "AMD Radeon Integrated",
  "NVIDIA GTX 1650",
  "NVIDIA GTX 1660",
  "NVIDIA RTX 3050",
  "NVIDIA RTX 3060",
  "NVIDIA RTX 3070",
  "NVIDIA RTX 3080",
  "NVIDIA RTX 4050",
  "NVIDIA RTX 4060",
  "NVIDIA RTX 4070",
  "NVIDIA RTX 4080",
  "NVIDIA RTX 4090",
  "AMD Radeon RX 6600",
  "AMD Radeon RX 6700",
  "Apple M1/M2/M3 GPU"
];

// מערכות הפעלה
const operatingSystems = [
  "Windows 11 Pro",
  "Windows 11 Home",
  "Windows 10 Pro",
  "Windows 10 Home",
  "macOS Sonoma",
  "macOS Ventura",
  "Chrome OS",
  "Linux",
  "ללא מערכת הפעלה"
];

// מצב המוצר - תואם לטופס
const conditions = [
  "חדש באריזה", 
  "כמו חדש", 
  "משומש במצב מצוין", 
  "משומש במצב טוב", 
  "משומש"
];

// ערים
const cities = [
  "תל אביב", "ירושלים", "חיפה", "באר שבע", "נתניה", "פתח תקווה",
  "ראשון לציון", "אשדוד", "רחובות", "בני ברק", "הרצליה", "כפר סבא",
  "רעננה", "מודיעין", "אילת", "נהריה"
];

// תכונות - תואמות לטופס
const features = [
  "מסך מגע",
  "תאורת מקלדת",
  "מצלמת אינטרנט",
  "Bluetooth",
  "Wi-Fi 6",
  "USB-C",
  "HDMI",
  "חיישן טביעת אצבע",
  "גרפיקה ייעודית",
  "מעבד Intel",
  "מעבד AMD",
  "כונן SSD",
  "כונן HDD",
  "מקלדת נומרית",
  "רמקולים איכותיים"
];

export const LaptopSidebarFilter = ({ onFilterChange, counts }: LaptopSidebarFilterProps) => {
  const [filters, setFilters] = useState<LaptopFilters>({
    brands: [],
    processors: [],
    ramOptions: [],
    storageOptions: [],
    storageTypes: [],
    screenSizes: [],
    resolutions: [],
    graphicsCards: [],
    operatingSystems: [],
    priceMin: 0,
    priceMax: 30000,
    conditions: [],
    cities: [],
    features: [],
  });

  const handleArrayFilterChange = (
    key: keyof Omit<LaptopFilters, 'priceMin' | 'priceMax'>,
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
    const defaultFilters: LaptopFilters = {
      brands: [],
      processors: [],
      ramOptions: [],
      storageOptions: [],
      storageTypes: [],
      screenSizes: [],
      resolutions: [],
      graphicsCards: [],
      operatingSystems: [],
      priceMin: 0,
      priceMax: 30000,
      conditions: [],
      cities: [],
      features: [],
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  const renderFilterSection = (
    title: string,
    icon: React.ReactNode,
    options: string[],
    filterKey: keyof Omit<LaptopFilters, 'priceMin' | 'priceMax'>,
    countsKey?: keyof NonNullable<typeof counts>
  ) => (
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
                  checked={(filters[filterKey] as string[]).includes(option)}
                  onCheckedChange={() => handleArrayFilterChange(filterKey, option)}
                />
                <Label
                  htmlFor={`${filterKey}-${option}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
              {countsKey && counts?.[countsKey]?.[option] && (
                <span className="text-xs text-muted-foreground">
                  ({counts[countsKey][option]})
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <Separator />
    </>
  );

  return (
    <Card className="sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <Laptop className="w-5 h-5 text-primary" />
          סינון מחשבים ניידים
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
              max={30000}
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

        {/* Brands - יצרן */}
        {renderFilterSection("יצרן", <Laptop className="w-4 h-4 text-primary" />, brands, 'brands', 'brands')}

        {/* Condition - מצב */}
        {renderFilterSection("מצב המוצר", <Settings className="w-4 h-4 text-primary" />, conditions, 'conditions', 'conditions')}

        {/* Processors - מעבד */}
        {renderFilterSection("מעבד", <Cpu className="w-4 h-4 text-primary" />, processors, 'processors', 'processors')}

        {/* RAM */}
        {renderFilterSection("זיכרון RAM", <HardDrive className="w-4 h-4 text-primary" />, ramOptions, 'ramOptions', 'ramOptions')}

        {/* Storage - נפח אחסון */}
        {renderFilterSection("נפח אחסון", <HardDrive className="w-4 h-4 text-primary" />, storageOptions, 'storageOptions', 'storageOptions')}

        {/* Storage Type - סוג אחסון */}
        {renderFilterSection("סוג אחסון", <HardDrive className="w-4 h-4 text-primary" />, storageTypes, 'storageTypes', 'storageTypes')}

        {/* Screen Size - גודל מסך */}
        {renderFilterSection("גודל מסך", <Monitor className="w-4 h-4 text-primary" />, screenSizes, 'screenSizes', 'screenSizes')}

        {/* Resolution - רזולוציה */}
        {renderFilterSection("רזולוציה", <Monitor className="w-4 h-4 text-primary" />, resolutions, 'resolutions', 'resolutions')}

        {/* Graphics Card - כרטיס גרפי */}
        {renderFilterSection("כרטיס גרפי", <MonitorSmartphone className="w-4 h-4 text-primary" />, graphicsCards, 'graphicsCards', 'graphicsCards')}

        {/* Operating System - מערכת הפעלה */}
        {renderFilterSection("מערכת הפעלה", <Settings className="w-4 h-4 text-primary" />, operatingSystems, 'operatingSystems', 'operatingSystems')}

        {/* Features - תכונות */}
        {renderFilterSection("תכונות", <Wifi className="w-4 h-4 text-primary" />, features, 'features', 'features')}

        {/* City - מיקום */}
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
