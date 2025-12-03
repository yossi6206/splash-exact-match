import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Home, DollarSign, Maximize, MapPin, Layers, CheckSquare } from "lucide-react";
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
const conditions = ["חדש מקבלן", "משופץ", "במצב טוב", "דורש שיפוץ", "במצב מצוין"];
const cities = [
  "תל אביב", "ירושלים", "חיפה", "באר שבע", "נתניה", "פתח תקווה",
  "ראשון לציון", "אשדוד", "רחובות", "בני ברק", "הרצליה", "כפר סבא"
];
const propertyFeatures = [
  "מעלית", "חניה", "מרפסת", "מחסן", "ממ״ד", "מרפסת שמש",
  "נגיש לנכים", "משופץ", "מיזוג מרכזי", "גינה"
];

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

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Home className="w-5 h-5 text-primary" />
          סינון נכסים
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
              max={5000000}
              step={50000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₪{filters.priceMin.toLocaleString()}</span>
              <span>₪{filters.priceMax.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Size Range */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Maximize className="w-4 h-4 text-primary" />
            <Label className="font-semibold">גודל במ״ר</Label>
          </div>
          <div className="space-y-4">
            <Slider
              value={[filters.sizeMin, filters.sizeMax]}
              onValueChange={handleSizeChange}
              max={300}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.sizeMin} מ״ר</span>
              <span>{filters.sizeMax} מ״ר</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Property Type */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Home className="w-4 h-4 text-primary" />
            סוג נכס
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {propertyTypes.map((type) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`type-${type}`}
                    checked={filters.propertyTypes.includes(type)}
                    onCheckedChange={() => handleArrayFilterChange('propertyTypes', type)}
                  />
                  <Label
                    htmlFor={`type-${type}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {type}
                  </Label>
                </div>
                {counts?.propertyTypes?.[type] && (
                  <span className="text-xs text-muted-foreground">
                    ({counts.propertyTypes[type]})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Rooms */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            מספר חדרים
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {roomOptions.map((room) => (
              <div key={room} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`room-${room}`}
                    checked={filters.rooms.includes(room)}
                    onCheckedChange={() => handleArrayFilterChange('rooms', room)}
                  />
                  <Label
                    htmlFor={`room-${room}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {room} חדרים
                  </Label>
                </div>
                {counts?.rooms?.[room] && (
                  <span className="text-xs text-muted-foreground">
                    ({counts.rooms[room]})
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
            <CheckSquare className="w-4 h-4 text-primary" />
            מצב הנכס
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

        {/* Features */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-primary" />
            תכונות נוספות
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {propertyFeatures.map((feature) => (
              <div key={feature} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`feature-${feature}`}
                    checked={filters.features.includes(feature)}
                    onCheckedChange={() => handleArrayFilterChange('features', feature)}
                  />
                  <Label
                    htmlFor={`feature-${feature}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {feature}
                  </Label>
                </div>
                {counts?.features?.[feature] && (
                  <span className="text-xs text-muted-foreground">
                    ({counts.features[feature]})
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
