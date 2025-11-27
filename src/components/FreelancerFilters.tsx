import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

export const FreelancerFilters = () => {
  return (
    <Card className="p-6 sticky top-4">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-right">סינון פרילנסרים</h3>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-right block">קטגוריה</Label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-background text-right">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הקטגוריות</SelectItem>
              <SelectItem value="design">עיצוב גרפי</SelectItem>
              <SelectItem value="development">פיתוח ווב</SelectItem>
              <SelectItem value="writing">כתיבה</SelectItem>
              <SelectItem value="marketing">שיווק דיגיטלי</SelectItem>
              <SelectItem value="video">עריכת וידאו</SelectItem>
              <SelectItem value="photography">צילום</SelectItem>
              <SelectItem value="consulting">ייעוץ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Hourly Rate */}
        <div className="space-y-2">
          <Label className="text-right block">תעריף לשעה (₪)</Label>
          <div className="flex gap-2">
            <Input type="number" placeholder="מקסימום" className="bg-background text-right" dir="rtl" />
            <Input type="number" placeholder="מינימום" className="bg-background text-right" dir="rtl" />
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <Label className="text-right block">דירוג מינימלי</Label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-background text-right">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הדירוגים</SelectItem>
              <SelectItem value="5">5 כוכבים</SelectItem>
              <SelectItem value="4">4+ כוכבים</SelectItem>
              <SelectItem value="3">3+ כוכבים</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-right block">מיקום</Label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-background text-right">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל המיקומים</SelectItem>
              <SelectItem value="tel-aviv">תל אביב</SelectItem>
              <SelectItem value="jerusalem">ירושלים</SelectItem>
              <SelectItem value="haifa">חיפה</SelectItem>
              <SelectItem value="center">מרכז</SelectItem>
              <SelectItem value="south">דרום</SelectItem>
              <SelectItem value="north">צפון</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <Label className="text-right block">שנות ניסיון</Label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-background text-right">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הכל</SelectItem>
              <SelectItem value="0-2">0-2 שנים</SelectItem>
              <SelectItem value="3-5">3-5 שנים</SelectItem>
              <SelectItem value="6-10">6-10 שנים</SelectItem>
              <SelectItem value="10+">10+ שנים</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Languages */}
        <div className="space-y-2">
          <Label className="text-right block">שפות</Label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-background text-right">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל השפות</SelectItem>
              <SelectItem value="hebrew">עברית</SelectItem>
              <SelectItem value="english">אנגלית</SelectItem>
              <SelectItem value="arabic">ערבית</SelectItem>
              <SelectItem value="russian">רוסית</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <Label className="text-right block">זמינות</Label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-background text-right">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הכל</SelectItem>
              <SelectItem value="available">זמין כעת</SelectItem>
              <SelectItem value="busy">עסוק</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t">
          <Button className="w-full">
            <Search className="ml-2 h-4 w-4" />
            חפש פרילנסרים
          </Button>
          <Button variant="outline" className="w-full">
            נקה סינון
          </Button>
        </div>
      </div>
    </Card>
  );
};
