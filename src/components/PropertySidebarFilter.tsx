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
  counts?: {
    propertyTypes?: Record<string, number>;
    rooms?: Record<string, number>;
    cities?: Record<string, number>;
    features?: Record<string, number>;
  };
}

export interface PropertyFilters {
  propertyTypes: string[];
  rooms: string[];
  priceMin: number;
  priceMax: number;
  sizeMin: number;
  sizeMax: number;
  yearFrom: string;
  yearTo: string;
  floors: string[];
  conditions: string[];
  cities: string[];
  features: string[];
}

const propertyTypes = ["דירה", "פנטהאוז", "דירת גן", "דירת גג", "בית פרטי", "דופלקס", "סטודיו"];
const roomOptions = ["1", "2", "3", "4", "5", "6+"];
const floorOptions = ["קרקע", "1-3", "4-7", "8+"];
const conditions = ["חדש מקבלן", "משופץ", "במצב טוב", "דורש שיפוץ", "במצב מצוין"];
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

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

export const PropertySidebarFilter = ({ onFilterChange, counts }: PropertySidebarFilterProps) => {
  const [filters, setFilters] = useState<PropertyFilters>({
    propertyTypes: [],
    rooms: [],
    priceMin: 0,
    priceMax: 5000000,
    sizeMin: 0,
    sizeMax: 300,
    yearFrom: "",
    yearTo: "",
    floors: [],
    conditions: [],
    cities: [],
    features: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    propertyType: true,
    rooms: true,
    price: true,
    size: true,
    year: false,
    floor: false,
    condition: false,
    city: false,
    features: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleArrayFilterChange = (
    key: keyof Pick<PropertyFilters, 'propertyTypes' | 'rooms' | 'cities' | 'features' | 'floors' | 'conditions'>,
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

  const handleFilterChange = (key: keyof PropertyFilters, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
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
      yearFrom: "",
      yearTo: "",
      floors: [],
      conditions: [],
      cities: [],
      features: [],
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  const activeFiltersCount = 
    filters.propertyTypes.length +
    filters.rooms.length +
    filters.floors.length +
    filters.conditions.length +
    filters.cities.length +
    filters.features.length +
    (filters.yearFrom ? 1 : 0) +
    (filters.yearTo ? 1 : 0);

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
          {/* Property Type */}
          <FilterSection title="סוג נכס" section="propertyType">
            <div className="space-y-3">
              {propertyTypes.map((type) => (
                <div key={type} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <label
                      htmlFor={`type-${type}`}
                      className="text-sm text-foreground cursor-pointer flex-1 text-right"
                    >
                      {type}
                    </label>
                    {counts?.propertyTypes?.[type] !== undefined && (
                      <Badge variant="outline" className="h-5 text-xs px-1.5">
                        {counts.propertyTypes[type]}
                      </Badge>
                    )}
                  </div>
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
                  <div className="flex items-center gap-2 flex-1">
                    <label
                      htmlFor={`room-${room}`}
                      className="text-sm text-foreground cursor-pointer flex-1 text-right"
                    >
                      {room} חדרים
                    </label>
                    {counts?.rooms?.[room] !== undefined && (
                      <Badge variant="outline" className="h-5 text-xs px-1.5">
                        {counts.rooms[room]}
                      </Badge>
                    )}
                  </div>
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

          {/* Year Range */}
          <FilterSection title="שנת בנייה" section="year">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">משנה</label>
                <Select 
                  value={filters.yearFrom} 
                  onValueChange={(value) => handleFilterChange("yearFrom", value)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="בחר" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50 max-h-[200px]">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">עד שנה</label>
                <Select 
                  value={filters.yearTo} 
                  onValueChange={(value) => handleFilterChange("yearTo", value)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="בחר" />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50 max-h-[200px]">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </FilterSection>

          {/* Floor */}
          <FilterSection title="קומה" section="floor">
            <div className="space-y-3">
              {floorOptions.map((floor) => (
                <div key={floor} className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={`floor-${floor}`}
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    {floor}
                  </label>
                  <Checkbox
                    id={`floor-${floor}`}
                    checked={filters.floors.includes(floor)}
                    onCheckedChange={() => handleArrayFilterChange('floors', floor)}
                  />
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Condition */}
          <FilterSection title="מצב הנכס" section="condition">
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

          {/* Features */}
          <FilterSection title="תכונות נוספות" section="features">
            <div className="space-y-3">
              {propertyFeatures.slice(0, 10).map((feature) => (
                <div key={feature} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <label
                      htmlFor={`feature-${feature}`}
                      className="text-sm text-foreground cursor-pointer flex-1 text-right"
                    >
                      {feature}
                    </label>
                    {counts?.features?.[feature] !== undefined && (
                      <Badge variant="outline" className="h-5 text-xs px-1.5">
                        {counts.features[feature]}
                      </Badge>
                    )}
                  </div>
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