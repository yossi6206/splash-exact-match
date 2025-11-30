import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Heart, Eye, Clock, Menu, Bell, MessageSquare, LayoutGrid, Edit3, Search, Lightbulb, Settings, LogOut, Phone, Briefcase, Plus, Car, Home, Laptop, Package, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NavLink } from "@/components/NavLink";
import { Link, Routes, Route } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PostJob from "./dashboard/PostJob";
import MyJobs from "./dashboard/MyJobs";
import PostCar from "./dashboard/PostCar";
import PostProperty from "./dashboard/PostProperty";
import PostLaptop from "./dashboard/PostLaptop";
import PostSecondhand from "./dashboard/PostSecondhand";
import PostBusiness from "./dashboard/PostBusiness";
import PostFreelancer from "./dashboard/PostFreelancer";
import MyAds from "./dashboard/MyAds";
import Statistics from "./dashboard/Statistics";
import PromoteAds from "./dashboard/PromoteAds";
import PromotionAnalytics from "./dashboard/PromotionAnalytics";

const Dashboard = () => {
  const stats = [
    { title: "מודעות פעילות", value: "12", icon: BarChart3, color: "text-primary" },
    { title: "צפיות כולל", value: "1,234", icon: Eye, color: "text-secondary" },
    { title: "מודעות שמורות", value: "8", icon: Heart, color: "text-accent" },
    { title: "ימים פעילים", value: "45", icon: Clock, color: "text-primary" },
  ];

  const menuItems = [
    { title: "המודעות שלי", icon: LayoutGrid, path: "/dashboard/ads" },
    { title: "המשרות שלי", icon: Briefcase, path: "/dashboard/my-jobs" },
    { title: "פרסם משרה", icon: Plus, path: "/dashboard/post-job" },
    { title: "פרסם רכב", icon: Plus, path: "/dashboard/post-car" },
    { title: "פרסם נדל״ן", icon: Plus, path: "/dashboard/post-property" },
    { title: "פרסם מחשב", icon: Plus, path: "/dashboard/post-laptop" },
    { title: "פרסם יד שנייה", icon: Plus, path: "/dashboard/post-secondhand" },
    { title: "פרסם עסק", icon: Plus, path: "/dashboard/post-business" },
    { title: "פרסם פרופיל פרילנסר", icon: Plus, path: "/dashboard/post-freelancer" },
    { title: "עדכון פרטים", icon: Edit3, path: "/dashboard/profile" },
    { title: "סטטיסטיקות", icon: BarChart3, path: "/dashboard/stats" },
    { title: "מודעות שמורות", icon: Heart, path: "/dashboard/saved" },
    { title: "חיפושים אחרונים", icon: Search, path: "/dashboard/searches" },
    { title: "טיפים ומידע", icon: Lightbulb, path: "/dashboard/tips" },
    { title: "הגדרות", icon: Settings, path: "/dashboard/settings" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 w-full bg-background border-b border-border safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] overflow-y-auto">
              <SheetHeader className="border-b pb-4 mb-4">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="w-16 h-16 ring-4 ring-primary/10">
                    <AvatarFallback className="bg-gradient-to-br from-primary/30 to-secondary/30 text-primary text-xl font-bold">
                      y
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-lg font-bold text-foreground">yossi cohen</h2>
                    <p className="text-xs text-muted-foreground">yossi6206@gmail.com</p>
                  </div>
                </div>
              </SheetHeader>
              
              <nav className="space-y-2 mb-6">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all text-right"
                    activeClassName="bg-primary/10 text-primary border-r-4 border-primary"
                  >
                    <span className="font-medium flex-1">{item.title}</span>
                    <item.icon className="h-5 w-5" />
                  </NavLink>
                ))}
              </nav>

              <div className="space-y-2 pt-4 border-t">
                <Button variant="outline" className="w-full justify-between border-border hover:bg-muted">
                  <span>צור קשר</span>
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between border-primary/30 text-primary hover:bg-primary/10">
                  <span>התנתקות</span>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center">
            <div className="flex h-10 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
              <span className="text-xl font-extrabold text-primary-foreground">
                yad2
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="min-h-screen flex w-full bg-slate-50">
        <DashboardSidebar />
        
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          <Routes>
            <Route path="/" element={
              <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-8">סקירה כללית</h1>
                
                {/* Quick Post Options */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">פרסם מודעה חדשה</h2>
                      <p className="text-muted-foreground">בחר את הקטגוריה המתאימה לפרסום שלך</p>
                    </div>
                  </div>

                  {/* למכירה */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-primary"></div>
                      למכירה
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Link to="/dashboard/post-car">
                        <Card className="p-5 hover:shadow-lg transition-all cursor-pointer group hover:border-primary/50 bg-white">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 group-hover:scale-110 transition-transform shrink-0">
                              <Car className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 text-right">
                              <h4 className="font-bold text-foreground mb-1">רכב למכירה</h4>
                              <p className="text-sm text-muted-foreground">פרסם רכב פרטי, מסחרי או אופנוע</p>
                            </div>
                          </div>
                        </Card>
                      </Link>

                      <Link to="/dashboard/post-property">
                        <Card className="p-5 hover:shadow-lg transition-all cursor-pointer group hover:border-primary/50 bg-white">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 group-hover:scale-110 transition-transform shrink-0">
                              <Home className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 text-right">
                              <h4 className="font-bold text-foreground mb-1">נדל״ן למכירה</h4>
                              <p className="text-sm text-muted-foreground">דירה, בית, קרקע או נכס מסחרי</p>
                            </div>
                          </div>
                        </Card>
                      </Link>

                      <Link to="/dashboard/post-business">
                        <Card className="p-5 hover:shadow-lg transition-all cursor-pointer group hover:border-primary/50 bg-white">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 group-hover:scale-110 transition-transform shrink-0">
                              <Building2 className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 text-right">
                              <h4 className="font-bold text-foreground mb-1">עסק למכירה</h4>
                              <p className="text-sm text-muted-foreground">מכור עסק פעיל עם נתונים פיננסיים</p>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </div>
                  </div>

                  {/* מוצרים */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-primary"></div>
                      מוצרים ומכשירים
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Link to="/dashboard/post-laptop">
                        <Card className="p-5 hover:shadow-lg transition-all cursor-pointer group hover:border-primary/50 bg-white">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 group-hover:scale-110 transition-transform shrink-0">
                              <Laptop className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 text-right">
                              <h4 className="font-bold text-foreground mb-1">מחשבים</h4>
                              <p className="text-sm text-muted-foreground">מחשב נייד, נייח, טאבלט או אביזרים</p>
                            </div>
                          </div>
                        </Card>
                      </Link>

                      <Link to="/dashboard/post-secondhand">
                        <Card className="p-5 hover:shadow-lg transition-all cursor-pointer group hover:border-primary/50 bg-white">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 group-hover:scale-110 transition-transform shrink-0">
                              <Package className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 text-right">
                              <h4 className="font-bold text-foreground mb-1">יד שנייה</h4>
                              <p className="text-sm text-muted-foreground">ריהוט, מוצרי חשמל, ספורט ועוד</p>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </div>
                  </div>

                  {/* משרות */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-primary"></div>
                      דרושים ומשרות
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Link to="/dashboard/post-job">
                        <Card className="p-5 hover:shadow-lg transition-all cursor-pointer group hover:border-primary/50 bg-white">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 group-hover:scale-110 transition-transform shrink-0">
                              <Briefcase className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 text-right">
                              <h4 className="font-bold text-foreground mb-1">פרסם משרה</h4>
                              <p className="text-sm text-muted-foreground">חפש עובדים, פרילנסרים או שותפים</p>
                            </div>
                          </div>
                        </Card>
                      </Link>
                      
                      <Link to="/dashboard/post-freelancer">
                        <Card className="p-5 hover:shadow-lg transition-all cursor-pointer group hover:border-primary/50 bg-white">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 group-hover:scale-110 transition-transform shrink-0">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 text-right">
                              <h4 className="font-bold text-foreground mb-1">פרסם פרופיל פרילנסר</h4>
                              <p className="text-sm text-muted-foreground">הצג את כישוריך וקבל הצעות עבודה</p>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                  {stats.map((stat) => (
                    <Card key={stat.title} className="bg-white border-border hover:shadow-md transition-all">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </CardTitle>
                        <stat.icon className={`h-5 w-5 ${stat.color} opacity-70`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recent Activity */}
                <Card className="bg-white border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">פעילות אחרונה</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <BarChart3 className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground">מודעה חדשה פורסמה</h3>
                            <p className="text-sm text-muted-foreground">לפני {item} שעות</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            } />
            <Route path="/ads" element={<MyAds />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/my-jobs" element={<MyJobs />} />
            <Route path="/post-car" element={<PostCar />} />
            <Route path="/post-property" element={<PostProperty />} />
            <Route path="/post-laptop" element={<PostLaptop />} />
            <Route path="/post-secondhand" element={<PostSecondhand />} />
            <Route path="/post-business" element={<PostBusiness />} />
            <Route path="/post-freelancer" element={<PostFreelancer />} />
            <Route path="/stats" element={<Statistics />} />
            <Route path="/promote" element={<PromoteAds />} />
            <Route path="/promotion-analytics" element={<PromotionAnalytics />} />
          </Routes>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
