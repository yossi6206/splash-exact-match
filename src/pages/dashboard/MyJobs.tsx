import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Briefcase, Eye, Users, MoreVertical, Edit, Trash, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  job_type: string;
  scope: string;
  status: string;
  views_count: number;
  applicants_count: number;
  created_at: string;
}

const MyJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      console.error("Error fetching jobs:", error);
      toast.error("שגיאה בטעינת המשרות");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק משרה זו?")) return;

    try {
      const { error } = await supabase.from("jobs").delete().eq("id", jobId);

      if (error) throw error;

      toast.success("המשרה נמחקה בהצלחה");
      fetchJobs();
    } catch (error: any) {
      console.error("Error deleting job:", error);
      toast.error("שגיאה במחיקת המשרה");
    }
  };

  const toggleStatus = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      const { error } = await supabase
        .from("jobs")
        .update({ status: newStatus })
        .eq("id", jobId);

      if (error) throw error;

      toast.success(
        newStatus === "active" ? "המשרה הופעלה מחדש" : "המשרה הושהתה"
      );
      fetchJobs();
    } catch (error: any) {
      console.error("Error updating job status:", error);
      toast.error("שגיאה בעדכון סטטוס המשרה");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">טוען...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-primary" />
            המשרות שלי
          </h1>
          <p className="text-muted-foreground">
            ניהול ומעקב אחר המשרות שפרסמת
          </p>
        </div>
        <Button asChild className="rounded-full">
          <Link to="/dashboard/post-job">
            <Plus className="w-5 h-5 ml-2" />
            פרסם משרה חדשה
          </Link>
        </Button>
      </div>

      {jobs.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            אין לך משרות פעילות
          </h2>
          <p className="text-muted-foreground mb-6">
            התחל לפרסם משרות ומצא את העובדים המושלמים לחברה שלך
          </p>
          <Button asChild>
            <Link to="/dashboard/post-job">פרסם משרה ראשונה</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-xl font-bold text-foreground hover:text-primary transition-colors"
                    >
                      {job.title}
                    </Link>
                    <Badge
                      variant={job.status === "active" ? "default" : "secondary"}
                    >
                      {job.status === "active" ? "פעיל" : "מושהה"}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    {job.company_name} • {job.location} • {job.job_type} • {job.scope}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {job.views_count} צפיות
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {job.applicants_count} מועמדים
                    </span>
                    <span>
                      פורסם{" "}
                      {new Date(job.created_at).toLocaleDateString("he-IL")}
                    </span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/jobs/${job.id}`}>
                        <Eye className="w-4 h-4 ml-2" />
                        צפה במשרה
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/dashboard/edit-job/${job.id}`}>
                        <Edit className="w-4 h-4 ml-2" />
                        ערוך משרה
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toggleStatus(job.id, job.status)}
                    >
                      {job.status === "active" ? "השהה משרה" : "הפעל משרה"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(job.id)}
                      className="text-destructive"
                    >
                      <Trash className="w-4 h-4 ml-2" />
                      מחק משרה
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
