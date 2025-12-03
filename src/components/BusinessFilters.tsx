import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, TrendingUp, DollarSign, RotateCcw } from "lucide-react";

interface BusinessFiltersProps {
  counts?: {
    categories: Record<string, number>;
    locations: Record<string, number>;
    businessTypes: Record<string, number>;
  };
}

export const BusinessFilters = ({ counts }: BusinessFiltersProps) => {
  const categories = [
    "מזון ומשקאות",
    "קמעונאי",
    "שירותים",
    "טכנולוגיה",
    "בריאות ויופי",
    "חינוך",
    "בידור",
    "תיירות",
  ];

  const businessTypes = [
    "מסעדה",
    "קפה",
    "חנות",
    "משרד",
    "סלון",
    "חדר כושר",
    "מכון",
    "מלון",
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

  return (
    <Card className="sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          סינון עסקים
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground">
          <RotateCcw className="w-4 h-4 ml-1" />
          איפוס
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <Label className="font-semibold">טווח מחירים</Label>
          </div>
          <div className="space-y-4">
            <Slider
              defaultValue={[0, 10000000]}
              max={10000000}
              step={100000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₪0</span>
              <span>₪10M+</span>
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
                  <Checkbox id={`category-${category}`} />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
                {counts?.categories[category] && (
                  <span className="text-xs text-muted-foreground">
                    ({counts.categories[category]})
                  </span>
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
                  <Checkbox id={`type-${type}`} />
                  <Label
                    htmlFor={`type-${type}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {type}
                  </Label>
                </div>
                {counts?.businessTypes[type] && (
                  <span className="text-xs text-muted-foreground">
                    ({counts.businessTypes[type]})
                  </span>
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
                  <Checkbox id={`location-${location}`} />
                  <Label
                    htmlFor={`location-${location}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {location}
                  </Label>
                </div>
                {counts?.locations[location] && (
                  <span className="text-xs text-muted-foreground">
                    ({counts.locations[location]})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Annual Revenue Range */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <Label className="font-semibold">מחזור שנתי</Label>
          </div>
          <div className="space-y-4">
            <Slider
              defaultValue={[0, 5000000]}
              max={5000000}
              step={100000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₪0</span>
              <span>₪5M+</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessFilters;