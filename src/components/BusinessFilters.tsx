import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, TrendingUp, DollarSign, RotateCcw, Users, Calendar } from "lucide-react";
import { useState } from "react";

interface BusinessFiltersProps {
  onFilterChange?: (filters: BusinessFilterState) => void;
  counts?: {
    categories?: Record<string, number>;
    locations?: Record<string, number>;
    businessTypes?: Record<string, number>;
  };
}

export interface BusinessFilterState {
  categories: string[];
  businessTypes: string[];
  locations: string[];
  priceMin: number;
  priceMax: number;
  annualRevenueMin: number;
  annualRevenueMax: number;
  monthlyProfitMin: number;
  monthlyProfitMax: number;
  yearsOperatingMin: number;
  yearsOperatingMax: number;
  employeesMin: number;
  employeesMax: number;
}

const categories = [
  "מסעדות ובתי קפה",
  "קמעונאות וסחר",
  "שירותים",
  "טכנולוגיה",
  "חינוך והדרכה",
  "בריאות ויופי",
  "ייצור ותעשייה",
  "נדל\"ן",
  "תיירות ואירוח",
  "אחר"
];

const businessTypes = [
  "בעלות מלאה",
  "שותפות",
  "זיכיון",
  "סניף",
  "עסק מקוון",
  "עסק פיזי",
  "היברידי"
];

const locations = [
  "תל אביב",
  "ירושלים",
  "חיפה",
  "באר שבע",
  "אשדוד",
  "פתח תקווה",
  "נתניה",
  "ראשון לציון",
];

export const BusinessFilters = ({ onFilterChange, counts }: BusinessFiltersProps) => {
  const [filters, setFilters] = useState<BusinessFilterState>({
    categories: [],
    businessTypes: [],
    locations: [],
    priceMin: 0,
    priceMax: 10000000,
    annualRevenueMin: 0,
    annualRevenueMax: 10000000,
    monthlyProfitMin: 0,
    monthlyProfitMax: 500000,
    yearsOperatingMin: 0,
    yearsOperatingMax: 30,
    employeesMin: 0,
    employeesMax: 100,
  });

  const handleArrayFilterChange = (
    key: keyof Pick<BusinessFilterState, 'categories' | 'businessTypes' | 'locations'>,
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

  const handleRangeChange = (
    minKey: keyof BusinessFilterState,
    maxKey: keyof BusinessFilterState,
    value: number[]
  ) => {
    const newFilters = { ...filters, [minKey]: value[0], [maxKey]: value[1] };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: BusinessFilterState = {
      categories: [],
      businessTypes: [],
      locations: [],
      priceMin: 0,
      priceMax: 10000000,
      annualRevenueMin: 0,
      annualRevenueMax: 10000000,
      monthlyProfitMin: 0,
      monthlyProfitMax: 500000,
      yearsOperatingMin: 0,
      yearsOperatingMax: 30,
      employeesMin: 0,
      employeesMax: 100,
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  return (
    <Card className="sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          סינון עסקים
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
            <Label className="font-semibold">מחיר מבוקש</Label>
          </div>
          <div className="space-y-4">
            <Slider
              value={[filters.priceMin, filters.priceMax]}
              onValueChange={(value) => handleRangeChange('priceMin', 'priceMax', value)}
              max={10000000}
              step={100000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₪{filters.priceMin.toLocaleString()}</span>
              <span>₪{filters.priceMax.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Annual Revenue */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <Label className="font-semibold">מחזור שנתי</Label>
          </div>
          <div className="space-y-4">
            <Slider
              value={[filters.annualRevenueMin, filters.annualRevenueMax]}
              onValueChange={(value) => handleRangeChange('annualRevenueMin', 'annualRevenueMax', value)}
              max={10000000}
              step={100000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₪{filters.annualRevenueMin.toLocaleString()}</span>
              <span>₪{filters.annualRevenueMax.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Monthly Profit */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <Label className="font-semibold">רווח חודשי</Label>
          </div>
          <div className="space-y-4">
            <Slider
              value={[filters.monthlyProfitMin, filters.monthlyProfitMax]}
              onValueChange={(value) => handleRangeChange('monthlyProfitMin', 'monthlyProfitMax', value)}
              max={500000}
              step={10000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₪{filters.monthlyProfitMin.toLocaleString()}</span>
              <span>₪{filters.monthlyProfitMax.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Years Operating */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <Label className="font-semibold">שנות פעילות</Label>
          </div>
          <div className="space-y-4">
            <Slider
              value={[filters.yearsOperatingMin, filters.yearsOperatingMax]}
              onValueChange={(value) => handleRangeChange('yearsOperatingMin', 'yearsOperatingMax', value)}
              max={30}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.yearsOperatingMin} שנים</span>
              <span>{filters.yearsOperatingMax} שנים</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Employees */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <Label className="font-semibold">מספר עובדים</Label>
          </div>
          <div className="space-y-4">
            <Slider
              value={[filters.employeesMin, filters.employeesMax]}
              onValueChange={(value) => handleRangeChange('employeesMin', 'employeesMax', value)}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.employeesMin}</span>
              <span>{filters.employeesMax}+</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Categories */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            קטגוריה
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => handleArrayFilterChange('categories', category)}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm font-normal cursor-pointer">
                    {category}
                  </Label>
                </div>
                {counts?.categories?.[category] && (
                  <span className="text-xs text-muted-foreground">({counts.categories[category]})</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Business Type */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            סוג עסק
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {businessTypes.map((type) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`type-${type}`}
                    checked={filters.businessTypes.includes(type)}
                    onCheckedChange={() => handleArrayFilterChange('businessTypes', type)}
                  />
                  <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer">
                    {type}
                  </Label>
                </div>
                {counts?.businessTypes?.[type] && (
                  <span className="text-xs text-muted-foreground">({counts.businessTypes[type]})</span>
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
            {locations.map((location) => (
              <div key={location} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`location-${location}`}
                    checked={filters.locations.includes(location)}
                    onCheckedChange={() => handleArrayFilterChange('locations', location)}
                  />
                  <Label htmlFor={`location-${location}`} className="text-sm font-normal cursor-pointer">
                    {location}
                  </Label>
                </div>
                {counts?.locations?.[location] && (
                  <span className="text-xs text-muted-foreground">({counts.locations[location]})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessFilters;