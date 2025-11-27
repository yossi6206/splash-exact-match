import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Heart, Eye, Clock } from "lucide-react";

const Dashboard = () => {
  const stats = [
    { title: "מודעות פעילות", value: "12", icon: BarChart3, color: "text-primary" },
    { title: "צפיות כולל", value: "1,234", icon: Eye, color: "text-secondary" },
    { title: "מודעות שמורות", value: "8", icon: Heart, color: "text-accent" },
    { title: "ימים פעילים", value: "45", icon: Clock, color: "text-primary" },
  ];

  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      <DashboardSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">סקירה כללית</h1>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
      </main>
    </div>
  );
};

export default Dashboard;
