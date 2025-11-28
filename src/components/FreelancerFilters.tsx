import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface FreelancerFiltersProps {
  onFilterChange?: (filters: FreelancerFilters) => void;
}

export interface FreelancerFilters {
  categories: string[];
  hourlyRateMin: number;
  hourlyRateMax: number;
  rating: string;
  locations: string[];
  experience: string;
  languages: string[];
  certifications: string[];
}

export const FreelancerFilters = ({ onFilterChange }: FreelancerFiltersProps) => {
  const [filters, setFilters] = useState<FreelancerFilters>({
    categories: [],
    hourlyRateMin: 0,
    hourlyRateMax: 500,
    rating: "all",
    locations: [],
    experience: "all",
    languages: [],
    certifications: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    hourlyRate: true,
    rating: false,
    location: false,
    experience: false,
    languages: false,
    certifications: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const resetFilters = () => {
    const resetFilters: FreelancerFilters = {
      categories: [],
      hourlyRateMin: 0,
      hourlyRateMax: 500,
      rating: "all",
      locations: [],
      experience: "all",
      languages: [],
      certifications: [],
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  const activeFiltersCount = 
    filters.categories.length +
    filters.locations.length +
    filters.languages.length +
    filters.certifications.length +
    (filters.hourlyRateMin > 0 || filters.hourlyRateMax < 500 ? 1 : 0) +
    (filters.rating !== "all" ? 1 : 0) +
    (filters.experience !== "all" ? 1 : 0);

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

  const categories = ["עיצוב גרפי", "פיתוח ווב ואפליקציות", "כתיבה ותוכן", "שיווק דיגיטלי", "עריכת וידאו ואנימציה", "צילום ועריכת תמונות", "ייעוץ עסקי", "תרגום", "הפקת אודיו"];
  const locations = ["תל אביב-יפו", "ירושלים", "חיפה", "באר שבע", "מרכז", "דרום", "צפון", "עבודה מרחוק"];
  const languages = ["עברית", "אנגלית", "ערבית", "רוסית", "צרפתית", "ספרדית"];

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

          <div className="max-h-[calc(100vh-280px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-track]:bg-transparent">{" "}

            {/* Category */}
            <FilterSection title="קטגוריה" section="category">
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category} className="flex items-center justify-between gap-2">
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm text-foreground cursor-pointer flex-1 text-right"
                    >
                      {category}
                    </label>
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => {
                        const newCategories = filters.categories.includes(category)
                          ? filters.categories.filter(c => c !== category)
                          : [...filters.categories, category];
                        const newFilters = { ...filters, categories: newCategories };
                        setFilters(newFilters);
                        onFilterChange?.(newFilters);
                      }}
                    />
                  </div>
                ))}
              </div>
            </FilterSection>

            {/* Hourly Rate */}
            <FilterSection title="תעריף לשעה (₪)" section="hourlyRate">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={filters.hourlyRateMin}
                    onChange={(e) => {
                      const newFilters = { ...filters, hourlyRateMin: Number(e.target.value) };
                      setFilters(newFilters);
                      onFilterChange?.(newFilters);
                    }}
                    placeholder="מינימום"
                    className="text-center"
                    min={0}
                    max={500}
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    value={filters.hourlyRateMax}
                    onChange={(e) => {
                      const newFilters = { ...filters, hourlyRateMax: Number(e.target.value) };
                      setFilters(newFilters);
                      onFilterChange?.(newFilters);
                    }}
                    placeholder="מקסימום"
                    className="text-center"
                    min={0}
                    max={500}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  ₪{filters.hourlyRateMin} - ₪{filters.hourlyRateMax}
                </div>
              </div>
            </FilterSection>

            {/* Rating */}
            <FilterSection title="דירוג מינימלי" section="rating">
              <Select 
                value={filters.rating} 
                onValueChange={(value) => {
                  const newFilters = { ...filters, rating: value };
                  setFilters(newFilters);
                  onFilterChange?.(newFilters);
                }}
              >
                <SelectTrigger className="bg-background" dir="rtl">
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
            </FilterSection>

            {/* Location */}
            <FilterSection title="מיקום" section="location">
              <div className="space-y-3">
                {locations.map((location) => (
                  <div key={location} className="flex items-center justify-between gap-2">
                    <label
                      htmlFor={`location-${location}`}
                      className="text-sm text-foreground cursor-pointer flex-1 text-right"
                    >
                      {location}
                    </label>
                    <Checkbox
                      id={`location-${location}`}
                      checked={filters.locations.includes(location)}
                      onCheckedChange={() => {
                        const newLocations = filters.locations.includes(location)
                          ? filters.locations.filter(l => l !== location)
                          : [...filters.locations, location];
                        const newFilters = { ...filters, locations: newLocations };
                        setFilters(newFilters);
                        onFilterChange?.(newFilters);
                      }}
                    />
                  </div>
                ))}
              </div>
            </FilterSection>

            {/* Experience */}
            <FilterSection title="שנות ניסיון" section="experience">
              <Select 
                value={filters.experience} 
                onValueChange={(value) => {
                  const newFilters = { ...filters, experience: value };
                  setFilters(newFilters);
                  onFilterChange?.(newFilters);
                }}
              >
                <SelectTrigger className="bg-background" dir="rtl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">הכל</SelectItem>
                  <SelectItem value="0-1">פחות משנה</SelectItem>
                  <SelectItem value="1-3">1-3 שנים</SelectItem>
                  <SelectItem value="3-5">3-5 שנים</SelectItem>
                  <SelectItem value="5-10">5-10 שנים</SelectItem>
                  <SelectItem value="10+">מעל 10 שנים</SelectItem>
                </SelectContent>
              </Select>
            </FilterSection>

            {/* Languages */}
            <FilterSection title="שפות" section="languages">
              <div className="space-y-3">
                {languages.map((language) => (
                  <div key={language} className="flex items-center justify-between gap-2">
                    <label
                      htmlFor={`language-${language}`}
                      className="text-sm text-foreground cursor-pointer flex-1 text-right"
                    >
                      {language}
                    </label>
                    <Checkbox
                      id={`language-${language}`}
                      checked={filters.languages.includes(language)}
                      onCheckedChange={() => {
                        const newLanguages = filters.languages.includes(language)
                          ? filters.languages.filter(l => l !== language)
                          : [...filters.languages, language];
                        const newFilters = { ...filters, languages: newLanguages };
                        setFilters(newFilters);
                        onFilterChange?.(newFilters);
                      }}
                    />
                  </div>
                ))}
              </div>
            </FilterSection>

            {/* Certifications */}
            <FilterSection title="תעודות והסמכות" section="certifications">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="verified"
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    פרילנסר מאומת
                  </label>
                  <Checkbox
                    id="verified"
                    checked={filters.certifications.includes("verified")}
                    onCheckedChange={() => {
                      const newCertifications = filters.certifications.includes("verified")
                        ? filters.certifications.filter(c => c !== "verified")
                        : [...filters.certifications, "verified"];
                      const newFilters = { ...filters, certifications: newCertifications };
                      setFilters(newFilters);
                      onFilterChange?.(newFilters);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="certified"
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    בעל הסמכות מקצועיות
                  </label>
                  <Checkbox
                    id="certified"
                    checked={filters.certifications.includes("certified")}
                    onCheckedChange={() => {
                      const newCertifications = filters.certifications.includes("certified")
                        ? filters.certifications.filter(c => c !== "certified")
                        : [...filters.certifications, "certified"];
                      const newFilters = { ...filters, certifications: newCertifications };
                      setFilters(newFilters);
                      onFilterChange?.(newFilters);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="portfolio"
                    className="text-sm text-foreground cursor-pointer flex-1 text-right"
                  >
                    עם תיק עבודות
                  </label>
                  <Checkbox
                    id="portfolio"
                    checked={filters.certifications.includes("portfolio")}
                    onCheckedChange={() => {
                      const newCertifications = filters.certifications.includes("portfolio")
                        ? filters.certifications.filter(c => c !== "portfolio")
                        : [...filters.certifications, "portfolio"];
                      const newFilters = { ...filters, certifications: newCertifications };
                      setFilters(newFilters);
                      onFilterChange?.(newFilters);
                    }}
                  />
                </div>
              </div>
            </FilterSection>
          </div>
        </Card>
      </div>
    </div>
  );
};
