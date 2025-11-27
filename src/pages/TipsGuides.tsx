import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import TipCard from "@/components/TipCard";
import tipSelling from "@/assets/tip-selling.jpg";
import tipBuying from "@/assets/tip-buying.jpg";
import tipSafety from "@/assets/tip-safety.jpg";
import tipWriting from "@/assets/tip-writing.jpg";
import tipPricing from "@/assets/tip-pricing.jpg";
import tipInspection from "@/assets/tip-inspection.jpg";
import tipMeeting from "@/assets/tip-meeting.jpg";
import tipPhotography from "@/assets/tip-photography.jpg";
import tipCommunication from "@/assets/tip-communication.jpg";
import tipNegotiation from "@/assets/tip-negotiation.jpg";
import tipFraud from "@/assets/tip-fraud.jpg";
import tipPromotion from "@/assets/tip-promotion.jpg";
import tipsHeroBanner from "@/assets/tips-hero-banner.jpg";

const allTips = [
  {
    image: tipSelling,
    title: "איך למכור בהצלחה",
    description: "טיפים חשובים למכירה מהירה ויעילה של הפריט שלך",
    category: "מכירה",
    slug: "sell-success"
  },
  {
    image: tipBuying,
    title: "מדריך לקונה החכם",
    description: "כל מה שצריך לדעת לפני רכישת מוצר יד שנייה",
    category: "קנייה",
    slug: "smart-buyer"
  },
  {
    image: tipSafety,
    title: "בטיחות ואבטחה",
    description: "הגן על עצמך ועל המידע האישי שלך בעסקאות",
    category: "אבטחה",
    slug: "safety-security"
  },
  {
    image: tipWriting,
    title: "כתיבת מודעה מושלמת",
    description: "כך תכתוב מודעה שתמשך קונים ותביא למכירה מהירה",
    category: "מודעות",
    slug: "perfect-ad"
  },
  {
    image: tipPricing,
    title: "תמחור נכון - המפתח למכירה",
    description: "איך לקבוע מחיר הוגן ואטרקטיבי לפריט שלך",
    category: "מכירה",
    slug: "pricing-tips"
  },
  {
    image: tipInspection,
    title: "בדיקת מצב הפריט",
    description: "מדריך מקיף לבדיקת מצב מוצרים לפני קנייה",
    category: "קנייה",
    slug: "product-inspection"
  },
  {
    image: tipMeeting,
    title: "נקודות מפגש בטוחות",
    description: "איפה ומתי להיפגש עם קונים ומוכרים",
    category: "אבטחה",
    slug: "safe-meeting"
  },
  {
    image: tipPhotography,
    title: "צילום מושלם למודעה",
    description: "טיפים לצילום פריטים שימכרו אותם בעצמם",
    category: "מודעות",
    slug: "photography-tips"
  },
  {
    image: tipCommunication,
    title: "תקשורת יעילה עם קונים",
    description: "כיצד לנהל שיחות שמובילות לעסקאות מוצלחות",
    category: "מכירה",
    slug: "communication-tips"
  },
  {
    image: tipNegotiation,
    title: "משא ומתן חכם",
    description: "אסטרטגיות למשא ומתן שיביאו לך את המחיר הטוב ביותר",
    category: "קנייה",
    slug: "negotiation-tips"
  },
  {
    image: tipFraud,
    title: "זיהוי הונאות נפוצות",
    description: "איך להימנע מנוכלים ולזהות מודעות מפוקפקות",
    category: "אבטחה",
    slug: "fraud-detection"
  },
  {
    image: tipPromotion,
    title: "קידום המודעה שלך",
    description: "דרכים להגביר את החשיפה של המודעה שלך",
    category: "מודעות",
    slug: "ad-promotion"
  },
];

const categories = [
  { id: "all", label: "הכל" },
  { id: "selling", label: "מכירה" },
  { id: "buying", label: "קנייה" },
  { id: "security", label: "אבטחה" },
  { id: "ads", label: "מודעות" },
];

const TipsGuidesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-white dark:bg-background border-b-2 border-gray-200 dark:border-border overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={tipsHeroBanner} 
              alt="טיפים ומדריכים"
              className="w-full h-full object-cover opacity-20 dark:opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-background"></div>
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                טיפים ומדריכים
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                כל המידע שאתה צריך כדי למכור ולקנות בצורה החכמה והבטוחה ביותר
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-6 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className="px-6 py-2 rounded-full bg-white dark:bg-background border-2 border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-accent/50 text-foreground font-medium text-sm whitespace-nowrap transition-all duration-200 hover:shadow-md"
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tips Grid */}
        <section className="py-8 md:py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {allTips.map((tip, index) => (
                <TipCard
                  key={index}
                  image={tip.image}
                  title={tip.title}
                  description={tip.description}
                  slug={tip.slug}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 md:py-16 bg-white dark:bg-background border-t-2 border-gray-200 dark:border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                לא מצאת את מה שחיפשת?
              </h2>
              <p className="text-muted-foreground mb-6">
                צור איתנו קשר ונשמח לעזור לך עם כל שאלה
              </p>
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors duration-200 shadow-md hover:shadow-lg">
                צור קשר
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TipsGuidesPage;
