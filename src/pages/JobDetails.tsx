import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Users,
  Calendar,
  Heart,
  CheckCircle2,
  FileText,
  Upload,
  ArrowRight,
  Shield,
  Eye,
  FileCheck,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import SimilarListings from "@/components/SimilarListings";
import { ReportListingDialog } from "@/components/ReportListingDialog";
import { ShareMenu } from "@/components/ShareMenu";
import { z } from "zod";


const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "שם מלא חייב להכיל לפחות 2 תווים").max(100, "שם מלא ארוך מדי"),
  email: z.string().trim().email("כתובת אימייל לא תקינה").max(255, "כתובת אימייל ארוכה מדי"),
  phone: z.string().trim().regex(/^[0-9\-+() ]{7,20}$/, "מספר טלפון לא תקין"),
  linkedIn: z.string().trim().url("כתובת LinkedIn לא תקינה").optional().or(z.literal("")),
  portfolio: z.string().trim().url("כתובת אתר פורטפוליו לא תקינה").optional().or(z.literal("")),
  coverLetter: z.string().trim().min(10, "מכתב נלווה חייב להכיל לפחות 10 תווים").max(5000, "מכתב נלווה ארוך מדי"),
});

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedIn: "",
    portfolio: "",
    coverLetter: "",
    resume: null as File | null,
  });

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      
      if (data) {
        // Update views count
        await supabase
          .from("jobs")
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq("id", id);
        
        setJobData(data);
      }
    } catch (error: any) {
      console.error("Error fetching job:", error);
      toast.error("שגיאה בטעינת המשרה");
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "היום";
    if (diffDays === 1) return "אתמול";
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
    if (diffDays < 30) return `לפני ${Math.floor(diffDays / 7)} שבועות`;
    return `לפני ${Math.floor(diffDays / 30)} חודשים`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        resume: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("עליך להתחבר כדי להגיש מועמדות");
      return;
    }

    if (!jobData) return;

    // Validate form data
    try {
      applicationSchema.parse({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        linkedIn: formData.linkedIn,
        portfolio: formData.portfolio,
        coverLetter: formData.coverLetter,
      });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        toast.error(validationError.errors[0].message);
        return;
      }
    }

    try {
      const { error } = await supabase.from("job_applications").insert({
        job_id: jobData.id,
        applicant_id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        linkedin_url: formData.linkedIn || null,
        portfolio_url: formData.portfolio || null,
        resume_url: null, // TODO: Implement file upload to storage
        cover_letter: formData.coverLetter,
        status: "pending",
      });

      if (error) throw error;

      // Update applicants count
      await supabase
        .from("jobs")
        .update({ applicants_count: (jobData.applicants_count || 0) + 1 })
        .eq("id", jobData.id);

      toast.success("המועמדות שלך נשלחה בהצלחה! ניצור איתך קשר בקרוב.");
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        linkedIn: "",
        portfolio: "",
        coverLetter: "",
        resume: null,
      });
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error("שגיאה בשליחת המועמדות: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">טוען...</div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader />
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">משרה לא נמצאה</h1>
          <Button asChild>
            <Link to="/jobs">חזרה לדף המשרות</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const formatSalary = () => {
    if (jobData.salary_min && jobData.salary_max) {
      return `₪${jobData.salary_min.toLocaleString()}-${jobData.salary_max.toLocaleString()}`;
    }
    return null;
  };

  const formatExperience = () => {
    if (jobData.experience_min && jobData.experience_max) {
      return `${jobData.experience_min}-${jobData.experience_max} שנות ניסיון`;
    }
    return "לא צוין";
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">
            בית
          </Link>
          <ArrowRight className="w-4 h-4 rotate-180" />
          <Link to="/jobs" className="hover:text-primary">
            דרושים
          </Link>
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span className="text-foreground">{jobData.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {jobData.title}
                    </h1>
                    <Link
                      to={`/company/${id}`}
                      className="text-lg font-medium text-primary hover:underline flex items-center gap-2"
                    >
                      <Building2 className="w-5 h-5" />
                      {jobData.company_name}
                    </Link>
                  </div>
                </div>
                <div className="flex gap-2">
                  <ShareMenu 
                    title={jobData.title}
                    variant="outline"
                  />
                  <Button size="icon" variant="outline">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <ReportListingDialog itemId={id!} itemType="job" />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="secondary" className="flex items-center gap-1 text-sm">
                  <MapPin className="w-4 h-4" />
                  {jobData.location}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1 text-sm">
                  <Briefcase className="w-4 h-4" />
                  {jobData.job_type}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1 text-sm">
                  <Clock className="w-4 h-4" />
                  {jobData.scope}
                </Badge>
                {formatSalary() && (
                  <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 text-sm">
                    <DollarSign className="w-4 h-4 ml-1" />
                    {formatSalary()}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {getTimeAgo(jobData.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {jobData.applicants_count || 0} מועמדים
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {formatExperience()}
                </span>
              </div>
            </Card>

            {/* Job Description */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">תיאור המשרה</h2>
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="whitespace-pre-line leading-relaxed">{jobData.description}</p>
              </div>
            </Card>

            {/* Requirements */}
            {jobData.requirements && jobData.requirements.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">דרישות התפקיד</h2>
                <ul className="space-y-3">
                  {jobData.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{req}</span>
                    </li>
                  ))}
                </ul>

                {jobData.nice_to_have && jobData.nice_to_have.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <h3 className="text-xl font-bold text-foreground mb-4">יתרון משמעותי</h3>
                    <ul className="space-y-3">
                      {jobData.nice_to_have.map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Card>
            )}

            {/* Benefits */}
            {jobData.benefits && jobData.benefits.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">מה אנחנו מציעים</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {jobData.benefits.map((benefit: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Application Process */}
            {jobData.application_process && jobData.application_process.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">תהליך הגיוס</h2>
                <div className="space-y-6">
                  {jobData.application_process.map((step: string, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        {index < jobData.application_process.length - 1 && (
                          <div className="w-0.5 h-12 bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <p className="text-sm text-foreground">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Application Form */}
            <Card className="p-6" id="apply">
              <h2 className="text-2xl font-bold text-foreground mb-6">הגש מועמדות</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">שם מלא *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="הכנס שם מלא"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">דוא"ל *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">טלפון *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="050-1234567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedIn">פרופיל LinkedIn</Label>
                    <Input
                      id="linkedIn"
                      name="linkedIn"
                      value={formData.linkedIn}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourname"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio">אתר אישי / פורטפוליו</Label>
                  <Input
                    id="portfolio"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    placeholder="https://yourportfolio.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume">קורות חיים *</Label>
                  <div className="relative">
                    <Input
                      id="resume"
                      name="resume"
                      type="file"
                      onChange={handleFileChange}
                      required
                      accept=".pdf,.doc,.docx"
                      className="cursor-pointer"
                    />
                    <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC או DOCX - עד 5MB
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverLetter">מכתב מקדים *</Label>
                  <Textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="ספר.י לנו קצת על עצמך ולמה אתה.ה מתאימ.ה לתפקיד הזה..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full rounded-full">
                  <FileText className="w-5 h-5 ml-2" />
                  שלח מועמדות
                </Button>
              </form>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Apply CTA */}
            <Card className="p-6 sticky top-6">
              <h3 className="text-xl font-bold text-foreground mb-4">
                התעניינת במשרה?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                הגש מועמדות עכשיו וצוות הגיוס שלנו ייצור איתך קשר בהקדם
              </p>
              <Button asChild size="lg" className="w-full rounded-full mb-3">
                <a href="#apply">
                  הגש מועמדות עכשיו
                </a>
              </Button>
              <Button variant="outline" size="lg" className="w-full rounded-full">
                <Heart className="w-5 h-5 ml-2" />
                שמור למועדפים
              </Button>
            </Card>

            {/* Company Info */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">על החברה</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {jobData.company_name}
                    </div>
                    {jobData.industry && (
                      <div className="text-xs text-muted-foreground">
                        {jobData.industry}
                      </div>
                    )}
                  </div>
                </div>
                {jobData.company_size && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <div className="text-sm text-foreground">{jobData.company_size}</div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div className="text-sm text-foreground">{jobData.location}</div>
                </div>
              </div>
              <Separator className="my-4" />
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/company/${id}`}>עוד משרות בחברה</Link>
              </Button>
            </Card>

            {/* Safety Tips */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4 text-right">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">טיפים לעסקה בטוחה</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-background flex items-center justify-center">
                      <Users className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-foreground/80 text-right leading-relaxed">וודאו את אמינות המעסיק</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-background flex items-center justify-center">
                      <Eye className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-foreground/80 text-right leading-relaxed">קראו היטב את תנאי המשרה</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-background flex items-center justify-center">
                      <AlertCircle className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-foreground/80 text-right leading-relaxed">היזהרו מהצעות מפוקפקות</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-background flex items-center justify-center">
                      <FileCheck className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-foreground/80 text-right leading-relaxed">דרשו חוזה עבודה מפורט</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>

        {/* Similar Jobs - Using SimilarListings component */}
        <section className="mt-12">
          <SimilarListings 
            itemType="job"
            currentItemId={id!}
            location={jobData.location}
            jobType={jobData.job_type}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default JobDetails;
