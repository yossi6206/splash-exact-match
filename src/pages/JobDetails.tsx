import { useState } from "react";
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
import { JobCard } from "@/components/JobCard";
import {
  Building2,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Users,
  Calendar,
  Share2,
  Heart,
  CheckCircle2,
  FileText,
  Upload,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

// Mock data - בפרויקט אמיתי יגיע מה-API
const jobData = {
  id: 1,
  company: "טכנולוגיות עתיד בע״מ",
  companySize: "200-500 עובדים",
  industry: "טכנולוגיה",
  title: "מפתח.ת Full Stack",
  location: "תל אביב - היברידי",
  type: "משרה מלאה",
  scope: "היברידי",
  salary: "₪20,000-30,000",
  experience: "3-5 שנות ניסיון",
  postedDate: "לפני יומיים",
  applicants: "23 מועמדים",
  description: `אנחנו מחפשים מפתח.ת Full Stack מנוסה להצטרף לצוות הפיתוח שלנו.

התפקיד כולל עבודה על מערכות מורכבות בקנה מידה גדול, פיתוח פיצ'רים חדשים, ושיפור ביצועים. תעבדו בצוות דינמי עם טכנולוגיות מתקדמות ותשפיעו ישירות על מוצר המשמש אלפי לקוחות.

אנחנו מציעים סביבת עבודה מעולה, אפשרויות קידום, ומשכורת תחרותית.`,
  requirements: [
    "ניסיון של 3-5 שנים בפיתוח Full Stack",
    "שליטה מעולה ב-React ו-Node.js",
    "ניסיון עם TypeScript",
    "הבנה עמוקה של MongoDB או PostgreSQL",
    "ניסיון עם AWS או Azure",
    "יכולת עבודה בצוות",
    "אנגלית ברמה גבוהה",
  ],
  niceToHave: [
    "ניסיון עם Docker ו-Kubernetes",
    "ניסיון בעבודה עם GraphQL",
    "תואר ראשון במדעי המחשב או תחום קרוב",
    "ניסיון בהובלת פרויקטים",
  ],
  benefits: [
    "משכורת תחרותית + בונוסים",
    "אופציות למניות",
    "עבודה היברידית - 3 ימים בשבוע מהבית",
    "תקציב להשתלמויות וכנסים",
    "ביטוח בריאות פרטי",
    "ארוחות חמות במשרד",
    "מתנות לחגים ואירועים",
    "חדר כושר במשרד",
  ],
  process: [
    {
      step: 1,
      title: "הגשת קורות חיים",
      description: "שלחו לנו את קורות החיים ומכתב מקדים",
    },
    {
      step: 2,
      title: "שיחת טלפון ראשונית",
      description: "שיחה קצרה עם מנהל הגיוס (15-20 דקות)",
    },
    {
      step: 3,
      title: "מטלת בית טכנית",
      description: "מטלה קצרה שתיקח כ-2-3 שעות",
    },
    {
      step: 4,
      title: "ראיון טכני",
      description: "ראיון עם המפתחים הבכירים (60-90 דקות)",
    },
    {
      step: 5,
      title: "ראיון עם המנהל",
      description: "שיחה על התאמה תרבותית ואישית (45 דקות)",
    },
    {
      step: 6,
      title: "הצעת עבודה",
      description: "קבלת הצעה והתחלה תוך 2-4 שבועות",
    },
  ],
};

const similarJobs = [
  {
    id: 2,
    company: "חברת השקעות גלובל",
    title: "מנהל.ת שיווק דיגיטלי",
    location: "חיפה",
    type: "משרה מלאה",
    scope: "במשרד",
    salary: "₪18,000-25,000",
    experience: "2-4 שנות ניסיון",
    postedDate: "לפני 3 ימים",
    requirements: ["Google Ads", "Facebook Ads", "SEO"],
  },
  {
    id: 3,
    company: "סטארט-אפ איי-קומרס",
    title: "מעצב.ת UX/UI",
    location: "ירושלים",
    type: "משרה חלקית",
    scope: "עבודה מרחוק",
    salary: "₪15,000-22,000",
    experience: "1-3 שנות ניסיון",
    postedDate: "לפני שבוע",
    requirements: ["Figma", "Adobe XD", "Sketch"],
  },
];

const JobDetails = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedIn: "",
    portfolio: "",
    coverLetter: "",
    resume: null as File | null,
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("המועמדות שלך נשלחה בהצלחה! ניצור איתך קשר בקרוב.");
    // כאן נשלח את הנתונים לשרת
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
                      {jobData.company}
                    </Link>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline">
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <Button size="icon" variant="outline">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="secondary" className="flex items-center gap-1 text-sm">
                  <MapPin className="w-4 h-4" />
                  {jobData.location}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1 text-sm">
                  <Briefcase className="w-4 h-4" />
                  {jobData.type}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1 text-sm">
                  <Clock className="w-4 h-4" />
                  {jobData.scope}
                </Badge>
                <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 text-sm">
                  <DollarSign className="w-4 h-4 ml-1" />
                  {jobData.salary}
                </Badge>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {jobData.postedDate}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {jobData.applicants}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {jobData.experience}
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
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">דרישות התפקיד</h2>
              <ul className="space-y-3">
                {jobData.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{req}</span>
                  </li>
                ))}
              </ul>

              <Separator className="my-6" />

              <h3 className="text-xl font-bold text-foreground mb-4">יתרון משמעותי</h3>
              <ul className="space-y-3">
                {jobData.niceToHave.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Benefits */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">מה אנחנו מציעים</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {jobData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Application Process */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">תהליך הגיוס</h2>
              <div className="space-y-6">
                {jobData.process.map((step, index) => (
                  <div key={step.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      {index < jobData.process.length - 1 && (
                        <div className="w-0.5 h-12 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

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
                      {jobData.company}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {jobData.industry}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div className="text-sm text-foreground">{jobData.companySize}</div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div className="text-sm text-foreground">תל אביב, ישראל</div>
                </div>
              </div>
              <Separator className="my-4" />
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/company/${id}`}>עוד משרות בחברה</Link>
              </Button>
            </Card>
          </div>
        </div>

        {/* Similar Jobs */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">משרות דומות</h2>
          <div className="space-y-4">
            {similarJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default JobDetails;
