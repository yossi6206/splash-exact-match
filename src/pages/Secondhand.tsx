import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search, Package, Heart, TrendingUp, Shield, Clock } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const categories = [
  { id: "electronics", name: "אלקטרוניקה", icon: "📱", count: "2,450", color: "bg-blue-500/10 text-blue-600" },
  { id: "furniture", name: "ריהוט ועיצוב", icon: "🛋️", count: "1,890", color: "bg-purple-500/10 text-purple-600" },
  { id: "fashion", name: "אופנה וביגוד", icon: "👕", count: "3,200", color: "bg-pink-500/10 text-pink-600" },
  { id: "sports", name: "ספורט וחוצות", icon: "⚽", count: "980", color: "bg-green-500/10 text-green-600" },
  { id: "books", name: "ספרים ומדיה", icon: "📚", count: "1,560", color: "bg-orange-500/10 text-orange-600" },
  { id: "kids", name: "ילדים ותינוקות", icon: "🧸", count: "1,200", color: "bg-cyan-500/10 text-cyan-600" },
  { id: "tools", name: "כלי עבודה", icon: "🔧", count: "750", color: "bg-red-500/10 text-red-600" },
  { id: "other", name: "שונות", icon: "🎁", count: "2,100", color: "bg-gray-500/10 text-gray-600" },
];

const featuredItems = [
  {
    id: 1,
    title: "iPhone 13 Pro - 256GB",
    price: "2,800 ₪",
    image: "/placeholder.svg",
    condition: "במצב מצוין",
    location: "תל אביב",
    category: "אלקטרוניקה",
  },
  {
    id: 2,
    title: "ספה תלת מושבית",
    price: "1,200 ₪",
    image: "/placeholder.svg",
    condition: "כמו חדש",
    location: "חיפה",
    category: "ריהוט",
  },
  {
    id: 3,
    title: "אופני הרים Trek",
    price: "1,500 ₪",
    image: "/placeholder.svg",
    condition: "משומש",
    location: "ירושלים",
    category: "ספורט",
  },
  {
    id: 4,
    title: "MacBook Air M1",
    price: "3,200 ₪",
    image: "/placeholder.svg",
    condition: "במצב מצוין",
    location: "רמת גן",
    category: "אלקטרוניקה",
  },
  {
    id: 5,
    title: "עגלת תינוק Bugaboo",
    price: "800 ₪",
    image: "/placeholder.svg",
    condition: "כמו חדש",
    location: "פתח תקווה",
    category: "ילדים",
  },
  {
    id: 6,
    title: "מכונת אספרסו",
    price: "450 ₪",
    image: "/placeholder.svg",
    condition: "משומש",
    location: "נתניה",
    category: "שונות",
  },
];

const popularSearches = [
  { text: "מחשבים ניידים", icon: "💻", trend: "+12%" },
  { text: "רהיטי סלון", icon: "🛋️", trend: "+8%" },
  { text: "אייפון", icon: "📱", trend: "+15%" },
  { text: "אופניים", icon: "🚴", trend: "+5%" },
  { text: "שעונים", icon: "⌚", trend: "+10%" },
  { text: "בגדי ילדים", icon: "👶", trend: "+7%" },
];

const tips = [
  { icon: Shield, title: "בדוק היטב", desc: "בדוק את המוצר לפני הקניה" },
  { icon: Clock, title: "פגוש באזור ציבורי", desc: "היפגש במקומות ציבוריים" },
  { icon: TrendingUp, title: "השווה מחירים", desc: "בדוק מחירים באתרים שונים" },
  { icon: Heart, title: "תן משוב", desc: "עזור לקהילה עם חוות דעת" },
];

const Secondhand = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
                <Package className="w-4 h-4" />
                <span>יד שנייה - חסכו כסף וסביבה</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
                קנו ומכרו בקלות
                <span className="block text-primary mt-2">פריטים משומשים באיכות</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 animate-fade-in max-w-2xl mx-auto">
                אלפי מוצרים איכוטיים במחירים מעולים. מהמוכר ישירות אליכם.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto animate-scale-in">
                <div className="relative flex items-center bg-card border-2 border-border rounded-full shadow-lg hover:shadow-xl transition-shadow">
                  <input
                    type="text"
                    placeholder="מה אתם מחפשים? (למשל: אייפון, ספה, אופניים...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-6 py-4 bg-transparent text-foreground placeholder:text-muted-foreground rounded-r-full focus:outline-none"
                  />
                  <Button size="lg" className="rounded-full m-1 px-8">
                    <Search className="w-5 h-5 ml-2" />
                    חיפוש
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12 animate-fade-in">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">12,000+</div>
                  <div className="text-sm text-muted-foreground mt-1">מוצרים פעילים</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">5,000+</div>
                  <div className="text-sm text-muted-foreground mt-1">מוכרים פעילים</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground mt-1">שביעות רצון</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                קטגוריות פופולריות
              </h2>
              <p className="text-muted-foreground">מצאו בדיוק מה שאתם מחפשים</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/secondhand/${category.id}`}
                  className="group"
                >
                  <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover-scale cursor-pointer">
                    <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                      {category.icon}
                    </div>
                    <h3 className="text-center font-semibold text-foreground mb-1">
                      {category.name}
                    </h3>
                    <p className="text-center text-sm text-muted-foreground">
                      {category.count} פריטים
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Items */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  פריטים מומלצים
                </h2>
                <p className="text-muted-foreground">המוצרים הכי פופולריים השבוע</p>
              </div>
              <Button variant="outline" size="lg">
                צפו בהכל
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all hover-scale"
                >
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                        {item.condition}
                      </span>
                    </div>
                    <button className="absolute top-4 left-4 w-10 h-10 bg-background/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-background transition-colors">
                      <Heart className="w-5 h-5 text-foreground" />
                    </button>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        📍 {item.location}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        {item.price}
                      </span>
                      <Button size="sm" variant="secondary">
                        צפה בפרטים
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Searches */}
        <section className="py-16 bg-gradient-to-br from-muted/50 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                חיפושים פופולריים
              </h2>
              <p className="text-muted-foreground">מה אנשים מחפשים השבוע</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-all hover-scale group"
                >
                  <div className="text-4xl mb-2">{search.icon}</div>
                  <div className="font-medium text-foreground mb-1 text-sm">
                    {search.text}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    {search.trend}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Tips */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                טיפים לקנייה בטוחה
              </h2>
              <p className="text-muted-foreground">עצות חשובות למשתמשים</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all hover-scale"
                >
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <tip.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground">{tip.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" variant="outline" className="gap-2">
                <Shield className="w-5 h-5" />
                קראו עוד טיפים לקנייה בטוחה
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              מוכן להתחיל?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              הצטרפו לקהילה שלנו ותתחילו לקנות ולמכור פריטים משומשים עוד היום
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                <Package className="ml-2 w-5 h-5" />
                פרסמו מודעה
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-2 border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground">
                <Search className="ml-2 w-5 h-5" />
                חפשו מוצרים
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Secondhand;