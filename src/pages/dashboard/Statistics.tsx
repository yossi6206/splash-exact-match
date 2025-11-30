import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Eye, MousePointer, Phone, TrendingUp, Car, Home, Laptop, Briefcase, Loader2, Calendar as CalendarIcon, Filter, X, Package, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCountUp } from "@/hooks/useCountUp";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AdStats {
  id: string;
  title: string;
  category: string;
  views: number;
  clicks: number;
  contacts: number;
  conversion: number;
  created_at: string;
}

interface CategoryStats {
  category: string;
  count: number;
  views: number;
  contacts: number;
}

interface TimeSeriesData {
  date: string;
  views: number;
  contacts: number;
  clicks: number;
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

const Statistics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalContacts, setTotalContacts] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [topAds, setTopAds] = useState<AdStats[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  
  // Filters
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dataType, setDataType] = useState<string>("all");

  const { count: viewsCount, elementRef: viewsRef } = useCountUp({ end: totalViews, duration: 2000, startOnView: false });
  const { count: clicksCount, elementRef: clicksRef } = useCountUp({ end: totalClicks, duration: 2000, startOnView: false });
  const { count: contactsCount, elementRef: contactsRef } = useCountUp({ end: totalContacts, duration: 2000, startOnView: false });

  useEffect(() => {
    if (user) {
      fetchStatistics();
    }
  }, [user, dateFrom, dateTo, selectedCategory, dataType]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // Fetch cars data
      const { data: cars } = await supabase
        .from("cars")
        .select("id, model, manufacturer, views_count, clicks_count, contacts_count, created_at")
        .eq("user_id", user?.id);

      // Fetch properties data
      const { data: properties } = await supabase
        .from("properties")
        .select("id, title, views_count, clicks_count, contacts_count, created_at")
        .eq("user_id", user?.id);

      // Fetch laptops data
      const { data: laptops } = await supabase
        .from("laptops")
        .select("id, model, brand, views_count, clicks_count, contacts_count, created_at")
        .eq("user_id", user?.id);

      // Fetch jobs data
      const { data: jobs } = await supabase
        .from("jobs")
        .select("id, title, views_count, clicks_count, contacts_count, created_at")
        .eq("user_id", user?.id);

      // Fetch secondhand items data
      const { data: secondhand } = await supabase
        .from("secondhand_items")
        .select("id, title, views_count, clicks_count, contacts_count, created_at")
        .eq("user_id", user?.id);

      // Fetch freelancers data
      const { data: freelancers } = await supabase
        .from("freelancers")
        .select("id, title, full_name, total_reviews, created_at")
        .eq("user_id", user?.id);

      console.log("Data fetched:", { 
        cars: cars?.length, 
        properties: properties?.length,
        laptops: laptops?.length,
        jobs: jobs?.length,
        secondhand: secondhand?.length,
        freelancers: freelancers?.length
      });

      // Process all ads and apply filters
      let allAds: AdStats[] = [
        ...(cars || []).map(c => ({
          id: c.id,
          title: `${c.manufacturer} ${c.model}`,
          category: "רכבים",
          views: c.views_count || 0,
          clicks: c.clicks_count || 0,
          contacts: c.contacts_count || 0,
          conversion: c.views_count ? ((c.contacts_count || 0) / c.views_count * 100) : 0,
          created_at: c.created_at
        })),
        ...(properties || []).map(p => ({
          id: p.id,
          title: p.title,
          category: "נדל״ן",
          views: p.views_count || 0,
          clicks: p.clicks_count || 0,
          contacts: p.contacts_count || 0,
          conversion: p.views_count ? ((p.contacts_count || 0) / p.views_count * 100) : 0,
          created_at: p.created_at
        })),
        ...(laptops || []).map(l => ({
          id: l.id,
          title: `${l.brand} ${l.model}`,
          category: "מחשבים",
          views: l.views_count || 0,
          clicks: l.clicks_count || 0,
          contacts: l.contacts_count || 0,
          conversion: l.views_count ? ((l.contacts_count || 0) / l.views_count * 100) : 0,
          created_at: l.created_at
        })),
        ...(jobs || []).map(j => ({
          id: j.id,
          title: j.title,
          category: "משרות",
          views: j.views_count || 0,
          clicks: j.clicks_count || 0,
          contacts: j.contacts_count || 0,
          conversion: j.views_count ? ((j.contacts_count || 0) / j.views_count * 100) : 0,
          created_at: j.created_at
        })),
        ...(secondhand || []).map(s => ({
          id: s.id,
          title: s.title,
          category: "יד שנייה",
          views: s.views_count || 0,
          clicks: s.clicks_count || 0,
          contacts: s.contacts_count || 0,
          conversion: s.views_count ? ((s.contacts_count || 0) / s.views_count * 100) : 0,
          created_at: s.created_at
        })),
        ...(freelancers || []).map(f => ({
          id: f.id,
          title: `${f.full_name} - ${f.title}`,
          category: "פרילנסרים",
          views: 0,
          clicks: 0,
          contacts: f.total_reviews || 0,
          conversion: 0,
          created_at: f.created_at
        }))
      ];

      // Apply date filters
      if (dateFrom) {
        allAds = allAds.filter(ad => new Date(ad.created_at) >= dateFrom);
      }
      if (dateTo) {
        allAds = allAds.filter(ad => new Date(ad.created_at) <= dateTo);
      }

      // Apply category filter
      if (selectedCategory !== "all") {
        allAds = allAds.filter(ad => ad.category === selectedCategory);
      }

      // Calculate totals
      const views = allAds.reduce((sum, ad) => sum + ad.views, 0);
      const clicks = allAds.reduce((sum, ad) => sum + ad.clicks, 0);
      const contacts = allAds.reduce((sum, ad) => sum + ad.contacts, 0);
      
      console.log("Calculated totals:", { views, clicks, contacts, adsCount: allAds.length });
      
      setTotalViews(views);
      setTotalClicks(clicks);
      setTotalContacts(contacts);
      setConversionRate(views > 0 ? (contacts / views * 100) : 0);

      // Calculate category stats
      const categoryMap = new Map<string, CategoryStats>();
      allAds.forEach(ad => {
        const existing = categoryMap.get(ad.category) || {
          category: ad.category,
          count: 0,
          views: 0,
          contacts: 0
        };
        categoryMap.set(ad.category, {
          category: ad.category,
          count: existing.count + 1,
          views: existing.views + ad.views,
          contacts: existing.contacts + ad.contacts
        });
      });
      setCategoryStats(Array.from(categoryMap.values()));

      // Get top performing ads
      const sortedAds = [...allAds].sort((a, b) => b.views - a.views).slice(0, 10);
      setTopAds(sortedAds);

      // Generate time series data based on date range or last 30 days
      const startDate = dateFrom || (() => {
        const date = new Date();
        date.setDate(date.getDate() - 29);
        return date;
      })();
      const endDate = dateTo || new Date();
      
      const daysBetween = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      const dateRange = Array.from({ length: daysBetween }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        return date.toISOString().split('T')[0];
      });

      const timeData: TimeSeriesData[] = dateRange.map(date => {
        const dayAds = allAds.filter(ad => ad.created_at.startsWith(date));
        const views = dayAds.reduce((sum, ad) => sum + ad.views, 0);
        const contacts = dayAds.reduce((sum, ad) => sum + ad.contacts, 0);
        const clicks = dayAds.reduce((sum, ad) => sum + ad.clicks, 0);
        
        return {
          date: new Date(date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' }),
          views: dataType === "all" || dataType === "views" ? views : 0,
          contacts: dataType === "all" || dataType === "contacts" ? contacts : 0,
          clicks: dataType === "all" || dataType === "clicks" ? clicks : 0
        };
      });
      setTimeSeriesData(timeData);

    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "רכבים": return Car;
      case "נדל״ן": return Home;
      case "מחשבים": return Laptop;
      case "משרות": return Briefcase;
      case "יד שנייה": return Package;
      case "פרילנסרים": return Users;
      default: return Eye;
    }
  };

  const clearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setSelectedCategory("all");
    setDataType("all");
  };

  const hasActiveFilters = dateFrom || dateTo || selectedCategory !== "all" || dataType !== "all";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">סטטיסטיקות וביצועים</h1>
        <p className="text-muted-foreground">ניתוח מפורט של כל המודעות שלך</p>
      </div>

      {/* Filters Section */}
      <Card className="bg-gradient-to-br from-muted/30 to-muted/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <CardTitle>סינון נתונים</CardTitle>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
                <X className="h-4 w-4" />
                נקה סינון
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date From */}
            <div className="space-y-2">
              <label className="text-sm font-medium">מתאריך</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-right font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "בחר תאריך"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <label className="text-sm font-medium">עד תאריך</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-right font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "dd/MM/yyyy") : "בחר תאריך"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    disabled={(date) => date > new Date() || (dateFrom && date < dateFrom)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">קטגוריה</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="בחר קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הקטגוריות</SelectItem>
                  <SelectItem value="רכבים">רכבים</SelectItem>
                  <SelectItem value="נדל״ן">נדל״ן</SelectItem>
                  <SelectItem value="מחשבים">מחשבים</SelectItem>
                  <SelectItem value="משרות">משרות</SelectItem>
                  <SelectItem value="יד שנייה">יד שנייה</SelectItem>
                  <SelectItem value="פרילנסרים">פרילנסרים</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">סוג נתונים</label>
              <Select value={dataType} onValueChange={setDataType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="בחר סוג נתונים" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הנתונים</SelectItem>
                  <SelectItem value="views">צפיות בלבד</SelectItem>
                  <SelectItem value="clicks">לחיצות בלבד</SelectItem>
                  <SelectItem value="contacts">פניות בלבד</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">סינונים פעילים:</span>
              {dateFrom && (
                <Badge variant="secondary" className="gap-1">
                  מתאריך: {format(dateFrom, "dd/MM/yyyy")}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setDateFrom(undefined)} />
                </Badge>
              )}
              {dateTo && (
                <Badge variant="secondary" className="gap-1">
                  עד: {format(dateTo, "dd/MM/yyyy")}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setDateTo(undefined)} />
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {selectedCategory}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
                </Badge>
              )}
              {dataType !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {dataType === "views" ? "צפיות" : dataType === "clicks" ? "לחיצות" : "פניות"}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setDataType("all")} />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">סך צפיות</CardTitle>
            <Eye className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div ref={viewsRef} className="text-3xl font-bold text-foreground">{viewsCount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">סך לחיצות</CardTitle>
            <MousePointer className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div ref={clicksRef} className="text-3xl font-bold text-foreground">{clicksCount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950 dark:to-green-900/50 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">סך פניות</CardTitle>
            <Phone className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div ref={contactsRef} className="text-3xl font-bold text-foreground">{contactsCount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950 dark:to-orange-900/50 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">שיעור המרה</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{conversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">ביצועים לאורך זמן</TabsTrigger>
          <TabsTrigger value="categories">השוואה בין קטגוריות</TabsTrigger>
          <TabsTrigger value="distribution">התפלגות</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {dateFrom && dateTo 
                  ? `ביצועים מ-${format(dateFrom, "dd/MM/yyyy")} עד ${format(dateTo, "dd/MM/yyyy")}`
                  : "צפיות ופניות - 30 ימים אחרונים"
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {(dataType === "all" || dataType === "views") && (
                    <Line type="monotone" dataKey="views" stroke="#3b82f6" name="צפיות" strokeWidth={2} />
                  )}
                  {(dataType === "all" || dataType === "contacts") && (
                    <Line type="monotone" dataKey="contacts" stroke="#10b981" name="פניות" strokeWidth={2} />
                  )}
                  {(dataType === "all" || dataType === "clicks") && (
                    <Line type="monotone" dataKey="clicks" stroke="#8b5cf6" name="לחיצות" strokeWidth={2} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ביצועים לפי קטגוריה</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="#3b82f6" name="צפיות" />
                  <Bar dataKey="contacts" fill="#10b981" name="פניות" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>התפלגות מודעות לפי קטגוריה</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>סטטיסטיקות לפי קטגוריה</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryStats.map((stat, index) => {
                    const Icon = getCategoryIcon(stat.category);
                    return (
                      <div key={stat.category} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}
                          >
                            <Icon className="h-5 w-5" style={{ color: COLORS[index % COLORS.length] }} />
                          </div>
                          <div>
                            <div className="font-semibold">{stat.category}</div>
                            <div className="text-sm text-muted-foreground">{stat.count} מודעות</div>
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-sm text-muted-foreground">צפיות</div>
                          <div className="font-bold">{stat.views.toLocaleString()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Top Performing Ads Table */}
      <Card>
        <CardHeader>
          <CardTitle>המודעות המובילות</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">כותרת</TableHead>
                <TableHead className="text-right">קטגוריה</TableHead>
                <TableHead className="text-right">צפיות</TableHead>
                <TableHead className="text-right">לחיצות</TableHead>
                <TableHead className="text-right">פניות</TableHead>
                <TableHead className="text-right">המרה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topAds.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">{ad.title}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                      {ad.category}
                    </span>
                  </TableCell>
                  <TableCell>{ad.views.toLocaleString()}</TableCell>
                  <TableCell>{ad.clicks.toLocaleString()}</TableCell>
                  <TableCell>{ad.contacts.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${ad.conversion > 5 ? 'text-green-600' : ad.conversion > 2 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                      {ad.conversion.toFixed(1)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
