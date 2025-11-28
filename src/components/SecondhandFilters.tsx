import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export const SecondhandFilters = () => {
  const [priceRange, setPriceRange] = useState([0, 10000]);

  return (
    <Card className="p-6 sticky top-24 bg-background">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">סינון תוצאות</h3>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            נקה הכל
          </Button>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">מיקום</Label>
          <Select>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="בחר אזור" />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="all">כל הארץ</SelectItem>
              <SelectItem value="center">מרכז</SelectItem>
              <SelectItem value="north">צפון</SelectItem>
              <SelectItem value="south">דרום</SelectItem>
              <SelectItem value="jerusalem">ירושלים והסביבה</SelectItem>
              <SelectItem value="haifa">חיפה והקריות</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Condition */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">מצב המוצר</Label>
          <Select>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="כל המצבים" />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="all">כל המצבים</SelectItem>
              <SelectItem value="new">חדש באריזה</SelectItem>
              <SelectItem value="like-new">כמו חדש</SelectItem>
              <SelectItem value="excellent">מצב מעולה</SelectItem>
              <SelectItem value="good">מצב טוב</SelectItem>
              <SelectItem value="fair">מצב סביר</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold">טווח מחירים</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={10000}
              step={100}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="מינימום"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="bg-background"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="מקסימום"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="bg-background"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₪{priceRange[0].toLocaleString()}</span>
            <span>₪{priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">מיון</Label>
          <Select defaultValue="date">
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="date">הכי חדש</SelectItem>
              <SelectItem value="price-low">מחיר נמוך-גבוה</SelectItem>
              <SelectItem value="price-high">מחיר גבוה-נמוך</SelectItem>
              <SelectItem value="popular">הכי פופולרי</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Delivery Options */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">אפשרויות משלוח</Label>
          <Select>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="כל האפשרויות" />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="all">כל האפשרויות</SelectItem>
              <SelectItem value="pickup">איסוף עצמי</SelectItem>
              <SelectItem value="delivery">משלוח</SelectItem>
              <SelectItem value="both">איסוף או משלוח</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Apply Button */}
        <Button className="w-full" size="lg">
          החל סינון
        </Button>
      </div>
    </Card>
  );
};