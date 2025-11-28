import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface CarSidebarProps {
  onFilterChange?: (filters: SidebarFilters) => void;
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
}

const manufacturers = [
  "טויוטה", "מזדה", "יונדאי", "קיה", "הונדה", "ניסאן", 
  "פולקסווגן", "שקודה", "סיאט", "ב מ וו", "מרצדס", "אאודי",
  "רנו", "פיג'ו", "סיטרואן", "פורד", "שברולט", "מיצובישי"
];

const fuelTypes = ["בנזין", "דיזל", "היבריד", "חשמלי", "היבריד פלאג-אין"];
const transmissionTypes = ["אוטומט", "ידני", "רובוטרון", "טיפטרוניק"];
const handOptions = ["יד ראשונה", "יד שנייה", "יד שלישית", "יד 4+"];
const popularFeatures = [
  "מצלמת רוורס", "חיישני רוורס", "בקרת שיוט", "גג פנורמי",
  "מושבים מחוממים", "הגה מחומם", "מערכת ניווט", "מערכת שמע",
  "מושבי עור", "חיישני גשם", "פתיחה ללא מפתח", "התנעה ללא מפתח",
  "מושבים חשמליים", "דרייב אסיסט", "נקודה עיוורת", "שמירת נתיב"
];

export const CarSidebar = ({ onFilterChange }: CarSidebarProps) => {
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
  });

  const [expandedSections, setExpandedSections] = useState({
    manufacturer: true,
    year: true,
    price: true,
    fuel: true,
    transmission: true,
    hand: false,
    km: false,
    features: false,
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 25 }, (_, i) => currentYear - i);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleArrayFilterChange = (
    key: keyof Pick<SidebarFilters, 'manufacturers' | 'fuelTypes' | 'transmissions' | 'hands' | 'features'>,
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

  const handleFilterChange = (key: keyof SidebarFilters, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
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

  const resetFilters = () => {
    const defaultFilters = {
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
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  const activeFiltersCount = 
    filters.manufacturers.length +
    filters.fuelTypes.length +
    filters.transmissions.length +
    filters.hands.length +
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
    <div className="hidden lg:block sticky top-20">
      <Card className="overflow-hidden">
        <div className="bg-card border-b border-border p-4 flex items-center justify-between">
          {activeFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={resetFilters}
              className="h-8 gap-1"
            >
              <X className="h-3 w-3" />
              נקה
            </Button>
          )}
          <div className="flex items-center gap-2 mr-auto">
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="h-5">
                {activeFiltersCount}
              </Badge>
            )}
            <h3 className="font-bold text-foreground">סינון תוצאות</h3>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          {/* Manufacturer */}
          <FilterSection title="יצרן" section="manufacturer">
            <div className="space-y-3">
              {manufacturers.slice(0, 8).map((brand) => (
                <div key={brand} className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={`brand-${brand}`}
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    {brand}
                  </label>
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.manufacturers.includes(brand)}
                    onCheckedChange={() => handleArrayFilterChange('manufacturers', brand)}
                  />
                </div>
              ))}
              {manufacturers.length > 8 && (
                <Button variant="ghost" size="sm" className="w-full text-primary">
                  הצג עוד יצרנים
                </Button>
              )}
            </div>
          </FilterSection>

          {/* Year Range */}
          <FilterSection title="שנת ייצור" section="year">
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
                max={300000}
                step={5000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₪0</span>
                <span>₪300,000+</span>
              </div>
            </div>
          </FilterSection>

          {/* Fuel Type */}
          <FilterSection title="סוג דלק" section="fuel">
            <div className="space-y-3">
              {fuelTypes.map((fuel) => (
                <div key={fuel} className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={`fuel-${fuel}`}
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    {fuel}
                  </label>
                  <Checkbox
                    id={`fuel-${fuel}`}
                    checked={filters.fuelTypes.includes(fuel)}
                    onCheckedChange={() => handleArrayFilterChange('fuelTypes', fuel)}
                  />
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Transmission */}
          <FilterSection title="תיבת הילוכים" section="transmission">
            <div className="space-y-3">
              {transmissionTypes.map((trans) => (
                <div key={trans} className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={`trans-${trans}`}
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    {trans}
                  </label>
                  <Checkbox
                    id={`trans-${trans}`}
                    checked={filters.transmissions.includes(trans)}
                    onCheckedChange={() => handleArrayFilterChange('transmissions', trans)}
                  />
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Hand */}
          <FilterSection title="יד" section="hand">
            <div className="space-y-3">
              {handOptions.map((hand) => (
                <div key={hand} className="flex items-center justify-between gap-2">
                  <label
                    htmlFor={`hand-${hand}`}
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    {hand}
                  </label>
                  <Checkbox
                    id={`hand-${hand}`}
                    checked={filters.hands.includes(hand)}
                    onCheckedChange={() => handleArrayFilterChange('hands', hand)}
                  />
                </div>
              ))}
            </div>
          </FilterSection>

          {/* Kilometers */}
          <FilterSection title="קילומטראז'" section="km">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-foreground font-medium">
                  {filters.kmMin.toLocaleString()} ק״מ
                </span>
                <span className="text-foreground font-medium">
                  {filters.kmMax.toLocaleString()} ק״מ
                </span>
              </div>
              <Slider
                value={[filters.kmMin, filters.kmMax]}
                onValueChange={handleKmChange}
                min={0}
                max={300000}
                step={5000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 ק״מ</span>
                <span>300,000+ ק״מ</span>
              </div>
            </div>
          </FilterSection>

          {/* Features */}
          <FilterSection title="תכונות נוספות" section="features">
            <div className="space-y-3">
              {popularFeatures.slice(0, 10).map((feature) => (
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
              {popularFeatures.length > 10 && (
                <Button variant="ghost" size="sm" className="w-full text-primary">
                  הצג עוד תכונות
                </Button>
              )}
            </div>
          </FilterSection>
        </ScrollArea>
      </Card>
    </div>
  );
};
