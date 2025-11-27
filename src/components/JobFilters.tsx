import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Building2, X } from "lucide-react";

export const JobFilters = () => {
  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="חיפוש משרה..."
            className="pr-10"
          />
        </div>

        {/* Location */}
        <div className="relative">
          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="מיקום"
            className="pr-10"
          />
        </div>

        {/* Category */}
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="תחום" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tech">טכנולוגיה</SelectItem>
            <SelectItem value="marketing">שיווק</SelectItem>
            <SelectItem value="sales">מכירות</SelectItem>
            <SelectItem value="finance">פיננסים</SelectItem>
            <SelectItem value="hr">משאבי אנוש</SelectItem>
            <SelectItem value="design">עיצוב</SelectItem>
          </SelectContent>
        </Select>

        {/* Job Type */}
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="סוג משרה" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full-time">משרה מלאה</SelectItem>
            <SelectItem value="part-time">משרה חלקית</SelectItem>
            <SelectItem value="contract">פרילנס</SelectItem>
            <SelectItem value="freelance">קבלן</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Experience */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">ניסיון (שנים)</Label>
            <div className="flex items-center gap-4">
              <Input type="number" placeholder="מ-" className="w-20" />
              <span className="text-muted-foreground">-</span>
              <Input type="number" placeholder="עד" className="w-20" />
            </div>
          </div>

          {/* Scope */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">היקף משרה</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox id="full-time" />
                <label htmlFor="full-time" className="text-sm cursor-pointer">
                  משרה מלאה
                </label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox id="part-time" />
                <label htmlFor="part-time" className="text-sm cursor-pointer">
                  משרה חלקית
                </label>
              </div>
            </div>
          </div>

          {/* Remote */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">אופן עבודה</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox id="remote" />
                <label htmlFor="remote" className="text-sm cursor-pointer">
                  עבודה מרחוק
                </label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox id="hybrid" />
                <label htmlFor="hybrid" className="text-sm cursor-pointer">
                  היברידי
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <Button className="rounded-full">
            חפש משרות
          </Button>
          <Button variant="outline" className="rounded-full">
            <X className="w-4 h-4 ml-2" />
            נקה סינון
          </Button>
        </div>
      </div>
    </div>
  );
};
