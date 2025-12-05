import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, DollarSign, MapPin, Clock, Languages, Star, RotateCcw, CheckSquare } from "lucide-react";
import { useState } from "react";

interface FreelancerFiltersProps {
  onFilterChange?: (filters: FreelancerFilterState) => void;
  counts?: {
    categories?: Record<string, number>;
    locations?: Record<string, number>;
    languages?: Record<string, number>;
    availabilities?: Record<string, number>;
  };
}

export interface FreelancerFilterState {
  categories: string[];
  hourlyRateMin: number;
  hourlyRateMax: number;
  rating: string;
  locations: string[];
  experienceMin: number;
  experienceMax: number;
  languages: string[];
  availabilities: string[];
  certifications: string[];
}

const categories = [
  "עיצוב גרפי",
  "פיתוח ווב ואפליקציות",
  "כתיבה ותוכן",
  "שיווק דיגיטלי",
  "עריכת וידאו ואנימציה",
  "צילום ועריכת תמונות",
  "ייעוץ עסקי",
  "תרגום",
  "הפקת אודיו"
];

const locations = [
  "תל אביב-יפו",
  "ירושלים",
  "חיפה",
  "באר שבע",
  "מרכז",
  "דרום",
  "צפון",
  "עבודה מרחוק"
];

const languages = ["עברית", "אנגלית", "ערבית", "רוסית", "צרפתית", "ספרדית"];
const availabilities = ["זמין", "עסוק", "לא זמין"];

export const FreelancerFilters = ({ onFilterChange, counts }: FreelancerFiltersProps) => {
  const [filters, setFilters] = useState<FreelancerFilterState>({
    categories: [],
    hourlyRateMin: 30,
    hourlyRateMax: 500,
    rating: "all",
    locations: [],
    experienceMin: 0,
    experienceMax: 20,
    languages: [],
    availabilities: [],
    certifications: [],
  });

  const handleArrayFilterChange = (
    key: keyof Pick<FreelancerFilterState, 'categories' | 'locations' | 'languages' | 'availabilities' | 'certifications'>,
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

  const handleRateChange = (value: number[]) => {
    const newFilters = { ...filters, hourlyRateMin: value[0], hourlyRateMax: value[1] };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleExperienceChange = (value: number[]) => {
    const newFilters = { ...filters, experienceMin: value[0], experienceMax: value[1] };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleRatingChange = (value: string) => {
    const newFilters = { ...filters, rating: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FreelancerFilterState = {
      categories: [],
      hourlyRateMin: 30,
      hourlyRateMax: 500,
      rating: "all",
      locations: [],
      experienceMin: 0,
      experienceMax: 20,
      languages: [],
      availabilities: [],
      certifications: [],
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  return (
    <Card className="sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          סינון פרילנסרים
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-muted-foreground hover:text-foreground">
          <RotateCcw className="w-4 h-4 ml-1" />
          איפוס
        </Button>
      </CardHeader>
      <CardContent className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto overscroll-contain">
        {/* Hourly Rate */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <Label className="font-semibold">תעריף לשעה (₪)</Label>
          </div>
          <div className="space-y-4">
            <Slider
              value={[filters.hourlyRateMin, filters.hourlyRateMax]}
              onValueChange={handleRateChange}
              min={30}
              max={500}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₪{filters.hourlyRateMin}</span>
              <span>₪{filters.hourlyRateMax}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Experience */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <Label className="font-semibold">שנות ניסיון</Label>
          </div>
          <div className="space-y-4">
            <Slider
              value={[filters.experienceMin, filters.experienceMax]}
              onValueChange={handleExperienceChange}
              max={20}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{filters.experienceMin} שנים</span>
              <span>{filters.experienceMax} שנים</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Rating */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            <Label className="font-semibold">דירוג מינימלי</Label>
          </div>
          <Select value={filters.rating} onValueChange={handleRatingChange}>
            <SelectTrigger dir="rtl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הדירוגים</SelectItem>
              <SelectItem value="5">⭐ 5.0</SelectItem>
              <SelectItem value="4.5">⭐ 4.5+</SelectItem>
              <SelectItem value="4">⭐ 4.0+</SelectItem>
              <SelectItem value="3">⭐ 3.0+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Categories */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
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

        <Separator />

        {/* Availability */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            זמינות
          </Label>
          <div className="space-y-2">
            {availabilities.map((availability) => (
              <div key={availability} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`availability-${availability}`}
                    checked={filters.availabilities.includes(availability)}
                    onCheckedChange={() => handleArrayFilterChange('availabilities', availability)}
                  />
                  <Label htmlFor={`availability-${availability}`} className="text-sm font-normal cursor-pointer">
                    {availability}
                  </Label>
                </div>
                {counts?.availabilities?.[availability] && (
                  <span className="text-xs text-muted-foreground">({counts.availabilities[availability]})</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Languages */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Languages className="w-4 h-4 text-primary" />
            שפות
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {languages.map((language) => (
              <div key={language} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`language-${language}`}
                    checked={filters.languages.includes(language)}
                    onCheckedChange={() => handleArrayFilterChange('languages', language)}
                  />
                  <Label htmlFor={`language-${language}`} className="text-sm font-normal cursor-pointer">
                    {language}
                  </Label>
                </div>
                {counts?.languages?.[language] && (
                  <span className="text-xs text-muted-foreground">({counts.languages[language]})</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Certifications */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-primary" />
            תעודות והסמכות
          </Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox 
                id="verified"
                checked={filters.certifications.includes("verified")}
                onCheckedChange={() => handleArrayFilterChange('certifications', "verified")}
              />
              <Label htmlFor="verified" className="text-sm font-normal cursor-pointer">
                פרילנסר מאומת
              </Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox 
                id="certified"
                checked={filters.certifications.includes("certified")}
                onCheckedChange={() => handleArrayFilterChange('certifications', "certified")}
              />
              <Label htmlFor="certified" className="text-sm font-normal cursor-pointer">
                בעל הסמכות מקצועיות
              </Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox 
                id="portfolio"
                checked={filters.certifications.includes("portfolio")}
                onCheckedChange={() => handleArrayFilterChange('certifications', "portfolio")}
              />
              <Label htmlFor="portfolio" className="text-sm font-normal cursor-pointer">
                עם תיק עבודות
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerFilters;