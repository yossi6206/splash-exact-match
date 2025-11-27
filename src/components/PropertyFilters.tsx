import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const PropertyFilters = () => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Property Type */}
        <div className="space-y-2">
          <Label>סוג נכס</Label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הכל</SelectItem>
              <SelectItem value="apartment">דירה</SelectItem>
              <SelectItem value="house">בית פרטי</SelectItem>
              <SelectItem value="penthouse">פנטהאוז</SelectItem>
              <SelectItem value="duplex">דופלקס</SelectItem>
              <SelectItem value="garden">דירת גן</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label>עיר</Label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הערים</SelectItem>
              <SelectItem value="tel-aviv">תל אביב</SelectItem>
              <SelectItem value="jerusalem">ירושלים</SelectItem>
              <SelectItem value="haifa">חיפה</SelectItem>
              <SelectItem value="beer-sheva">באר שבע</SelectItem>
              <SelectItem value="netanya">נתניה</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rooms */}
        <div className="space-y-2">
          <Label>מספר חדרים</Label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל המספרים</SelectItem>
              <SelectItem value="1">1 חדר</SelectItem>
              <SelectItem value="2">2 חדרים</SelectItem>
              <SelectItem value="3">3 חדרים</SelectItem>
              <SelectItem value="4">4 חדרים</SelectItem>
              <SelectItem value="5">5+ חדרים</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>טווח מחיר</Label>
          <div className="flex gap-2">
            <Input type="number" placeholder="מינימום" className="bg-background" />
            <Input type="number" placeholder="מקסימום" className="bg-background" />
          </div>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {/* Size */}
        <div className="space-y-2">
          <Label>גודל (מ"ר)</Label>
          <div className="flex gap-2">
            <Input type="number" placeholder="מינימום" className="bg-background" />
            <Input type="number" placeholder="מקסימום" className="bg-background" />
          </div>
        </div>

        {/* Floor */}
        <div className="space-y-2">
          <Label>קומה</Label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הקומות</SelectItem>
              <SelectItem value="0">קרקע</SelectItem>
              <SelectItem value="1-3">1-3</SelectItem>
              <SelectItem value="4-7">4-7</SelectItem>
              <SelectItem value="8+">8+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Condition */}
        <div className="space-y-2">
          <Label>מצב</Label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הכל</SelectItem>
              <SelectItem value="new">חדש מקבלן</SelectItem>
              <SelectItem value="renovated">משופץ</SelectItem>
              <SelectItem value="good">במצב טוב</SelectItem>
              <SelectItem value="needs-renovation">דורש שיפוץ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <Label>תכונות</Label>
          <Select defaultValue="all">
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל התכונות</SelectItem>
              <SelectItem value="parking">חניה</SelectItem>
              <SelectItem value="elevator">מעלית</SelectItem>
              <SelectItem value="balcony">מרפסת</SelectItem>
              <SelectItem value="accessible">נגיש</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <Button variant="outline" className="flex-1">
          <Bell className="ml-2 h-4 w-4" />
          צור התראה
        </Button>
        <Button className="flex-1">חפש נכסים</Button>
      </div>
    </div>
  );
};