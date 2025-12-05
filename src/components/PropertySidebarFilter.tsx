import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Home, DollarSign, Maximize, MapPin, Layers, CheckSquare, RotateCcw, Calendar, Building } from "lucide-react";
import { useState } from "react";

interface PropertySidebarFilterProps {
  onFilterChange?: (filters: PropertyFilters) => void;
  counts?: {
    propertyTypes?: Record<string, number>;
    rooms?: Record<string, number>;
    cities?: Record<string, number>;
    features?: Record<string, number>;
    listingTypes?: Record<string, number>;
    conditions?: Record<string, number>;
  };
}

export interface PropertyFilters {
  listingTypes: string[];
  propertyTypes: string[];
  rooms: string[];
  priceMin: number;
  priceMax: number;
  sizeMin: number;
  sizeMax: number;
  yearFrom: number;
  yearTo: number;
  floors: string[];
  conditions: string[];
  cities: string[];
  features: string[];
}

const listingTypes = ["למכירה", "להשכרה"];
const propertyTypes = ["דירה", "פנטהאוז", "דירת גן", "דירת גג", "בית פרטי", "דופלקס", "סטודיו", "משרד", "חנות"];
const roomOptions = ["1", "2", "3", "4", "5", "6+"];
const conditions = ["חדש", "משופץ", "במצב טוב", "דרוש שיפוץ"];
const floorOptions = ["קרקע", "1-3", "4-6", "7-10", "11+"];
const cities = [
  "תל אביב", "ירושלים", "חיפה", "באר שבע", "נתניה", "פתח תקווה",
  "ראשון לציון", "אשדוד", "רחובות", "בני ברק", "הרצליה", "כפר סבא"
];
const propertyFeatures = [
  "חניה", "מעלית", "מרפסת", "נגיש לנכים", "מיזוג", "מחסן", 
  "ממ״ד", "סורגים", "משופצת", "מטבח כשר", "בריכה", "גינה", 
  "מרוהטת", "כיווני אוויר טובים", "שמורה היטב"
];

export const PropertySidebarFilter = ({ onFilterChange, counts }: PropertySidebarFilterProps) => {
  const currentYear = new Date().getFullYear();
  const [filters, setFilters] = useState<PropertyFilters>({
    listingTypes: [],
    propertyTypes: [],
    rooms: [],
    priceMin: 0,
    priceMax: 10000000,
    sizeMin: 0,
    sizeMax: 500,
    yearFrom: 1950,
    yearTo: currentYear,
    floors: [],
    conditions: [],
    cities: [],
    features: [],
  });

  const handleArrayFilterChange = (
    key: keyof Pick<PropertyFilters, 'listingTypes' | 'propertyTypes' | 'rooms' | 'cities' | 'features' | 'floors' | 'conditions'>,
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

  const handleYearChange = (value: number[]) => {
    const newFilters = { ...filters, yearFrom: value[0], yearTo: value[1] };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: PropertyFilters = {
      listingTypes: [],
      propertyTypes: [],
      rooms: [],
      priceMin: 0,
      priceMax: 10000000,
      sizeMin: 0,
      sizeMax: 500,
      yearFrom: 1950,
      yearTo: currentYear,
      floors: [],
      conditions: [],
      cities: [],
      features: [],
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  return (
    <Card className="sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <Home className="w-5 h-5 text-primary" />
          סינון נכסים
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-muted-foreground hover:text-foreground">
          <RotateCcw className="w-4 h-4 ml-1" />
          איפוס
        </Button>
      </CardHeader>
      <CardContent className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto overscroll-contain">
        {/* Listing Type */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Building className="w-4 h-4 text-primary" />
            סוג מודעה
          </Label>
          <div className="space-y-2">
            {listingTypes.map((type) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`listing-${type}`}
                    checked={filters.listingTypes.includes(type)}
                    onCheckedChange={() => handleArrayFilterChange('listingTypes', type)}
                  />
                  <Label htmlFor={`listing-${type}`} className="text-sm font-normal cursor-pointer">
                    {type}
                  </Label>
                </div>
                {counts?.listingTypes?.[type] && (
                  <span className="text-xs text-muted-foreground">({counts.listingTypes[type]})</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

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
              max={10000000}
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
              max={500}
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

        {/* Year Range */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <Label className="font-semibold">שנת בנייה</Label>
          </div>
          <div className="space-y-4">
            <Slider
              value={[filters.yearFrom, filters.yearTo]}
              onValueChange={handleYearChange}
              min={1950}
              max={currentYear}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.yearFrom}</span>
              <span>{filters.yearTo}</span>
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
                  <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer">
                    {type}
                  </Label>
                </div>
                {counts?.propertyTypes?.[type] && (
                  <span className="text-xs text-muted-foreground">({counts.propertyTypes[type]})</span>
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
                  <Label htmlFor={`room-${room}`} className="text-sm font-normal cursor-pointer">
                    {room} חדרים
                  </Label>
                </div>
                {counts?.rooms?.[room] && (
                  <span className="text-xs text-muted-foreground">({counts.rooms[room]})</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Floor */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            קומה
          </Label>
          <div className="space-y-2">
            {floorOptions.map((floor) => (
              <div key={floor} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox 
                  id={`floor-${floor}`}
                  checked={filters.floors.includes(floor)}
                  onCheckedChange={() => handleArrayFilterChange('floors', floor)}
                />
                <Label htmlFor={`floor-${floor}`} className="text-sm font-normal cursor-pointer">
                  {floor}
                </Label>
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
                  <Label htmlFor={`condition-${condition}`} className="text-sm font-normal cursor-pointer">
                    {condition}
                  </Label>
                </div>
                {counts?.conditions?.[condition] && (
                  <span className="text-xs text-muted-foreground">({counts.conditions[condition]})</span>
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
                  <Label htmlFor={`city-${city}`} className="text-sm font-normal cursor-pointer">
                    {city}
                  </Label>
                </div>
                {counts?.cities?.[city] && (
                  <span className="text-xs text-muted-foreground">({counts.cities[city]})</span>
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
            אבזור ומאפיינים
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
                  <Label htmlFor={`feature-${feature}`} className="text-sm font-normal cursor-pointer">
                    {feature}
                  </Label>
                </div>
                {counts?.features?.[feature] && (
                  <span className="text-xs text-muted-foreground">({counts.features[feature]})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};