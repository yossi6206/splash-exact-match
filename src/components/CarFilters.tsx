import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell } from "lucide-react";

export const CarFilters = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-border p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Create Alert Button */}
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 order-first lg:order-last">
          <Bell className="h-4 w-4" />
          יצירת התראה
        </Button>

        {/* Filters */}
        <Select>
          <SelectTrigger className="w-full sm:w-48 bg-background">
            <SelectValue placeholder="סוג רכב" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="private">פרטי</SelectItem>
            <SelectItem value="commercial">מסחרי</SelectItem>
            <SelectItem value="suv">SUV</SelectItem>
            <SelectItem value="sedan">סדאן</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full sm:w-40 bg-background">
            <SelectValue placeholder="יצרן" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hyundai">יונדאי</SelectItem>
            <SelectItem value="honda">הונדה</SelectItem>
            <SelectItem value="bmw">ב.מ.וו</SelectItem>
            <SelectItem value="toyota">טויוטה</SelectItem>
            <SelectItem value="mazda">מאזדה</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full sm:w-40 bg-background">
            <SelectValue placeholder="דגם" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הדגמים</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-full sm:w-32 bg-background">
            <SelectValue placeholder="שנה" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2021">2021</SelectItem>
            <SelectItem value="2020">2020</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="border-border bg-background hover:bg-muted">
          שנתיים נוספים
        </Button>

        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
          חיפוש
        </Button>
      </div>
    </div>
  );
};
