import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Car, DollarSign, Fuel, Settings, MapPin, Gauge, RotateCcw, Palette, Calendar, CheckSquare } from "lucide-react";
import { useState, useMemo } from "react";
import { getManufacturers, getModelsForManufacturer } from "@/data/carManufacturersModels";

interface CarSidebarProps {
  onFilterChange?: (filters: SidebarFilters) => void;
  counts?: {
    manufacturers?: Record<string, number>;
    fuelTypes?: Record<string, number>;
    transmissions?: Record<string, number>;
    hands?: Record<string, number>;
    features?: Record<string, number>;
    colors?: Record<string, number>;
    vehicleTypes?: Record<string, number>;
    conditions?: Record<string, number>;
  };
}

export interface SidebarFilters {
  manufacturers: string[];
  models: string[];
  yearFrom: number;
  yearTo: number;
  priceMin: number;
  priceMax: number;
  fuelTypes: string[];
  transmissions: string[];
  hands: string[];
  kmMin: number;
  kmMax: number;
  features: string[];
  vehicleTypes: string[];
  conditions: string[];
  colors: string[];
  cities: string[];
}

const fuelTypes = ["בנזין", "דיזל", "היבריד", "חשמלי", "היבריד פלאג-אין"];
const transmissionTypes = ["אוטומט", "ידני", "רובוטרון", "טיפטרוניק"];
const handOptions = ["יד ראשונה", "יד שנייה", "יד שלישית", "יד רביעית", "יד חמישית ומעלה"];
const vehicleTypes = ["רכב פרטי", "רכב מסחרי", "משאית", "אופנוע", "קטנוע"];
const conditionOptions = ["רכב חדש", "רכב משומש", "במצב מצוין", "במצב טוב", "דרוש תיקונים"];
const colorOptions = ["לבן", "שחור", "כסף", "אפור", "אדום", "כחול", "ירוק", "חום", "בז׳", "זהב", "כתום", "צהוב", "סגול", "ורוד", "טורקיז"];
const cities = ["תל אביב", "ירושלים", "חיפה", "באר שבע", "נתניה", "פתח תקווה", "ראשון לציון", "אשדוד", "רחובות", "הרצליה"];
const carFeatures = [
  "מזגן אוטומטי", "מערכת ניווט", "חיישני חניה", "מצלמה אחורית",
  "חישוקי מגנזיום", "גג פנורמי", "מושבים מחוממים", "בקרת שיוט",
  "Bluetooth", "מערכת בידור", "USB ו-AUX", "כניסה ללא מפתח",
  "התנעה ללא מפתח", "מושבי עור", "הגה מחומם"
];

export const CarSidebar = ({ onFilterChange, counts }: CarSidebarProps) => {
  const currentYear = new Date().getFullYear();
  const manufacturers = useMemo(() => getManufacturers(), []);
  
  const [filters, setFilters] = useState<SidebarFilters>({
    manufacturers: [],
    models: [],
    yearFrom: 2000,
    yearTo: currentYear + 1,
    priceMin: 0,
    priceMax: 500000,
    fuelTypes: [],
    transmissions: [],
    hands: [],
    kmMin: 0,
    kmMax: 300000,
    features: [],
    vehicleTypes: [],
    conditions: [],
    colors: [],
    cities: [],
  });

  // Get models based on selected manufacturers
  const availableModels = useMemo(() => {
    if (filters.manufacturers.length === 0) return [];
    const allModels: string[] = [];
    filters.manufacturers.forEach(mfr => {
      allModels.push(...getModelsForManufacturer(mfr));
    });
    return [...new Set(allModels)];
  }, [filters.manufacturers]);

  const handleArrayFilterChange = (
    key: keyof Pick<SidebarFilters, 'manufacturers' | 'models' | 'fuelTypes' | 'transmissions' | 'hands' | 'features' | 'vehicleTypes' | 'conditions' | 'colors' | 'cities'>,
    value: string
  ) => {
    const currentValues = filters[key] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    const newFilters = { ...filters, [key]: newValues };
    
    // Reset models if manufacturer changes
    if (key === 'manufacturers') {
      newFilters.models = [];
    }
    
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...filters, priceMin: value[0], priceMax: value[1] };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleKmChange = (value: number[]) => {
    const newFilters = { ...filters, kmMin: value[0], kmMax: value[1] };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleYearChange = (value: number[]) => {
    const newFilters = { ...filters, yearFrom: value[0], yearTo: value[1] };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: SidebarFilters = {
      manufacturers: [],
      models: [],
      yearFrom: 2000,
      yearTo: currentYear + 1,
      priceMin: 0,
      priceMax: 500000,
      fuelTypes: [],
      transmissions: [],
      hands: [],
      kmMin: 0,
      kmMax: 300000,
      features: [],
      vehicleTypes: [],
      conditions: [],
      colors: [],
      cities: [],
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  return (
    <Card className="sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <Car className="w-5 h-5 text-primary" />
          סינון רכבים
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
              max={500000}
              step={5000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₪{filters.priceMin.toLocaleString()}</span>
              <span>₪{filters.priceMax.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Year Range */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <Label className="font-semibold">שנת ייצור</Label>
          </div>
          <div className="space-y-4">
            <Slider
              value={[filters.yearFrom, filters.yearTo]}
              onValueChange={handleYearChange}
              min={2000}
              max={currentYear + 1}
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

        {/* Kilometers */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-primary" />
            <Label className="font-semibold">קילומטראז׳</Label>
          </div>
          <div className="space-y-4">
            <Slider
              value={[filters.kmMin, filters.kmMax]}
              onValueChange={handleKmChange}
              max={300000}
              step={5000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.kmMin.toLocaleString()} ק״מ</span>
              <span>{filters.kmMax.toLocaleString()} ק״מ</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Manufacturer */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Car className="w-4 h-4 text-primary" />
            יצרן
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {manufacturers.slice(0, 15).map((brand) => (
              <div key={brand} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`brand-${brand}`}
                    checked={filters.manufacturers.includes(brand)}
                    onCheckedChange={() => handleArrayFilterChange('manufacturers', brand)}
                  />
                  <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer">
                    {brand}
                  </Label>
                </div>
                {counts?.manufacturers?.[brand] && (
                  <span className="text-xs text-muted-foreground">({counts.manufacturers[brand]})</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Model - only show if manufacturer selected */}
        {filters.manufacturers.length > 0 && availableModels.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <Label className="font-semibold flex items-center gap-2">
                <Car className="w-4 h-4 text-primary" />
                דגם
              </Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableModels.slice(0, 20).map((model) => (
                  <div key={model} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox 
                      id={`model-${model}`}
                      checked={filters.models.includes(model)}
                      onCheckedChange={() => handleArrayFilterChange('models', model)}
                    />
                    <Label htmlFor={`model-${model}`} className="text-sm font-normal cursor-pointer">
                      {model}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Vehicle Type */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Car className="w-4 h-4 text-primary" />
            סוג רכב
          </Label>
          <div className="space-y-2">
            {vehicleTypes.map((type) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`vehicle-${type}`}
                    checked={filters.vehicleTypes.includes(type)}
                    onCheckedChange={() => handleArrayFilterChange('vehicleTypes', type)}
                  />
                  <Label htmlFor={`vehicle-${type}`} className="text-sm font-normal cursor-pointer">
                    {type}
                  </Label>
                </div>
                {counts?.vehicleTypes?.[type] && (
                  <span className="text-xs text-muted-foreground">({counts.vehicleTypes[type]})</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Fuel Type */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Fuel className="w-4 h-4 text-primary" />
            סוג דלק
          </Label>
          <div className="space-y-2">
            {fuelTypes.map((fuel) => (
              <div key={fuel} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`fuel-${fuel}`}
                    checked={filters.fuelTypes.includes(fuel)}
                    onCheckedChange={() => handleArrayFilterChange('fuelTypes', fuel)}
                  />
                  <Label htmlFor={`fuel-${fuel}`} className="text-sm font-normal cursor-pointer">
                    {fuel}
                  </Label>
                </div>
                {counts?.fuelTypes?.[fuel] && (
                  <span className="text-xs text-muted-foreground">({counts.fuelTypes[fuel]})</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Transmission */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            תיבת הילוכים
          </Label>
          <div className="space-y-2">
            {transmissionTypes.map((trans) => (
              <div key={trans} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`trans-${trans}`}
                    checked={filters.transmissions.includes(trans)}
                    onCheckedChange={() => handleArrayFilterChange('transmissions', trans)}
                  />
                  <Label htmlFor={`trans-${trans}`} className="text-sm font-normal cursor-pointer">
                    {trans}
                  </Label>
                </div>
                {counts?.transmissions?.[trans] && (
                  <span className="text-xs text-muted-foreground">({counts.transmissions[trans]})</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Hand */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            יד
          </Label>
          <div className="space-y-2">
            {handOptions.map((hand) => (
              <div key={hand} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`hand-${hand}`}
                    checked={filters.hands.includes(hand)}
                    onCheckedChange={() => handleArrayFilterChange('hands', hand)}
                  />
                  <Label htmlFor={`hand-${hand}`} className="text-sm font-normal cursor-pointer">
                    {hand}
                  </Label>
                </div>
                {counts?.hands?.[hand] && (
                  <span className="text-xs text-muted-foreground">({counts.hands[hand]})</span>
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
            מצב הרכב
          </Label>
          <div className="space-y-2">
            {conditionOptions.map((condition) => (
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

        {/* Color */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            צבע
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {colorOptions.map((color) => (
              <div key={color} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`color-${color}`}
                    checked={filters.colors.includes(color)}
                    onCheckedChange={() => handleArrayFilterChange('colors', color)}
                  />
                  <Label htmlFor={`color-${color}`} className="text-sm font-normal cursor-pointer">
                    {color}
                  </Label>
                </div>
                {counts?.colors?.[color] && (
                  <span className="text-xs text-muted-foreground">({counts.colors[color]})</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Location */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            מיקום
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {cities.map((city) => (
              <div key={city} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox 
                  id={`city-${city}`}
                  checked={filters.cities.includes(city)}
                  onCheckedChange={() => handleArrayFilterChange('cities', city)}
                />
                <Label htmlFor={`city-${city}`} className="text-sm font-normal cursor-pointer">
                  {city}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Features */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-primary" />
            אבזור
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {carFeatures.map((feature) => (
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

export default CarSidebar;