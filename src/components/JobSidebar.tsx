import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Briefcase, DollarSign, Clock, MapPin, Building, RotateCcw, Users } from "lucide-react";
import { useState } from "react";

interface JobSidebarProps {
  onFilterChange?: (filters: JobFilters) => void;
  counts?: {
    industries?: Record<string, number>;
    jobTypes?: Record<string, number>;
    scopes?: Record<string, number>;
    locations?: Record<string, number>;
    companySizes?: Record<string, number>;
  };
}

export interface JobFilters {
  industries: string[];
  jobTypes: string[];
  scopes: string[];
  experienceMin: number;
  experienceMax: number;
  salaryMin: number;
  salaryMax: number;
  locations: string[];
  companySizes: string[];
}

const industries = [
  "טכנולוגיה", "שיווק", "מכירות", "פיננסים", "משאבי אנוש",
  "עיצוב", "ניהול", "הנדסה", "תפעול", "שירות לקוחות"
];

const jobTypes = ["משרה מלאה", "משרה חלקית", "פרילנס", "קבלן", "זמני"];
const scopes = ["היברידי", "עבודה מרחוק", "במשרד"];
const companySizes = ["1-10 עובדים", "11-50 עובדים", "51-200 עובדים", "201-500 עובדים", "501-1000 עובדים", "1000+ עובדים"];
const locations = [
  "תל אביב", "ירושלים", "חיפה", "באר שבע", "נתניה",
  "פתח תקווה", "ראשון לציון", "אשדוד", "רחובות", "בני ברק"
];

export const JobSidebar = ({ onFilterChange, counts }: JobSidebarProps) => {
  const [filters, setFilters] = useState<JobFilters>({
    industries: [],
    jobTypes: [],
    scopes: [],
    experienceMin: 0,
    experienceMax: 20,
    salaryMin: 0,
    salaryMax: 50000,
    locations: [],
    companySizes: [],
  });

  const handleArrayFilterChange = (
    key: keyof Pick<JobFilters, 'industries' | 'jobTypes' | 'scopes' | 'locations' | 'companySizes'>,
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

  const handleSalaryChange = (value: number[]) => {
    const newFilters = { ...filters, salaryMin: value[0], salaryMax: value[1] };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleExperienceChange = (value: number[]) => {
    const newFilters = { ...filters, experienceMin: value[0], experienceMax: value[1] };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: JobFilters = {
      industries: [],
      jobTypes: [],
      scopes: [],
      experienceMin: 0,
      experienceMax: 20,
      salaryMin: 0,
      salaryMax: 50000,
      locations: [],
      companySizes: [],
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  return (
    <Card className="sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          סינון משרות
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-muted-foreground hover:text-foreground">
          <RotateCcw className="w-4 h-4 ml-1" />
          איפוס
        </Button>
      </CardHeader>
      <CardContent className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto overscroll-contain">
        {/* Salary Range */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <Label className="font-semibold">טווח שכר</Label>
          </div>
          <div className="space-y-4">
            <Slider
              value={[filters.salaryMin, filters.salaryMax]}
              onValueChange={handleSalaryChange}
              max={50000}
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₪{filters.salaryMin.toLocaleString()}</span>
              <span>₪{filters.salaryMax.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Experience */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <Label className="font-semibold">ניסיון (שנים)</Label>
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

        {/* Industry */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Building className="w-4 h-4 text-primary" />
            תחום
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {industries.map((industry) => (
              <div key={industry} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`industry-${industry}`}
                    checked={filters.industries.includes(industry)}
                    onCheckedChange={() => handleArrayFilterChange('industries', industry)}
                  />
                  <Label htmlFor={`industry-${industry}`} className="text-sm font-normal cursor-pointer">
                    {industry}
                  </Label>
                </div>
                {counts?.industries?.[industry] && (
                  <span className="text-xs text-muted-foreground">({counts.industries[industry]})</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Job Types */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            סוג משרה
          </Label>
          <div className="space-y-2">
            {jobTypes.map((type) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`type-${type}`}
                    checked={filters.jobTypes.includes(type)}
                    onCheckedChange={() => handleArrayFilterChange('jobTypes', type)}
                  />
                  <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer">
                    {type}
                  </Label>
                </div>
                {counts?.jobTypes?.[type] && (
                  <span className="text-xs text-muted-foreground">({counts.jobTypes[type]})</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Scope */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Building className="w-4 h-4 text-primary" />
            אופן עבודה
          </Label>
          <div className="space-y-2">
            {scopes.map((scope) => (
              <div key={scope} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`scope-${scope}`}
                    checked={filters.scopes.includes(scope)}
                    onCheckedChange={() => handleArrayFilterChange('scopes', scope)}
                  />
                  <Label htmlFor={`scope-${scope}`} className="text-sm font-normal cursor-pointer">
                    {scope}
                  </Label>
                </div>
                {counts?.scopes?.[scope] && (
                  <span className="text-xs text-muted-foreground">({counts.scopes[scope]})</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Company Size */}
        <div className="space-y-3">
          <Label className="font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            גודל חברה
          </Label>
          <div className="space-y-2">
            {companySizes.map((size) => (
              <div key={size} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox 
                    id={`size-${size}`}
                    checked={filters.companySizes.includes(size)}
                    onCheckedChange={() => handleArrayFilterChange('companySizes', size)}
                  />
                  <Label htmlFor={`size-${size}`} className="text-sm font-normal cursor-pointer">
                    {size}
                  </Label>
                </div>
                {counts?.companySizes?.[size] && (
                  <span className="text-xs text-muted-foreground">({counts.companySizes[size]})</span>
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