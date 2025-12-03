import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Car, DollarSign, Fuel, Settings, MapPin, Gauge } from "lucide-react";
import { useState } from "react";

interface CarSidebarProps {
  onFilterChange?: (filters: SidebarFilters) => void;
  counts?: {
    manufacturers?: Record<string, number>;
    fuelTypes?: Record<string, number>;
    transmissions?: Record<string, number>;
    hands?: Record<string, number>;
    features?: Record<string, number>;
  };
}

export interface SidebarFilters {
  manufacturers: string[];
  yearFrom: string;
  yearTo: string;
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
  categories: string[];
}

const manufacturers = [
  "טויוטה", "מזדה", "יונדאי", "קיה", "הונדה", "ניסאן", 
  "פולקסווגן", "שקודה", "סיאט", "ב מ וו", "מרצדס", "אאודי"
];
const fuelTypes = ["בנזין", "דיזל", "היבריד", "חשמלי", "היבריד פלאג-אין"];
const transmissionTypes = ["אוטומט", "ידני", "רובוטרון", "טיפטרוניק"];
const handOptions = ["יד ראשונה", "יד שנייה", "יד שלישית", "יד 4+"];
const vehicleTypes = ["רכב פרטי", "רכב מסחרי", "משאיות", "אופנועים"];

export const CarSidebar = ({ onFilterChange, counts }: CarSidebarProps) => {
  const [filters, setFilters] = useState<SidebarFilters>({
    manufacturers: [],
    yearFrom: "",
    yearTo: "",
    priceMin: 0,
    priceMax: 300000,
    fuelTypes: [],
    transmissions: [],
    hands: [],
    kmMin: 0,
    kmMax: 300000,
    features: [],
    vehicleTypes: [],
    conditions: [],
    categories: [],
  });

  const handleArrayFilterChange = (
    key: keyof Pick<SidebarFilters, 'manufacturers' | 'fuelTypes' | 'transmissions' | 'hands' | 'features' | 'vehicleTypes' | 'conditions' | 'categories'>,
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

  const handleKmChange = (value: number[]) => {
    const newFilters = { ...filters, kmMin: value[0], kmMax: value[1] };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Car className="w-5 h-5 text-primary" />
          סינון רכבים
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
              max={300000}
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
            {manufacturers.map((brand) => (
              <div key={brand} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`brand-${brand}`}
                    checked={filters.manufacturers.includes(brand)}
                    onCheckedChange={() => handleArrayFilterChange('manufacturers', brand)}
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {brand}
                  </Label>
                </div>
                {counts?.manufacturers?.[brand] && (
                  <span className="text-xs text-muted-foreground">
                    ({counts.manufacturers[brand]})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Vehicle Type */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Car className="w-4 h-4 text-primary" />
            סוג רכב
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {vehicleTypes.map((type) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`vehicle-${type}`}
                    checked={filters.vehicleTypes.includes(type)}
                    onCheckedChange={() => handleArrayFilterChange('vehicleTypes', type)}
                  />
                  <Label
                    htmlFor={`vehicle-${type}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {type}
                  </Label>
                </div>
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
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {fuelTypes.map((fuel) => (
              <div key={fuel} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`fuel-${fuel}`}
                    checked={filters.fuelTypes.includes(fuel)}
                    onCheckedChange={() => handleArrayFilterChange('fuelTypes', fuel)}
                  />
                  <Label
                    htmlFor={`fuel-${fuel}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {fuel}
                  </Label>
                </div>
                {counts?.fuelTypes?.[fuel] && (
                  <span className="text-xs text-muted-foreground">
                    ({counts.fuelTypes[fuel]})
                  </span>
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
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {transmissionTypes.map((trans) => (
              <div key={trans} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`trans-${trans}`}
                    checked={filters.transmissions.includes(trans)}
                    onCheckedChange={() => handleArrayFilterChange('transmissions', trans)}
                  />
                  <Label
                    htmlFor={`trans-${trans}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {trans}
                  </Label>
                </div>
                {counts?.transmissions?.[trans] && (
                  <span className="text-xs text-muted-foreground">
                    ({counts.transmissions[trans]})
                  </span>
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
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {handOptions.map((hand) => (
              <div key={hand} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`hand-${hand}`}
                    checked={filters.hands.includes(hand)}
                    onCheckedChange={() => handleArrayFilterChange('hands', hand)}
                  />
                  <Label
                    htmlFor={`hand-${hand}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {hand}
                  </Label>
                </div>
                {counts?.hands?.[hand] && (
                  <span className="text-xs text-muted-foreground">
                    ({counts.hands[hand]})
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

export default CarSidebar;
