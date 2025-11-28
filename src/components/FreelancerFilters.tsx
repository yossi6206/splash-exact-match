import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export const FreelancerFilters = () => {
  return (
    <div>
      <Card className="p-6 sticky top-20 max-h-[calc(100vh-96px)] overflow-y-auto shadow-lg hover:shadow-xl transition-shadow duration-300 backdrop-blur-md bg-background/95 border-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-track]:bg-transparent" dir="rtl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">סינון פרילנסרים</h3>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <X className="h-4 w-4 ml-1" />
            נקה הכל
          </Button>
        </div>

        <Separator />

        {/* Category */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">קטגוריה</Label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-background" dir="rtl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הקטגוריות</SelectItem>
              <SelectItem value="design">עיצוב גרפי</SelectItem>
              <SelectItem value="development">פיתוח ווב ואפליקציות</SelectItem>
              <SelectItem value="writing">כתיבה ותוכן</SelectItem>
              <SelectItem value="marketing">שיווק דיגיטלי</SelectItem>
              <SelectItem value="video">עריכת וידאו ואנימציה</SelectItem>
              <SelectItem value="photography">צילום ועריכת תמונות</SelectItem>
              <SelectItem value="consulting">ייעוץ עסקי</SelectItem>
              <SelectItem value="translation">תרגום</SelectItem>
              <SelectItem value="audio">הפקת אודיו</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Hourly Rate */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">תעריף לשעה (₪)</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input type="number" placeholder="מקסימום" className="bg-background text-center" dir="rtl" />
            <Input type="number" placeholder="מינימום" className="bg-background text-center" dir="rtl" />
          </div>
        </div>

        <Separator />

        {/* Rating */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">דירוג מינימלי</Label>
          <Select defaultValue="all">
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
        </div>

        <Separator />

        {/* Location */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">מיקום</Label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-background" dir="rtl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל המיקומים</SelectItem>
              <SelectItem value="tel-aviv">תל אביב-יפו</SelectItem>
              <SelectItem value="jerusalem">ירושלים</SelectItem>
              <SelectItem value="haifa">חיפה</SelectItem>
              <SelectItem value="beer-sheva">באר שבע</SelectItem>
              <SelectItem value="center">מרכז</SelectItem>
              <SelectItem value="south">דרום</SelectItem>
              <SelectItem value="north">צפון</SelectItem>
              <SelectItem value="remote">עבודה מרחוק</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Experience */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">שנות ניסיון</Label>
          <Select defaultValue="all">
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
        </div>

        <Separator />

        {/* Languages */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">שפות</Label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-background" dir="rtl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל השפות</SelectItem>
              <SelectItem value="hebrew">עברית</SelectItem>
              <SelectItem value="english">אנגלית</SelectItem>
              <SelectItem value="arabic">ערבית</SelectItem>
              <SelectItem value="russian">רוסית</SelectItem>
              <SelectItem value="french">צרפתית</SelectItem>
              <SelectItem value="spanish">ספרדית</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Project Completion Rate */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">אחוז השלמת פרויקטים</Label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-background" dir="rtl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הכל</SelectItem>
              <SelectItem value="100">100%</SelectItem>
              <SelectItem value="95">95%+</SelectItem>
              <SelectItem value="90">90%+</SelectItem>
              <SelectItem value="80">80%+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Response Time */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">זמן תגובה</Label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-background" dir="rtl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הכל</SelectItem>
              <SelectItem value="1">תוך שעה</SelectItem>
              <SelectItem value="3">תוך 3 שעות</SelectItem>
              <SelectItem value="24">תוך 24 שעות</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Availability */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">זמינות</Label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-background" dir="rtl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הכל</SelectItem>
              <SelectItem value="available">זמין מיידית</SelectItem>
              <SelectItem value="week">זמין תוך שבוע</SelectItem>
              <SelectItem value="month">זמין תוך חודש</SelectItem>
              <SelectItem value="busy">לא זמין</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Certifications */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">תעודות והסמכות</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="verified" />
              <label htmlFor="verified" className="text-sm cursor-pointer">
                פרילנסר מאומת
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="certified" />
              <label htmlFor="certified" className="text-sm cursor-pointer">
                בעל הסמכות מקצועיות
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="portfolio" />
              <label htmlFor="portfolio" className="text-sm cursor-pointer">
                עם תיק עבודות
              </label>
            </div>
          </div>
        </div>

        <Separator />

        {/* Project Budget */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">תקציב פרויקט מינימלי</Label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-background" dir="rtl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הכל</SelectItem>
              <SelectItem value="500">₪500+</SelectItem>
              <SelectItem value="1000">₪1,000+</SelectItem>
              <SelectItem value="2500">₪2,500+</SelectItem>
              <SelectItem value="5000">₪5,000+</SelectItem>
              <SelectItem value="10000">₪10,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Button className="w-full h-12 text-base font-semibold" size="lg">
            <Search className="ml-2 h-5 w-5" />
            חפש פרילנסרים
          </Button>
        </div>
      </div>
    </Card>
    </div>
  );
};
