import { useState } from "react";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";

const topFreelancers = [
  {
    id: 1,
    name: "שרה כהן",
    title: "מעצבת UI/UX בכירה",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    rating: 4.9,
    reviews: 127,
    completed: 156,
    hourlyRate: "350-500",
    location: "תל אביב",
    verified: true,
    level: "מומחית",
    skills: ["Figma", "Adobe XD", "UI Design", "UX Research"],
    responseTime: "תוך שעה",
    description: "מעצבת עם ניסיון של 8 שנים בעיצוב ממשקי משתמש"
  },
  {
    id: 2,
    name: "דוד לוי",
    title: "מפתח Full Stack",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    rating: 5.0,
    reviews: 93,
    completed: 112,
    hourlyRate: "400-600",
    location: "ירושלים",
    verified: true,
    level: "מומחה",
    skills: ["React", "Node.js", "TypeScript", "MongoDB"],
    responseTime: "תוך 2 שעות",
    description: "מפתח עם התמחות בפתרונות web מתקדמים"
  },
  {
    id: 3,
    name: "מיכל אברהם",
    title: "יועצת שיווק דיגיטלי",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    rating: 4.8,
    reviews: 84,
    completed: 98,
    hourlyRate: "300-450",
    location: "חיפה",
    verified: true,
    level: "מומחית",
    skills: ["Google Ads", "Facebook Ads", "SEO", "Analytics"],
    responseTime: "תוך 3 שעות",
    description: "יועצת עם ניסיון בהקמת קמפיינים דיגיטליים"
  },
  {
    id: 4,
    name: "יוסי מזרחי",
    title: "כותב תוכן ומנוסח",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    rating: 4.9,
    reviews: 156,
    completed: 203,
    hourlyRate: "250-400",
    location: "רמת גן",
    verified: true,
    level: "מומחה",
    skills: ["כתיבה שיווקית", "SEO", "תוכן לרשתות", "עריכה"],
    responseTime: "תוך שעה",
    description: "כותב מנוסה המתמחה בתוכן שיווקי"
  },
  {
    id: 5,
    name: "רונית שפירא",
    title: "עורכת וידאו ואנימציה",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
    rating: 5.0,
    reviews: 67,
    completed: 89,
    hourlyRate: "350-550",
    location: "נתניה",
    verified: true,
    level: "מומחית",
    skills: ["Premiere Pro", "After Effects", "DaVinci", "Motion Graphics"],
    responseTime: "תוך 4 שעות",
    description: "עורכת מקצועית עם ניסיון בפרויקטים גדולים"
  },
  {
    id: 6,
    name: "אבי גולדשטיין",
    title: "מעצב גרפי בכיר",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    rating: 4.7,
    reviews: 102,
    completed: 134,
    hourlyRate: "280-420",
    location: "פתח תקווה",
    verified: true,
    level: "מומחה",
    skills: ["Photoshop", "Illustrator", "InDesign", "Branding"],
    responseTime: "תוך 2 שעות",
    description: "מעצב גרפי עם התמחות במיתוג"
  },
  {
    id: 7,
    name: "תמר לוין",
    title: "מתרגמת מקצועית",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    rating: 4.9,
    reviews: 145,
    completed: 267,
    hourlyRate: "200-350",
    location: "תל אביב",
    verified: true,
    level: "מומחית",
    skills: ["אנגלית", "צרפתית", "תרגום טכני", "תרגום שיווקי"],
    responseTime: "תוך שעה",
    description: "מתרגמת עם ניסיון בתרגום מסמכים טכניים"
  },
  {
    id: 8,
    name: "אלון רוזנברג",
    title: "יועץ עסקי בכיר",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
    rating: 5.0,
    reviews: 89,
    completed: 112,
    hourlyRate: "500-800",
    location: "רמת השרון",
    verified: true,
    level: "מומחה",
    skills: ["אסטרטגיה", "ניהול", "יעוץ עסקי", "הקמת חברות"],
    responseTime: "תוך 3 שעות",
    description: "יועץ עסקי עם ניסיון של 15 שנה"
  },
  {
    id: 9,
    name: "נועה פרידמן",
    title: "מומחית SEO",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    rating: 4.8,
    reviews: 78,
    completed: 94,
    hourlyRate: "300-500",
    location: "הרצליה",
    verified: true,
    level: "מומחית",
    skills: ["SEO", "Google Analytics", "תוכן", "קישורים"],
    responseTime: "תוך 2 שעות",
    description: "מומחית SEO עם ניסיון בקידום אתרים"
  },
  {
    id: 10,
    name: "גיא אשכנזי",
    title: "מפתח אפליקציות מובייל",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    rating: 4.9,
    reviews: 112,
    completed: 145,
    hourlyRate: "400-650",
    location: "חיפה",
    verified: true,
    level: "מומחה",
    skills: ["React Native", "Flutter", "iOS", "Android"],
    responseTime: "תוך שעה",
    description: "מפתח אפליקציות עם ניסיון בפלטפורמות מובייל"
  }
];

const Freelancers = () => {
  const [sortBy, setSortBy] = useState("rating");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(topFreelancers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFreelancers = topFreelancers.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Category Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium whitespace-nowrap border-b-4 border-primary">
            כל התחומים
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            פיתוח
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            עיצוב
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            שיווק
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            כתיבה
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            תרגום
          </button>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6 mt-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">פרילנסרים מקצועיים</h1>
            <p className="text-muted-foreground">{topFreelancers.length} תוצאות</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">מיון לפי</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">דירוג</SelectItem>
                  <SelectItem value="price-low">מחיר נמוך-גבוה</SelectItem>
                  <SelectItem value="price-high">מחיר גבוה-נמוך</SelectItem>
                  <SelectItem value="reviews">מספר ביקורות</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Freelancers List */}
        <div className="space-y-4 mb-8">
          {currentFreelancers.map((freelancer) => (
            <Card key={freelancer.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Avatar */}
                  <img
                    src={freelancer.avatar}
                    alt={freelancer.name}
                    className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                  />

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-foreground">{freelancer.name}</h3>
                          {freelancer.verified && (
                            <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0" />
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {freelancer.level}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{freelancer.title}</p>
                      </div>
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground mb-1">מחיר לשעה</div>
                        <div className="text-xl font-bold text-primary whitespace-nowrap">
                          ₪{freelancer.hourlyRate}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {freelancer.description}
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{freelancer.rating}</span>
                        <span className="text-muted-foreground">({freelancer.reviews} ביקורות)</span>
                      </div>
                      <div className="text-muted-foreground">
                        {freelancer.completed} פרויקטים הושלמו
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {freelancer.location}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        זמן תגובה: {freelancer.responseTime}
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {freelancer.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <Button asChild>
                        <Link to={`/freelancers/${freelancer.id}`}>צור קשר</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Freelancers;
