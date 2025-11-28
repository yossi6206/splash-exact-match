import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface JobSidebarProps {
  onFilterChange?: (filters: JobFilters) => void;
}

export interface JobFilters {
  categories: string[];
  jobTypes: string[];
  scopes: string[];
  experienceMin: number;
  experienceMax: number;
  salaryMin: number;
  salaryMax: number;
  locations: string[];
}

const categories = [
  "טכנולוגיה", "שיווק", "מכירות", "פיננסים", "משאבי אנוש",
  "עיצוב", "ניהול", "הנדסה", "תפעול", "שירות לקוחות"
];

const jobTypes = ["משרה מלאה", "משרה חלקית", "פרילנס", "קבלן", "זמני"];
const scopes = ["היברידית", "מהבית", "במשרד"];
const locations = [
  "תל אביב", "ירושלים", "חיפה", "באר שבע", "נתניה",
  "פתח תקווה", "ראשון לציון", "אשדוד", "רחובות", "בני ברק",
  "הרצליה", "כפר סבא", "רעננה", "מודיעין", "רמת גן"
];

export const JobSidebar = ({ onFilterChange }: JobSidebarProps) => {
  const [filters, setFilters] = useState<JobFilters>({
    categories: [],
    jobTypes: [],
    scopes: [],
    experienceMin: 0,
    experienceMax: 20,
    salaryMin: 0,
    salaryMax: 50000,
    locations: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    jobTypes: true,
    scopes: true,
    experience: false,
    salary: false,
    locations: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilters = (newFilters: Partial<JobFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange?.(updated);
  };

  const toggleArrayFilter = (key: keyof Pick<JobFilters, 'categories' | 'jobTypes' | 'scopes' | 'locations'>, value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilters({ [key]: newArray });
  };

  const resetFilters = () => {
    const resetFilters: JobFilters = {
      categories: [],
      jobTypes: [],
      scopes: [],
      experienceMin: 0,
      experienceMax: 20,
      salaryMin: 0,
      salaryMax: 50000,
      locations: [],
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  const activeFiltersCount = 
    filters.categories.length +
    filters.jobTypes.length +
    filters.scopes.length +
    filters.locations.length +
    (filters.experienceMin > 0 || filters.experienceMax < 20 ? 1 : 0) +
    (filters.salaryMin > 0 || filters.salaryMax < 50000 ? 1 : 0);

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

          <div className="max-h-[calc(100vh-280px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-track]:bg-transparent">
            {/* Categories */}
            <FilterSection title="תחום" section="categories">
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
                      onCheckedChange={() => toggleArrayFilter('categories', category)}
                    />
                  </div>
                ))}
              </div>
            </FilterSection>

            {/* Job Types */}
            <FilterSection title="סוג משרה" section="jobTypes">
              <div className="space-y-3">
                {jobTypes.map((type) => (
                  <div key={type} className="flex items-center justify-between gap-2">
                    <label
                      htmlFor={`type-${type}`}
                      className="text-sm text-foreground cursor-pointer flex-1 text-right"
                    >
                      {type}
                    </label>
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.jobTypes.includes(type)}
                      onCheckedChange={() => toggleArrayFilter('jobTypes', type)}
                    />
                  </div>
                ))}
              </div>
            </FilterSection>

            {/* Scope */}
            <FilterSection title="אופן עבודה" section="scopes">
              <div className="space-y-3">
                {scopes.map((scope) => (
                  <div key={scope} className="flex items-center justify-between gap-2">
                    <label
                      htmlFor={`scope-${scope}`}
                      className="text-sm text-foreground cursor-pointer flex-1 text-right"
                    >
                      {scope}
                    </label>
                    <Checkbox
                      id={`scope-${scope}`}
                      checked={filters.scopes.includes(scope)}
                      onCheckedChange={() => toggleArrayFilter('scopes', scope)}
                    />
                  </div>
                ))}
              </div>
            </FilterSection>

            {/* Experience */}
            <FilterSection title="ניסיון (שנים)" section="experience">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={filters.experienceMin}
                    onChange={(e) => updateFilters({ experienceMin: Number(e.target.value) })}
                    placeholder="מינימום"
                    className="text-center"
                    min={0}
                    max={20}
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    value={filters.experienceMax}
                    onChange={(e) => updateFilters({ experienceMax: Number(e.target.value) })}
                    placeholder="מקסימום"
                    className="text-center"
                    min={0}
                    max={20}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {filters.experienceMin} - {filters.experienceMax} שנים
                </div>
              </div>
            </FilterSection>

            {/* Salary */}
            <FilterSection title="שכר (₪)" section="salary">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={filters.salaryMin}
                    onChange={(e) => updateFilters({ salaryMin: Number(e.target.value) })}
                    placeholder="מינימום"
                    className="text-center"
                    min={0}
                    max={50000}
                    step={1000}
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    value={filters.salaryMax}
                    onChange={(e) => updateFilters({ salaryMax: Number(e.target.value) })}
                    placeholder="מקסימום"
                    className="text-center"
                    min={0}
                    max={50000}
                    step={1000}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  ₪{filters.salaryMin.toLocaleString()} - ₪{filters.salaryMax.toLocaleString()}
                </div>
              </div>
            </FilterSection>

            {/* Locations */}
            <FilterSection title="מיקום" section="locations">
              <div className="space-y-3">
                {locations.slice(0, 10).map((location) => (
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
                      onCheckedChange={() => toggleArrayFilter('locations', location)}
                    />
                  </div>
                ))}
                {locations.length > 10 && (
                  <Button variant="ghost" size="sm" className="w-full text-primary">
                    הצג עוד ערים
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
