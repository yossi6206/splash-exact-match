import { useState } from "react";
import { Building2, MapPin, Home, Calendar, Sparkles, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface FilterCounts {
  projectTypes: Record<string, number>;
  locations: Record<string, number>;
  listingTypes: Record<string, number>;
  amenities: Record<string, number>;
}

interface ProjectSidebarFilterProps {
  onFilterChange: (filters: {
    listingType: string[];
    projectType: string[];
    location: string[];
    priceRange: [number, number];
    roomsRange: [number, number];
    deliveryYear: string[];
    amenities: string[];
  }) => void;
  filterCounts: FilterCounts;
}

const projectTypes = [
  "מגורים",
  "מסחרי",
  "משרדים",
  "תעשייה",
  "מעונות סטודנטים",
  "דיור מוגן",
];

const amenitiesList = [
  "חניה",
  "מחסן",
  "מעלית",
  "מרפסת שמש",
  "נוף לים",
  "בריכה",
  "חדר כושר",
  "לובי מפואר",
  "קונסיירז'",
  "גינה משותפת",
];

const deliveryYears = ["2024", "2025", "2026", "2027", "2028+"];

const ProjectSidebarFilter = ({
  onFilterChange,
  filterCounts,
}: ProjectSidebarFilterProps) => {
  const [listingType, setListingType] = useState<string[]>([]);
  const [projectType, setProjectType] = useState<string[]>([]);
  const [location, setLocation] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [roomsRange, setRoomsRange] = useState<[number, number]>([1, 6]);
  const [deliveryYear, setDeliveryYear] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);

  const handleFilterChange = () => {
    onFilterChange({
      listingType,
      projectType,
      location,
      priceRange,
      roomsRange,
      deliveryYear,
      amenities,
    });
  };

  const toggleArrayValue = (
    array: string[],
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newArray = array.includes(value)
      ? array.filter((v) => v !== value)
      : [...array, value];
    setter(newArray);
    setTimeout(handleFilterChange, 0);
  };

  const resetFilters = () => {
    setListingType([]);
    setProjectType([]);
    setLocation([]);
    setPriceRange([0, 10000000]);
    setRoomsRange([1, 6]);
    setDeliveryYear([]);
    setAmenities([]);
    onFilterChange({
      listingType: [],
      projectType: [],
      location: [],
      priceRange: [0, 10000000],
      roomsRange: [1, 6],
      deliveryYear: [],
      amenities: [],
    });
  };

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    return `${(value / 1000).toFixed(0)}K`;
  };

  const locations = Object.keys(filterCounts.locations);

  return (
    <Card className="overflow-hidden overscroll-contain">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">סינון פרויקטים</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-primary gap-1"
          >
            <RotateCcw className="h-4 w-4" />
            איפוס
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Listing Type */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-4 w-4 text-primary" />
            <h4 className="font-medium">סוג עסקה</h4>
          </div>
          <Separator className="mb-3" />
          <div className="space-y-2">
            {["מכירה", "השכרה", "מסחרי"].map((type) => (
              <div key={type} className="flex items-center gap-2">
                <Checkbox
                  id={`listing-${type}`}
                  checked={listingType.includes(type)}
                  onCheckedChange={() =>
                    toggleArrayValue(listingType, type, setListingType)
                  }
                />
                <Label
                  htmlFor={`listing-${type}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {type}
                </Label>
                {filterCounts.listingTypes[type] && (
                  <span className="text-xs text-muted-foreground">
                    ({filterCounts.listingTypes[type]})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Project Type */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Home className="h-4 w-4 text-primary" />
            <h4 className="font-medium">סוג פרויקט</h4>
          </div>
          <Separator className="mb-3" />
          <div className="space-y-2">
            {projectTypes.map((type) => (
              <div key={type} className="flex items-center gap-2">
                <Checkbox
                  id={`project-${type}`}
                  checked={projectType.includes(type)}
                  onCheckedChange={() =>
                    toggleArrayValue(projectType, type, setProjectType)
                  }
                />
                <Label
                  htmlFor={`project-${type}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {type}
                </Label>
                {filterCounts.projectTypes[type] && (
                  <span className="text-xs text-muted-foreground">
                    ({filterCounts.projectTypes[type]})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        {locations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-primary" />
              <h4 className="font-medium">מיקום</h4>
            </div>
            <Separator className="mb-3" />
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {locations.map((loc) => (
                <div key={loc} className="flex items-center gap-2">
                  <Checkbox
                    id={`location-${loc}`}
                    checked={location.includes(loc)}
                    onCheckedChange={() =>
                      toggleArrayValue(location, loc, setLocation)
                    }
                  />
                  <Label
                    htmlFor={`location-${loc}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {loc}
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    ({filterCounts.locations[loc]})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-primary font-bold">₪</span>
            <h4 className="font-medium">טווח מחירים</h4>
          </div>
          <Separator className="mb-3" />
          <div className="px-2">
            <Slider
              min={0}
              max={10000000}
              step={100000}
              value={priceRange}
              onValueChange={(value) => {
                setPriceRange(value as [number, number]);
                setTimeout(handleFilterChange, 0);
              }}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₪{formatPrice(priceRange[0])}</span>
              <span>₪{formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </div>

        {/* Rooms Range */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Home className="h-4 w-4 text-primary" />
            <h4 className="font-medium">מספר חדרים</h4>
          </div>
          <Separator className="mb-3" />
          <div className="px-2">
            <Slider
              min={1}
              max={6}
              step={0.5}
              value={roomsRange}
              onValueChange={(value) => {
                setRoomsRange(value as [number, number]);
                setTimeout(handleFilterChange, 0);
              }}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{roomsRange[0]} חדרים</span>
              <span>{roomsRange[1]}+ חדרים</span>
            </div>
          </div>
        </div>

        {/* Delivery Year */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-primary" />
            <h4 className="font-medium">שנת אכלוס</h4>
          </div>
          <Separator className="mb-3" />
          <div className="space-y-2">
            {deliveryYears.map((year) => (
              <div key={year} className="flex items-center gap-2">
                <Checkbox
                  id={`year-${year}`}
                  checked={deliveryYear.includes(year)}
                  onCheckedChange={() =>
                    toggleArrayValue(deliveryYear, year, setDeliveryYear)
                  }
                />
                <Label
                  htmlFor={`year-${year}`}
                  className="text-sm cursor-pointer"
                >
                  {year}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <h4 className="font-medium">מתקנים ושירותים</h4>
          </div>
          <Separator className="mb-3" />
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {amenitiesList.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2">
                <Checkbox
                  id={`amenity-${amenity}`}
                  checked={amenities.includes(amenity)}
                  onCheckedChange={() =>
                    toggleArrayValue(amenities, amenity, setAmenities)
                  }
                />
                <Label
                  htmlFor={`amenity-${amenity}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {amenity}
                </Label>
                {filterCounts.amenities[amenity] && (
                  <span className="text-xs text-muted-foreground">
                    ({filterCounts.amenities[amenity]})
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

export default ProjectSidebarFilter;
