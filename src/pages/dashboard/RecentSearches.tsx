import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Clock, Car, Home, Laptop, Package, Briefcase, User, Building2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { he } from "date-fns/locale";

interface UserSearch {
  id: string;
  search_query: string;
  category: string;
  filters: unknown;
  results_count: number | null;
  created_at: string;
}

const categoryConfig: Record<string, { icon: React.ComponentType<{ className?: string }>, label: string, path: string, color: string }> = {
  all: { icon: Search, label: "הכל", path: "/", color: "bg-primary/10 text-primary" },
  cars: { icon: Car, label: "רכבים", path: "/cars", color: "bg-blue-500/10 text-blue-600" },
  properties: { icon: Home, label: "נדל״ן", path: "/properties", color: "bg-green-500/10 text-green-600" },
  laptops: { icon: Laptop, label: "מחשבים", path: "/laptops", color: "bg-purple-500/10 text-purple-600" },
  secondhand: { icon: Package, label: "יד שנייה", path: "/secondhand", color: "bg-orange-500/10 text-orange-600" },
  jobs: { icon: Briefcase, label: "משרות", path: "/jobs", color: "bg-red-500/10 text-red-600" },
  freelancers: { icon: User, label: "פרילנסרים", path: "/freelancers", color: "bg-teal-500/10 text-teal-600" },
  businesses: { icon: Building2, label: "עסקים", path: "/businesses", color: "bg-indigo-500/10 text-indigo-600" },
};

const RecentSearches = () => {
  const { user } = useAuth();
  const [searches, setSearches] = useState<UserSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSearches();
    }
  }, [user]);

  const fetchSearches = async () => {
    try {
      const { data, error } = await supabase
        .from("user_searches")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setSearches(data || []);
    } catch (error) {
      console.error("Error fetching searches:", error);
      toast.error("שגיאה בטעינת החיפושים");
    } finally {
      setLoading(false);
    }
  };

  const deleteSearch = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_searches")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSearches(searches.filter(s => s.id !== id));
      toast.success("החיפוש נמחק בהצלחה");
    } catch (error) {
      console.error("Error deleting search:", error);
      toast.error("שגיאה במחיקת החיפוש");
    }
  };

  const clearAllSearches = async () => {
    try {
      const { error } = await supabase
        .from("user_searches")
        .delete()
        .eq("user_id", user?.id);

      if (error) throw error;
      setSearches([]);
      toast.success("כל החיפושים נמחקו בהצלחה");
    } catch (error) {
      console.error("Error clearing searches:", error);
      toast.error("שגיאה במחיקת החיפושים");
    }
  };

  const getCategoryInfo = (category: string) => {
    return categoryConfig[category] || categoryConfig.all;
  };

  const buildSearchUrl = (search: UserSearch) => {
    const categoryInfo = getCategoryInfo(search.category);
    const params = new URLSearchParams();
    if (search.search_query) {
      params.set("q", search.search_query);
    }
    const queryString = params.toString();
    return queryString ? `${categoryInfo.path}?${queryString}` : categoryInfo.path;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-24 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">חיפושים אחרונים</h1>
            <p className="text-muted-foreground text-sm">{searches.length} חיפושים שמורים</p>
          </div>
        </div>
        {searches.length > 0 && (
          <Button 
            variant="outline" 
            onClick={clearAllSearches}
            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            מחק הכל
          </Button>
        )}
      </div>

      {searches.length === 0 ? (
        <Card className="bg-background border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 rounded-full bg-muted/50 mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">אין חיפושים שמורים</h3>
            <p className="text-muted-foreground text-center max-w-md">
              כשתחפש פריטים באתר, החיפושים שלך יישמרו כאן כדי שתוכל לחזור אליהם בקלות
            </p>
            <Link to="/">
              <Button className="mt-6 gap-2">
                <Search className="h-4 w-4" />
                התחל לחפש
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {searches.map((search) => {
            const categoryInfo = getCategoryInfo(search.category);
            const CategoryIcon = categoryInfo.icon;
            
            return (
              <Card 
                key={search.id} 
                className="bg-background border-border hover:shadow-md transition-all group"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${categoryInfo.color}`}>
                      <CategoryIcon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {search.search_query || "חיפוש כללי"}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {categoryInfo.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {format(new Date(search.created_at), "dd MMM yyyy, HH:mm", { locale: he })}
                        </span>
                        {search.results_count && search.results_count > 0 && (
                          <span>{search.results_count} תוצאות</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={buildSearchUrl(search)}>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <ExternalLink className="h-4 w-4" />
                          חפש שוב
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteSearch(search.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentSearches;
