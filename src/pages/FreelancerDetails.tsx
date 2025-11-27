import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Star, 
  MapPin, 
  Clock, 
  Award, 
  Briefcase, 
  Calendar,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Freelancer = Tables<"freelancers">;

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  completedDate: string;
}

interface WorkExperience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
}

const FreelancerDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  // Demo data - in production, fetch from database
  const portfolioItems: PortfolioItem[] = [
    {
      id: "1",
      title: "מערכת CRM לניהול לקוחות",
      description: "פיתוח מערכת ניהול לקוחות מתקדמת עם ממשק משתמש אינטואיטיבי",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500",
      category: "פיתוח Web",
      completedDate: "מרץ 2024"
    },
    {
      id: "2",
      title: "אפליקציית מובייל לחנות אונליין",
      description: "אפליקציה נטיבית לאנדרואיד ו-iOS עם תשלומים מאובטחים",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500",
      category: "פיתוח Mobile",
      completedDate: "פברואר 2024"
    },
    {
      id: "3",
      title: "דשבורד ניתוח נתונים",
      description: "מערכת BI עם ויזואליזציות מתקדמות וניתוח בזמן אמת",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500",
      category: "Data Analytics",
      completedDate: "ינואר 2024"
    }
  ];

  const workHistory: WorkExperience[] = [
    {
      id: "1",
      role: "Senior Full Stack Developer",
      company: "Tech Corp Israel",
      duration: "2020 - 2023",
      description: "פיתוח ותחזוקה של מערכות enterprise מורכבות. ניהול צוות של 5 מפתחים."
    },
    {
      id: "2",
      role: "Lead Developer",
      company: "Startup Innovation",
      duration: "2018 - 2020",
      description: "הובלת פיתוח מוצר מ-0 ועד לשחרור. בניית ארכיטקטורה מבוססת microservices."
    },
    {
      id: "3",
      role: "Full Stack Developer",
      company: "Digital Solutions Ltd",
      duration: "2016 - 2018",
      description: "פיתוח אפליקציות web ומובייל למגוון לקוחות עסקיים."
    }
  ];

  useEffect(() => {
    fetchFreelancer();
  }, [id]);

  const fetchFreelancer = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("freelancers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setFreelancer(data);
    } catch (error) {
      console.error("Error fetching freelancer:", error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון את פרטי הפרילנסר",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "ההודעה נשלחה בהצלחה!",
      description: "הפרילנסר יחזור אליך בהקדם האפשרי"
    });
    setContactForm({ name: "", email: "", phone: "", message: "" });
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader />
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-muted rounded-lg" />
            <div className="h-96 bg-muted rounded-lg" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader />
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">פרילנסר לא נמצא</h1>
          <Button asChild>
            <Link to="/freelancers">חזרה לרשימת הפרילנסרים</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 border-b">
        <div className="container mx-auto px-4">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/freelancers">
              <ChevronRight className="w-4 h-4 ml-1" />
              חזרה לכל הפרילנסרים
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <Avatar className="w-32 h-32 ring-4 ring-primary/10">
              <AvatarImage src={freelancer.avatar_url || undefined} alt={freelancer.full_name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-3xl">
                {getInitials(freelancer.full_name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{freelancer.full_name}</h1>
              <p className="text-xl text-primary font-semibold mb-4">{freelancer.title}</p>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-bold">{freelancer.rating}</span>
                  <span className="text-muted-foreground">({freelancer.total_reviews} ביקורות)</span>
                </div>

                {freelancer.location && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-5 h-5" />
                    <span>{freelancer.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Briefcase className="w-5 h-5" />
                  <span>{freelancer.experience_years} שנות ניסיון</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <Badge variant="secondary" className="text-sm">
                  <Award className="w-4 h-4 mr-1" />
                  {freelancer.category}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {freelancer.availability === 'available' ? '✓ זמין לעבודה' : 'לא זמין כרגע'}
                </Badge>
              </div>

              {freelancer.bio && (
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {freelancer.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="gap-2">
                  <Mail className="w-5 h-5" />
                  צור קשר עכשיו
                </Button>
                {freelancer.portfolio_url && (
                  <Button variant="outline" size="lg" asChild className="gap-2">
                    <a href={freelancer.portfolio_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-5 h-5" />
                      אתר אישי
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <Card className="w-full md:w-64 shrink-0">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-foreground">₪{freelancer.hourly_rate}</div>
                  <div className="text-sm text-muted-foreground">לשעה</div>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>תגובה תוך 24 שעות</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>איכות מובטחת</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>תקשורת שוטפת</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  מיומנויות ותחומי התמחות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {freelancer.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            {freelancer.languages && freelancer.languages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    שפות
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {freelancer.languages.map((lang, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Portfolio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  פורטפוליו
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {portfolioItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg hover:border-primary/20 transition-colors">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.completedDate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Work History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  היסטוריית עבודה
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {workHistory.map((work, index) => (
                  <div key={work.id} className="relative">
                    {index !== workHistory.length - 1 && (
                      <div className="absolute right-2 top-8 bottom-0 w-px bg-border" />
                    )}
                    <div className="flex gap-4">
                      <div className="w-4 h-4 rounded-full bg-primary shrink-0 mt-1.5 relative z-10" />
                      <div className="flex-1 pb-6">
                        <h3 className="font-semibold text-lg">{work.role}</h3>
                        <p className="text-primary font-medium mb-1">{work.company}</p>
                        <p className="text-sm text-muted-foreground mb-2">{work.duration}</p>
                        <p className="text-sm">{work.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Contact Form Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>צור קשר</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">שם מלא</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                      placeholder="הכנס את שמך"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">אימייל</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">טלפון</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="050-1234567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">הודעה</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                      placeholder="ספר לי על הפרויקט שלך..."
                      rows={5}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    שלח הודעה
                    <ArrowRight className="w-4 h-4 mr-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FreelancerDetails;
