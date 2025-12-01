import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Calendar } from "lucide-react";

interface SoldProperty {
  id: string;
  title: string;
  location: string;
  property_type: string;
  rooms: number;
  size: number | null;
  floor: number | null;
  year: number | null;
  price: number;
  updated_at: string;
}

interface SoldPropertiesInAreaProps {
  currentPropertyLocation: string;
  currentPropertyId: string;
}

const SoldPropertiesInArea = ({ currentPropertyLocation, currentPropertyId }: SoldPropertiesInAreaProps) => {
  const [properties, setProperties] = useState<SoldProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<SoldProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomsFilter, setRoomsFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");

  useEffect(() => {
    const fetchSoldProperties = async () => {
      setLoading(true);
      
      // Extract city/area from location (e.g., "תל אביב" from "תל אביב - רמת אביב")
      const locationArea = currentPropertyLocation.split("-")[0].trim();
      
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .neq("id", currentPropertyId)
        .ilike("location", `%${locationArea}%`)
        .order("updated_at", { ascending: false })
        .limit(20);

      if (!error && data) {
        setProperties(data);
        setFilteredProperties(data);
      }
      
      setLoading(false);
    };

    fetchSoldProperties();
  }, [currentPropertyLocation, currentPropertyId]);

  useEffect(() => {
    let filtered = [...properties];

    if (roomsFilter !== "all") {
      filtered = filtered.filter(p => p.rooms.toString() === roomsFilter);
    }

    if (yearFilter !== "all") {
      const currentYear = new Date().getFullYear();
      const monthsAgo = parseInt(yearFilter);
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsAgo);
      
      filtered = filtered.filter(p => new Date(p.updated_at) >= cutoffDate);
    }

    setFilteredProperties(filtered);
  }, [roomsFilter, yearFilter, properties]);

  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">נכסים שנמכרו באזור</h2>
          </div>
          
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          ) : properties.length > 0 ? (
            <div className="flex gap-2">
              <Select value={roomsFilter} onValueChange={setRoomsFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="חדרים" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל החדרים</SelectItem>
                  <SelectItem value="3">3 חדרים</SelectItem>
                  <SelectItem value="4">4 חדרים</SelectItem>
                  <SelectItem value="5">5 חדרים</SelectItem>
                  <SelectItem value="6">6+ חדרים</SelectItem>
                </SelectContent>
              </Select>

              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="שנת עסקה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל התקופה</SelectItem>
                  <SelectItem value="6">6 חודשים אחרונים</SelectItem>
                  <SelectItem value="12">שנה אחרונה</SelectItem>
                  <SelectItem value="24">שנתיים אחרונות</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">אין נכסים נוספים באזור זה כרגע</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">כתובת</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">סוג נכס</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">ת. עסקה</th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-muted-foreground">חדר׳</th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-muted-foreground">מ״ר</th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-muted-foreground">קומה</th>
                <th className="text-center py-3 px-2 text-sm font-semibold text-muted-foreground">שנת בנייה</th>
                <th className="text-right py-3 px-2 text-sm font-semibold text-muted-foreground">מחיר</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property) => (
                <tr key={property.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                  <td className="py-4 px-2 text-sm font-medium text-foreground">{property.title}</td>
                  <td className="py-4 px-2 text-sm text-foreground">{property.property_type}</td>
                  <td className="py-4 px-2 text-sm text-foreground">
                    {new Date(property.updated_at).toLocaleDateString('he-IL', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit'
                    })}
                  </td>
                  <td className="py-4 px-2 text-sm text-center text-foreground">{property.rooms}</td>
                  <td className="py-4 px-2 text-sm text-center text-foreground">{property.size || '-'}</td>
                  <td className="py-4 px-2 text-sm text-center text-foreground">{property.floor || '-'}</td>
                  <td className="py-4 px-2 text-sm text-center text-foreground">{property.year || '-'}</td>
                  <td className="py-4 px-2 text-sm font-bold text-foreground">
                    ₪{property.price.toLocaleString('he-IL')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProperties.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              לא נמצאו נכסים התואמים את הסינון
            </div>
          )}
        </div>

        {filteredProperties.length > 10 && (
          <div className="flex justify-center gap-1 mt-6">
            <Button variant="outline" size="sm">1</Button>
            <Button variant="ghost" size="sm">2</Button>
            <Button variant="ghost" size="sm">3</Button>
            <span className="px-2 py-1 text-sm text-muted-foreground">...</span>
            <Button variant="ghost" size="sm">8</Button>
          </div>
        )}
      </>
      )}
      </CardContent>
    </Card>
  );
};

export default SoldPropertiesInArea;
