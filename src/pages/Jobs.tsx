import { useState } from "react";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import { JobFilters } from "@/components/JobFilters";
import { JobCard } from "@/components/JobCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Briefcase } from "lucide-react";

const mockJobs = [
  {
    id: 1,
    company: "טכנולוגיות עתיד בע״מ",
    title: "מפתח.ת Full Stack",
    location: "תל אביב",
    type: "משרה מלאה",
    scope: "היברידי",
    salary: "₪20,000-30,000",
    experience: "3-5 שנות ניסיון",
    postedDate: "לפני יומיים",
    requirements: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
  },
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
    requirements: ["Google Ads", "Facebook Ads", "SEO", "Analytics", "קופירייטינג"],
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
    requirements: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
  },
  {
    id: 4,
    company: "קבוצת טק אינטרנשיונל",
    title: "מהנדס.ת DevOps",
    location: "תל אביב",
    type: "משרה מלאה",
    scope: "היברידי",
    salary: "₪25,000-35,000",
    experience: "4-6 שנות ניסיון",
    postedDate: "לפני יום",
    requirements: ["Docker", "Kubernetes", "CI/CD", "AWS", "Jenkins"],
  },
  {
    id: 5,
    company: "חברת ייעוץ עסקי",
    title: "יועץ.ת עסקי בכיר.ה",
    location: "רמת גן",
    type: "משרה מלאה",
    scope: "במשרד",
    salary: "₪22,000-32,000",
    experience: "5+ שנות ניסיון",
    postedDate: "לפני 4 ימים",
    requirements: ["ניהול פרויקטים", "ניתוח נתונים", "Excel", "PowerPoint", "אנגלית"],
  },
  {
    id: 6,
    company: "אפליקציות מובייל בע״מ",
    title: "מפתח.ת React Native",
    location: "הרצליה",
    type: "פרילנס",
    scope: "עבודה מרחוק",
    salary: "₪18,000-28,000",
    experience: "2-4 שנות ניסיון",
    postedDate: "לפני 5 ימים",
    requirements: ["React Native", "JavaScript", "Redux", "API", "Git"],
  },
];

const Jobs = () => {
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(mockJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = mockJobs.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header />
      
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                מצא את העבודה החלומית שלך
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                אלפי משרות מובילות ממיטב החברות בישראל
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center bg-white rounded-full shadow-2xl overflow-hidden">
                <Search className="absolute right-4 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="תפקיד, חברה או מילות מפתח..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 pr-12 pl-4 h-14 text-lg rounded-full focus-visible:ring-0"
                />
                <Button
                  className="ml-2 rounded-full px-8 h-10 font-bold"
                  size="lg"
                >
                  חפש
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">12,456+</div>
                <div className="text-sm text-white/80">משרות פעילות</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">3,200+</div>
                <div className="text-sm text-white/80">חברות מובילות</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">89%</div>
                <div className="text-sm text-white/80">שיעור השמה</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-6">
        {/* Category Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium whitespace-nowrap border-b-4 border-primary">
            כל המשרות
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            היי-טק
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            שיווק
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            מכירות
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            פיננסים
          </button>
          <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium whitespace-nowrap hover:bg-muted/80">
            ניהול
          </button>
        </div>

        {/* Filters */}
        <JobFilters />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6 mt-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-primary" />
              משרות פתוחות
            </h2>
            <p className="text-muted-foreground">{mockJobs.length} תוצאות</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">מיון לפי</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">תאריך פרסום</SelectItem>
                  <SelectItem value="salary-high">שכר גבוה-נמוך</SelectItem>
                  <SelectItem value="salary-low">שכר נמוך-גבוה</SelectItem>
                  <SelectItem value="relevance">רלוונטיות</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Job Cards */}
        <div className="space-y-4 mb-8">
          {currentJobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Jobs;
