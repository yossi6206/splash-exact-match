import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface PropertySidebarFilterProps {
  onFilterChange?: (filters: PropertyFilters) => void;
}

export interface PropertyFilters {
  propertyTypes: string[];
  rooms: string[];
  priceMin: number;
  priceMax: number;
  sizeMin: number;
  sizeMax: number;
  cities: string[];
  features: string[];
}

const propertyTypes = ["דירה", "פנטהאוז", "דירת גן", "דירת גג", "בית פרטי", "דופלקס", "סטודיו"];
const roomOptions = ["1", "2", "3", "4", "5", "6+"];
const cities = [
  "תל אביב", "ירושלים", "חיפה", "באר שבע", "נתניה", "פתח תקווה",
  "ראשון לציון", "אשדוד", "רחובות", "בני ברק", "הרצליה", "כפר סבא",
  "רעננה", "מודיעין", "רמת גן", "גבעתיים", "חולון", "אשקלון"
];
const propertyFeatures = [
  "מעלית", "חניה", "מרפסת", "מחסן", "ממ״ד", "מרפסת שמש",
  "נגיש לנכים", "משופץ", "אויר מרכזי", "גינה", "בריכה", "חדר כושר",
  "שמירה", "מיזוג מרכזי", "גג משותף", "חדר מקלחת אמבטיה"
];

export const PropertySidebarFilter = ({ onFilterChange }: PropertySidebarFilterProps) => {
  const [filters, setFilters] = useState<PropertyFilters>({
    propertyTypes: [],
    rooms: [],
    priceMin: 0,
    priceMax: 5000000,
    sizeMin: 0,
    sizeMax: 300,
    cities: [],
    features: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    propertyType: true,
    rooms: true,
    price: true,
    size: true,
    city: false,
    features: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleArrayFilterChange = (
    key: keyof Pick<PropertyFilters, 'propertyTypes' | 'rooms' | 'cities' | 'features'>,
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

  const handleSizeChange = (value: number[]) => {
    const newFilters = { ...filters, sizeMin: value[0], sizeMax: value[1] };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      propertyTypes: [],
      rooms: [],
      priceMin: 0,
      priceMax: 5000000,
      sizeMin: 0,
      sizeMax: 300,
      cities: [],
      features: [],
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  const activeFiltersCount = 
    filters.propertyTypes.length +
    filters.rooms.length +
    filters.cities.length +
    filters.features.length;

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

        <div className="max-h-[calc(100vh-280px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-track]:bg-transparent">
          {/* Property Type */}
          <FilterSection title="סוג נכס" section="propertyType">
            <div className="space-y-3">
              {propertyTypes.map((type) => (
                <div key={type} className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={`type-${type}`}
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    {type}
                  </label>
                  <Checkbox
                    id={`type-${type}`}
                    checked={filters.propertyTypes.includes(type)}
                    onCheckedChange={() => handleArrayFilterChange('propertyTypes', type)}
                  />
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Rooms */}
          <FilterSection title="מספר חדרים" section="rooms">
            <div className="space-y-3">
              {roomOptions.map((room) => (
                <div key={room} className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={`room-${room}`}
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    {room} חדרים
                  </label>
                  <Checkbox
                    id={`room-${room}`}
                    checked={filters.rooms.includes(room)}
                    onCheckedChange={() => handleArrayFilterChange('rooms', room)}
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
                max={5000000}
                step={50000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₪0</span>
                <span>₪5,000,000+</span>
              </div>
            </div>
          </FilterSection>

          {/* Size Range */}
          <FilterSection title="גודל במ״ר" section="size">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-foreground font-medium">
                  {filters.sizeMin} מ״ר
                </span>
                <span className="text-foreground font-medium">
                  {filters.sizeMax} מ״ר
                </span>
              </div>
              <Slider
                value={[filters.sizeMin, filters.sizeMax]}
                onValueChange={handleSizeChange}
                min={0}
                max={300}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 מ״ר</span>
                <span>300+ מ״ר</span>
              </div>
            </div>
          </FilterSection>

          {/* City */}
          <FilterSection title="עיר" section="city">
            <div className="space-y-3">
              {cities.slice(0, 10).map((city) => (
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
              {cities.length > 10 && (
                <Button variant="ghost" size="sm" className="w-full text-primary">
                  הצג עוד ערים
                </Button>
              )}
            </div>
          </FilterSection>

          {/* Features */}
          <FilterSection title="תכונות נוספות" section="features">
            <div className="space-y-3">
              {propertyFeatures.slice(0, 10).map((feature) => (
                <div key={feature} className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={`feature-${feature}`}
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    {feature}
                  </label>
                  <Checkbox
                    id={`feature-${feature}`}
                    checked={filters.features.includes(feature)}
                    onCheckedChange={() => handleArrayFilterChange('features', feature)}
                  />
                </div>
              ))}
              {propertyFeatures.length > 10 && (
                <Button variant="ghost" size="sm" className="w-full text-primary">
                  הצג עוד תכונות
                </Button>
              )}
            </div>
          </FilterSection>
        </div>
      </Card>
      </div>
    </div>
  );
};