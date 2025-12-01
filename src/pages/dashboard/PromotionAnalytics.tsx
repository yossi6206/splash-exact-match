import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, Zap, Eye, MousePointer, Calendar, Loader2, Car, Home, Laptop, Briefcase, Package, Users, Building2, CheckCircle2, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface PromotedAd {
  id: string;
  title: string;
  category: string;
  promotionStartDate: string;
  promotionEndDate: string;
  promotionImpressions: number;
  views: number;
  clicks: number;
  contacts: number;
  daysRemaining: number;
  isActive: boolean;
}

interface TimeSeriesData {
  date: string;
  impressions: number;
  clicks: number;
  contacts: number;
}

const COLORS = {
  primary: '#10b981',
  secondary: '#3b82f6',
  accent: '#8b5cf6',
  warning: '#f59e0b',
  danger: '#ef4444'
};

const PromotionAnalytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [promotedAds, setPromotedAds] = useState<PromotedAd[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [totalImpressions, setTotalImpressions] = useState(0);
  const [avgDailyImpressions, setAvgDailyImpressions] = useState(0);
  const [totalROI, setTotalROI] = useState(0);
  const [activePromotions, setActivePromotions] = useState(0);

  useEffect(() => {
    if (user) {
      fetchPromotionAnalytics();
      
      // Auto-refresh every 10 seconds
      const interval = setInterval(() => {
        fetchPromotionAnalytics();
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [user, selectedCategory]);

  const fetchPromotionAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch all promoted ads from different tables
      const tables = [
        { name: 'cars', titleField: ['manufacturer', 'model'], category: 'רכבים' },
        { name: 'properties', titleField: ['title'], category: 'נדל״ן' },
        { name: 'laptops', titleField: ['brand', 'model'], category: 'מחשבים' },
        { name: 'jobs', titleField: ['title'], category: 'משרות' },
        { name: 'secondhand_items', titleField: ['title'], category: 'יד שנייה' },
        { name: 'businesses', titleField: ['title'], category: 'עסקים' },
        { name: 'freelancers', titleField: ['full_name', 'title'], category: 'פרילנסרים' }
      ];

      let allPromotedAds: PromotedAd[] = [];

      for (const table of tables) {
        if (selectedCategory !== "all" && table.category !== selectedCategory) {
          continue;
        }

        const { data } = await supabase
          .from(table.name as any)
          .select('*')
          .eq('user_id', user?.id)
          .eq('is_promoted', true);

        if (data) {
          const ads = data.map((item: any) => {
            const title = Array.isArray(table.titleField) 
              ? table.titleField.map(field => item[field]).filter(Boolean).join(' ')
              : item[table.titleField[0]];
            const endDate = new Date(item.promotion_end_date);
            const daysRemaining = Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return {
              id: item.id,
              title: title || 'ללא כותרת',
              category: table.category,
              promotionStartDate: item.promotion_start_date,
              promotionEndDate: item.promotion_end_date,
              promotionImpressions: item.promotion_impressions || 0,
              views: item.views_count || 0,
              clicks: item.clicks_count || 0,
              contacts: item.contacts_count || 0,
              daysRemaining,
              isActive: daysRemaining > 0
            };
          });
          allPromotedAds = [...allPromotedAds, ...ads];
        }
      }

      // Sort by promotion start date
      allPromotedAds.sort((a, b) => 
        new Date(b.promotionStartDate).getTime() - new Date(a.promotionStartDate).getTime()
      );

      setPromotedAds(allPromotedAds);

      // Calculate statistics
      const totalImp = allPromotedAds.reduce((sum, ad) => sum + ad.promotionImpressions, 0);
      const activeAds = allPromotedAds.filter(ad => ad.isActive);
      const totalContacts = allPromotedAds.reduce((sum, ad) => sum + ad.contacts, 0);
      
      setTotalImpressions(totalImp);
      setActivePromotions(activeAds.length);
      setAvgDailyImpressions(activeAds.length > 0 ? Math.round(totalImp / activeAds.length) : 0);
      setTotalROI(totalImp > 0 ? ((totalContacts / totalImp) * 100) : 0);

      // Generate time series data for the last 30 days
      const timeData: TimeSeriesData[] = [];
      const today = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Calculate impressions for this date (simulated based on promotion periods)
        let impressions = 0;
        let clicks = 0;
        let contacts = 0;

        allPromotedAds.forEach(ad => {
          const startDate = new Date(ad.promotionStartDate);
          const endDate = new Date(ad.promotionEndDate);
          
          if (date >= startDate && date <= endDate) {
            const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            impressions += Math.round(ad.promotionImpressions / totalDays);
            clicks += Math.round(ad.clicks / totalDays);
            contacts += Math.round(ad.contacts / totalDays);
          }
        });

        timeData.push({
          date: date.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' }),
          impressions,
          clicks,
          contacts
        });
      }

      setTimeSeriesData(timeData);

    } catch (error) {
      console.error("Error fetching promotion analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "רכבים": return <Car className="h-4 w-4" />;
      case "נדל״ן": return <Home className="h-4 w-4" />;
      case "מחשבים": return <Laptop className="h-4 w-4" />;
      case "משרות": return <Briefcase className="h-4 w-4" />;
      case "יד שנייה": return <Package className="h-4 w-4" />;
      case "עסקים": return <Building2 className="h-4 w-4" />;
      case "פרילנסרים": return <Users className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (daysRemaining: number) => {
    if (daysRemaining > 7) {
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">פעיל - {daysRemaining} ימים</Badge>;
    } else if (daysRemaining > 0) {
      return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">מסתיים בקרוב - {daysRemaining} ימים</Badge>;
    } else {
      return <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20">הסתיים</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">ניתוח קידום מתקדם</h1>
          <p className="text-muted-foreground">מעקב והשוואה בין המודעות המקודמות שלך - מתעדכן אוטומטית כל 10 שניות</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fetchPromotionAnalytics()}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            רענן
          </Button>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="כל הקטגוריות" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הקטגוריות</SelectItem>
              <SelectItem value="רכבים">רכבים</SelectItem>
              <SelectItem value="נדל״ן">נדל״ן</SelectItem>
              <SelectItem value="מחשבים">מחשבים</SelectItem>
              <SelectItem value="משרות">משרות</SelectItem>
              <SelectItem value="יד שנייה">יד שנייה</SelectItem>
              <SelectItem value="עסקים">עסקים</SelectItem>
              <SelectItem value="פרילנסרים">פרילנסרים</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              סה״כ הצגות קידום
            </CardTitle>
            <Zap className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalImpressions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">מכל המודעות המקודמות</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              קידומים פעילים
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{activePromotions}</div>
            <p className="text-xs text-muted-foreground mt-1">מודעות פעילות כרגע</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ממוצע יומי
            </CardTitle>
            <Calendar className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{avgDailyImpressions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">הצגות ליום למודעה</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ROI קידום
            </CardTitle>
            <CheckCircle2 className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalROI.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground mt-1">המרה מהצגות ליצירות קשר</p>
          </CardContent>
        </Card>
      </div>

      {/* Time Series Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            מגמות קידום לאורך זמן (30 ימים אחרונים)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="impressions" 
                stroke={COLORS.primary} 
                fillOpacity={1}
                fill="url(#colorImpressions)"
                name="הצגות"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="clicks" 
                stroke={COLORS.secondary} 
                fillOpacity={1}
                fill="url(#colorClicks)"
                name="קליקים"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="contacts" 
                stroke={COLORS.accent} 
                fillOpacity={1}
                fill="url(#colorContacts)"
                name="פניות"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            השוואת ביצועים בין מודעות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={promotedAds.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="title" 
                stroke="#6b7280"
                style={{ fontSize: '11px' }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend />
              <Bar dataKey="promotionImpressions" fill={COLORS.primary} name="הצגות קידום" radius={[8, 8, 0, 0]} />
              <Bar dataKey="clicks" fill={COLORS.secondary} name="קליקים" radius={[8, 8, 0, 0]} />
              <Bar dataKey="contacts" fill={COLORS.accent} name="פניות" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>פירוט מודעות מקודמות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">מודעה</TableHead>
                  <TableHead className="text-right">קטגוריה</TableHead>
                  <TableHead className="text-right">סטטוס</TableHead>
                  <TableHead className="text-right">הצגות קידום</TableHead>
                  <TableHead className="text-right">צפיות</TableHead>
                  <TableHead className="text-right">קליקים</TableHead>
                  <TableHead className="text-right">פניות</TableHead>
                  <TableHead className="text-right">המרה</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotedAds.map((ad) => (
                  <TableRow key={ad.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{ad.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(ad.category)}
                        <span>{ad.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(ad.daysRemaining)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-green-600" />
                        <span className="font-bold">{ad.promotionImpressions.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>{ad.views.toLocaleString()}</TableCell>
                    <TableCell>{ad.clicks.toLocaleString()}</TableCell>
                    <TableCell>{ad.contacts.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-primary/5">
                        {ad.promotionImpressions > 0 
                          ? ((ad.contacts / ad.promotionImpressions) * 100).toFixed(2)
                          : '0.00'}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {promotedAds.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      אין מודעות מקודמות להצגה
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromotionAnalytics;
