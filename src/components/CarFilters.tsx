import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Bell, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface CarFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  manufacturer: string;
  yearFrom: string;
  yearTo: string;
  priceMin: number;
  priceMax: number;
  fuelType: string;
  transmission: string;
}

export const CarFilters = ({ onFilterChange }: CarFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    manufacturer: "",
    yearFrom: "",
    yearTo: "",
    priceMin: 0,
    priceMax: 300000,
    fuelType: "",
    transmission: "",
  });

  const manufacturers = [
    "טויוטה", "מזדה", "יונדאי", "קיה", "הונדה", "ניסאן", 
    "פולקסווגן", "שקודה", "סיאט", "ב מ וו", "מרצדס", "אאודי",
    "רנו", "פיג'ו", "סיטרואן"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 25 }, (_, i) => currentYear - i);

  const handleFilterChange = (key: keyof FilterState, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const newFilters = { ...filters, priceMin: value[0], priceMax: value[1] };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      manufacturer: "",
      yearFrom: "",
      yearTo: "",
      priceMin: 0,
      priceMax: 300000,
      fuelType: "",
      transmission: "",
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6 space-y-4">
      {/* Quick Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={filters.manufacturer} onValueChange={(value) => handleFilterChange("manufacturer", value)}>
          <SelectTrigger className="w-full sm:w-48 bg-background">
            <SelectValue placeholder="יצרן" />
          </SelectTrigger>
          <SelectContent className="bg-card z-50">
            <SelectItem value="all">כל היצרנים</SelectItem>
            {manufacturers.map((brand) => (
              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.fuelType} onValueChange={(value) => handleFilterChange("fuelType", value)}>
          <SelectTrigger className="w-full sm:w-40 bg-background">
            <SelectValue placeholder="סוג דלק" />
          </SelectTrigger>
          <SelectContent className="bg-card z-50">
            <SelectItem value="all">כל סוגי הדלק</SelectItem>
            <SelectItem value="בנזין">בנזין</SelectItem>
            <SelectItem value="דיזל">דיזל</SelectItem>
            <SelectItem value="היבריד">היבריד</SelectItem>
            <SelectItem value="חשמלי">חשמלי</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.transmission} onValueChange={(value) => handleFilterChange("transmission", value)}>
          <SelectTrigger className="w-full sm:w-40 bg-background">
            <SelectValue placeholder="תיבת הילוכים" />
          </SelectTrigger>
          <SelectContent className="bg-card z-50">
            <SelectItem value="all">כל התיבות</SelectItem>
            <SelectItem value="אוט'">אוטומט</SelectItem>
            <SelectItem value="ידני">ידני</SelectItem>
            <SelectItem value="רובוטרון">רובוטרון</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {showAdvanced ? "הסתר" : "סינון מתקדם"}
        </Button>

        <Button 
          variant="ghost" 
          onClick={resetFilters}
          className="gap-2"
        >
          <X className="h-4 w-4" />
          נקה הכל
        </Button>

        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 mr-auto">
          <Bell className="h-4 w-4" />
          יצירת התראה
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="pt-4 border-t border-border space-y-6">
          {/* Year Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">שנה מ-</label>
              <Select value={filters.yearFrom} onValueChange={(value) => handleFilterChange("yearFrom", value)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="בחר שנה" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50 max-h-[300px]">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">שנה עד-</label>
              <Select value={filters.yearTo} onValueChange={(value) => handleFilterChange("yearTo", value)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="בחר שנה" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50 max-h-[300px]">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">טווח מחירים</label>
              <span className="text-sm text-muted-foreground">
                ₪{filters.priceMin.toLocaleString()} - ₪{filters.priceMax.toLocaleString()}
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
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>₪0</span>
              <span>₪300,000+</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
