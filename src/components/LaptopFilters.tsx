import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const LaptopFilters = () => {
  return (
    <div className="space-y-6">
      {/* Price Range */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">טווח מחיר</Label>
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground">
              נקה
            </Button>
          </div>
          <div className="space-y-4">
            <Slider
              defaultValue={[0, 100]}
              max={20000}
              step={100}
              className="w-full"
            />
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">מינימום</Label>
                <div className="mt-1 px-3 py-2 border rounded-md bg-background text-sm">
                  ₪0
                </div>
              </div>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">מקסימום</Label>
                <div className="mt-1 px-3 py-2 border rounded-md bg-background text-sm">
                  ₪20,000
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Manufacturer */}
      <Card className="p-4">
        <div className="space-y-3">
          <Label className="text-base font-semibold">יצרן</Label>
          <div className="space-y-3">
            {["Apple", "Lenovo", "HP", "Dell", "ASUS", "Microsoft"].map((brand) => (
              <div key={brand} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox id={`brand-${brand}`} />
                <label
                  htmlFor={`brand-${brand}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* RAM */}
      <Card className="p-4">
        <div className="space-y-3">
          <Label className="text-base font-semibold">זיכרון RAM</Label>
          <div className="space-y-3">
            {["4GB", "8GB", "16GB", "32GB", "64GB+"].map((ram) => (
              <div key={ram} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox id={`ram-${ram}`} />
                <label
                  htmlFor={`ram-${ram}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {ram}
                </label>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Screen Size */}
      <Card className="p-4">
        <div className="space-y-3">
          <Label className="text-base font-semibold">גודל מסך</Label>
          <div className="space-y-3">
            {['עד 13"', '13"-14"', '14"-15"', '15"-16"', '16"+'].map((size) => (
              <div key={size} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox id={`size-${size}`} />
                <label
                  htmlFor={`size-${size}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {size}
                </label>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Condition */}
      <Card className="p-4">
        <div className="space-y-3">
          <Label className="text-base font-semibold">מצב המוצר</Label>
          <div className="space-y-3">
            {["חדש באריזה", "כמו חדש", "משומש - במצב טוב", "משומש - במצב סביר"].map((condition) => (
              <div key={condition} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox id={`condition-${condition}`} />
                <label
                  htmlFor={`condition-${condition}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {condition}
                </label>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Location */}
      <Card className="p-4">
        <div className="space-y-3">
          <Label className="text-base font-semibold">עיר</Label>
          <div className="space-y-3">
            {["תל אביב", "ירושלים", "חיפה", "באר שבע", "נתניה"].map((city) => (
              <div key={city} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox id={`city-${city}`} />
                <label
                  htmlFor={`city-${city}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {city}
                </label>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Apply Filters Button */}
      <Button className="w-full" size="lg">
        הצג תוצאות
      </Button>
    </div>
  );
};