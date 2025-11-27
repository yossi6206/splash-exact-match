import { useState } from "react";
import { Search, Star, BadgeCheck, MapPin, Clock, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const categories = [
  { name: "UI/UX עיצוב", icon: "🎨", count: 245 },
  { name: "פיתוח אתרים", icon: "💻", count: 189 },
  { name: "כתיבת תוכן", icon: "✍️", count: 156 },
  { name: "שיווק דיגיטלי", icon: "📱", count: 203 },
  { name: "עריכת וידאו", icon: "🎬", count: 178 },
  { name: "תרגום", icon: "🌐", count: 134 },
  { name: "ייעוץ עסקי", icon: "💼", count: 167 },
  { name: "גרפיקה", icon: "🖼️", count: 221 },
];

const topFreelancers = [
  {
    id: 1,
    name: "שרה כהן",
    title: "מעצבת UI/UX בכירה",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    rating: 4.9,
    reviews: 127,
    completed: 156,
    hourlyRate: "₪350-500",
    location: "תל אביב",
    verified: true,
    level: "מומחית",
    skills: ["Figma", "Adobe XD", "UI Design", "UX Research"],
    responseTime: "תוך שעה",
    description: "מעצבת עם ניסיון של 8 שנים בעיצוב ממשקי משתמש מודרניים ואינטואיטיביים"
  },
  {
    id: 2,
    name: "דוד לוי",
    title: "מפתח Full Stack",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    rating: 5.0,
    reviews: 93,
    completed: 112,
    hourlyRate: "₪400-600",
    location: "ירושלים",
    verified: true,
    level: "מומחה",
    skills: ["React", "Node.js", "TypeScript", "MongoDB"],
    responseTime: "תוך 2 שעות",
    description: "מפתח עם התמחות בפתרונות web מתקדמים ואפליקציות SaaS"
  },
  {
    id: 3,
    name: "מיכל אברהם",
    title: "יועצת שיווק דיגיטלי",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    rating: 4.8,
    reviews: 84,
    completed: 98,
    hourlyRate: "₪300-450",
    location: "חיפה",
    verified: true,
    level: "מומחית",
    skills: ["Google Ads", "Facebook Ads", "SEO", "Analytics"],
    responseTime: "תוך 3 שעות",
    description: "יועצת עם ניסיון בהקמת קמפיינים דיגיטליים מניבים לעסקים קטנים ובינוניים"
  },
  {
    id: 4,
    name: "יוסי מזרחי",
    title: "כותב תוכן ומנוסח",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    rating: 4.9,
    reviews: 156,
    completed: 203,
    hourlyRate: "₪250-400",
    location: "רמת גן",
    verified: true,
    level: "מומחה",
    skills: ["כתיבה שיווקית", "SEO", "תוכן לרשתות", "עריכה"],
    responseTime: "תוך שעה",
    description: "כותב מנוסה המתמחה בתוכן שיווקי, מאמרים מקצועיים ותכנים לרשתות חברתיות"
  },
  {
    id: 5,
    name: "רונית שפירא",
    title: "עורכת וידאו ואנימציה",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
    rating: 5.0,
    reviews: 67,
    completed: 89,
    hourlyRate: "₪350-550",
    location: "נתניה",
    verified: true,
    level: "מומחית",
    skills: ["Premiere Pro", "After Effects", "DaVinci", "Motion Graphics"],
    responseTime: "תוך 4 שעות",
    description: "עורכת מקצועית עם ניסיון בפרויקטים גדולים, קמפיינים ממותגים וסרטונים תדמיתיים"
  },
  {
    id: 6,
    name: "אבי גולדשטיין",
    title: "מעצב גרפי בכיר",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    rating: 4.7,
    reviews: 102,
    completed: 134,
    hourlyRate: "₪280-420",
    location: "פתח תקווה",
    verified: true,
    level: "מומחה",
    skills: ["Photoshop", "Illustrator", "InDesign", "Branding"],
    responseTime: "תוך 2 שעות",
    description: "מעצב גרפי עם התמחות במיתוג, עיצוב לוגואים ומיצבי פרסום דיגיטליים"
  }
];

const Freelancers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-l from-[hsl(var(--gradient-hero-start))] to-[hsl(var(--gradient-hero-end))] py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <TrendingUp className="w-3 h-3 ml-1" />
              למעלה מ-1,000 פרילנסרים מקצועיים
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
              פלטפורמה מקצועית לחיבור
              <br />
              עם מיטב הפרילנסרים בישראל
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              מומחים מאומתים בכל תחום - עיצוב, פיתוח, שיווק, תוכן ועוד
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-xl p-2 flex gap-2 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="חפש שירות או מקצוע..."
                  className="pr-10 border-0 focus-visible:ring-0 bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                חיפוש
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5" />
                <span>פרילנסרים מאומתים</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>ביקורות אמיתיות</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>מענה מהיר</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">עיון לפי קטגוריה</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`p-4 rounded-lg border-2 transition-all hover:border-primary hover:shadow-md ${
                  selectedCategory === category.name
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="font-medium text-sm mb-1">{category.name}</div>
                <div className="text-xs text-muted-foreground">{category.count} מומחים</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Top Freelancers */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">פרילנסרים מובילים</h2>
            <Button variant="outline">צפה בכולם</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topFreelancers.map((freelancer) => (
              <Card key={freelancer.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex gap-4">
                    <img
                      src={freelancer.avatar}
                      alt={freelancer.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{freelancer.name}</CardTitle>
                        {freelancer.verified && (
                          <BadgeCheck className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <CardDescription className="text-sm mb-2">
                        {freelancer.title}
                      </CardDescription>
                      <Badge variant="secondary" className="text-xs">
                        {freelancer.level}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {freelancer.description}
                  </p>

                  {/* Stats */}
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{freelancer.rating}</span>
                      <span className="text-muted-foreground">({freelancer.reviews})</span>
                    </div>
                    <div className="text-muted-foreground">
                      {freelancer.completed} פרויקטים
                    </div>
                  </div>

                  {/* Location & Response Time */}
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {freelancer.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {freelancer.responseTime}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {freelancer.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="pt-4 border-t flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">מחיר לשעה</div>
                      <div className="text-lg font-bold text-primary">
                        {freelancer.hourlyRate}
                      </div>
                    </div>
                    <Button>צור קשר</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-l from-[hsl(var(--gradient-hero-start))] to-[hsl(var(--gradient-hero-end))]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            אתה פרילנסר מקצועי?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            הצטרף לפלטפורמה והתחל לקבל פרויקטים איכוטיים היום
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8">
            הצטרף כפרילנסר
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Freelancers;
