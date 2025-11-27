import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import Footer from "@/components/Footer";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
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

const tipsData: { [key: string]: any } = {
  "sell-success": {
    image: tipSelling,
    title: "איך למכור בהצלחה",
    author: "דוד כהן",
    date: new Date(2024, 10, 15),
    category: "מכירה",
    readTime: "5 דקות קריאה",
    content: `
      <h2>מבוא</h2>
      <p>מכירה מוצלחת מתחילה הרבה לפני שאתה מפרסם את המודעה. המפתח להצלחה טמון בהכנה מוקדמת ובתכנון נכון של כל שלב בתהליך המכירה.</p>
      
      <h2>שלב 1: הכנת הפריט למכירה</h2>
      <p>לפני שאתה מצלם או מפרסם, וודא שהפריט שלך במצב הטוב ביותר האפשרי:</p>
      <ul>
        <li><strong>ניקיון יסודי:</strong> פריט נקי נראה יותר מטופח ושווה יותר בעיני הקונה.</li>
        <li><strong>תיקונים קלים:</strong> כדאי לתקן בעיות קטנות שעשויות להפחית את הערך.</li>
        <li><strong>איסוף מסמכים:</strong> הכן חשבוניות, אחריות, מדריכי הוראות והיסטוריית שירות.</li>
      </ul>

      <h2>שלב 2: צילום מקצועי</h2>
      <p>תמונות איכותיות מגדילות את הסיכוי למכירה ב-70%. עקוב אחר העקרונות הבאים:</p>
      <ul>
        <li>השתמש בתאורה טבעית או בתאורת סטודיו טובה</li>
        <li>צלם מזוויות שונות - לפחות 6-8 תמונות</li>
        <li>הדגש פרטים חשובים ומצב הפריט</li>
        <li>השתמש ברקע נייטרלי ונקי</li>
      </ul>

      <h2>שלב 3: כתיבת המודעה</h2>
      <p>מודעה טובה היא מודעה שמספקת את כל המידע הדרוש:</p>
      <ul>
        <li><strong>כותרת משכנעת:</strong> תאר את הפריט בצורה קצרה ומדויקת</li>
        <li><strong>תיאור מפורט:</strong> כלול מידע על מצב, גודל, צבע, תכונות מיוחדות</li>
        <li><strong>מחיר הוגן:</strong> עשה מחקר שוק וקבע מחיר תחרותי</li>
        <li><strong>פרטי קשר:</strong> ציין את דרכי ההתקשרות המועדפות עליך</li>
      </ul>

      <h2>שלב 4: תקשורת עם קונים</h2>
      <p>אופן התקשורת שלך משפיע ישירות על ההצלחה:</p>
      <ul>
        <li>ענה במהירות לפניות - רצוי תוך שעה</li>
        <li>היה סבלני ומנומס, גם אם יש הרבה שאלות</li>
        <li>ספק מידע נוסף כשמתבקש</li>
        <li>היה גמיש בנוגע לשעות פגישה</li>
      </ul>

      <h2>שלב 5: המפגש והעסקה</h2>
      <p>השלב האחרון הוא הקריטי ביותר:</p>
      <ul>
        <li><strong>בחר מקום ציבורי:</strong> מקום בטוח עם אנשים מסביב</li>
        <li><strong>הגע מוכן:</strong> הבא את הפריט נקי ואת כל המסמכים</li>
        <li><strong>היה גמיש במשא ומתן:</strong> אבל דע מה המחיר המינימלי שלך</li>
        <li><strong>קבל תשלום מאובטח:</strong> העדף מזומן או העברה בנקאית</li>
      </ul>

      <h2>טיפים נוספים להצלחה</h2>
      <p>כמה עצות מקצועיות נוספות שיעזרו לך:</p>
      <ul>
        <li>פרסם בזמנים אופטימליים - בדרך כלל ימי שישי-שבת</li>
        <li>רענן את המודעה אחת לכמה ימים</li>
        <li>היה ישיר לגבי מצב הפריט - זה יחסוך זמן</li>
        <li>תן אפשרות לביקורת מוקדמת אם מדובר בפריט יקר</li>
      </ul>

      <h2>מה לא לעשות</h2>
      <p>טעויות נפוצות שכדאי להימנע מהן:</p>
      <ul>
        <li>אל תשקר על מצב הפריט - זה יגרום לביטול העסקה</li>
        <li>אל תדרוש מחיר מופרז - זה ימנע פניות</li>
        <li>אל תהיה לא זמין - זה יגרום לקונים לחפש אלטרנטיבות</li>
        <li>אל תתעקש על דרך תשלום מסוימת - היה גמיש</li>
      </ul>

      <h2>סיכום</h2>
      <p>מכירה מוצלחת דורשת הכנה, סבלנות ומקצועיות. עקוב אחר השלבים שתיארנו, והסיכוי שלך למכירה מהירה ורווחית יגדל משמעותית. זכור - הרושם הראשון חשוב, אבל השירות והתקשורת לאורך כל התהליך הם המכריעים.</p>
    `
  },
  "smart-buyer": {
    image: tipBuying,
    title: "מדריך לקונה החכם",
    author: "שרה לוי",
    date: new Date(2024, 10, 10),
    category: "קנייה",
    readTime: "6 דקות קריאה",
    content: `
      <h2>מבוא</h2>
      <p>קנייה חכמה היא אומנות שמשלבת מחקר, סבלנות ויכולת הערכה. במדריך זה נלמד איך לקנות בצורה נכונה ולהימנע מטעויות נפוצות.</p>
      
      <h2>לפני הקנייה - מחקר ותכנון</h2>
      <p>השקעת זמן במחקר תחסוך לך כסף ואכזבות:</p>
      <ul>
        <li><strong>הגדר תקציב ברור:</strong> קבע מראש כמה אתה מוכן להשקיע</li>
        <li><strong>חקור את השוק:</strong> בדוק מחירים באתרים שונים</li>
        <li><strong>למד על המוצר:</strong> קרא ביקורות וחוות דעת</li>
        <li><strong>זהה נקודות תורפה:</strong> דע מה לחפש בבדיקה</li>
      </ul>

      <h2>בחירת המוכר הנכון</h2>
      <p>המוכר הוא חלק קריטי מהעסקה:</p>
      <ul>
        <li>בדוק את ההיסטוריה של המוכר באתר</li>
        <li>קרא המלצות וביקורות מקונים קודמים</li>
        <li>שים לב לאיכות המודעה ורמת הפירוט</li>
        <li>העדף מוכרים עם פרופיל מאומת</li>
      </ul>

      <h2>בדיקת המוצר</h2>
      <p>לעולם אל תקנה ללא בדיקה יסודית:</p>
      <ul>
        <li><strong>בדיקה פיזית:</strong> חפש שריטות, סדקים, כתמים</li>
        <li><strong>בדיקה פונקציונלית:</strong> וודא שהמוצר עובד כמו שצריך</li>
        <li><strong>בדיקת מסמכים:</strong> אמת אחריות, חשבונית, היסטוריית תחזוקה</li>
        <li><strong>בדיקת מקוריות:</strong> במוצרים יקרים, וודא שאינם מזויפים</li>
      </ul>

      <h2>משא ומתן אפקטיבי</h2>
      <p>טכניקות למשא ומתן מוצלח:</p>
      <ul>
        <li>התחל ממחיר נמוך באופן סביר</li>
        <li>הצבע על פגמים או שחיקה בעדינות</li>
        <li>הצג מחקר שוק שעשית</li>
        <li>היה מוכן לסגת אם המחיר לא הוגן</li>
      </ul>

      <h2>אבטחת העסקה</h2>
      <p>דאג שהעסקה תהיה בטוחה:</p>
      <ul>
        <li><strong>מקום פגישה:</strong> בחר מקום ציבורי ומואר</li>
        <li><strong>תשלום:</strong> העדף מזומן או העברה בנוכחות המוכר</li>
        <li><strong>תיעוד:</strong> קבל אישור בכתב על הרכישה</li>
        <li><strong>הסעה:</strong> תכנן מראש איך תוביל את המוצר</li>
      </ul>

      <h2>אחרי הקנייה</h2>
      <p>העבודה לא נגמרת עם התשלום:</p>
      <ul>
        <li>בדוק את המוצר שוב בבית ביסודיות</li>
        <li>שמור על קשר עם המוכר למקרה של בעיות</li>
        <li>נקה ותחזק את המוצר כראוי</li>
        <li>כתוב ביקורת למוכר אם השירות היה טוב</li>
      </ul>

      <h2>סיכום</h2>
      <p>קנייה חכמה דורשת השקעת זמן ומאמץ, אך התוצאה היא עסקה טובה ומוצר איכותי במחיר הוגן. עקוב אחר ההמלצות שלנו והפוך כל קנייה להצלחה.</p>
    `
  }
};

const TipDetails = () => {
  const { id } = useParams();
  const tip = id ? tipsData[id] : null;

  if (!tip) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">המאמר לא נמצא</h1>
          <Link to="/tips" className="text-primary hover:underline">
            חזור לעמוד הטיפים
          </Link>
        </div>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(tip.date, { addSuffix: true, locale: he });

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header />

      <main className="py-8 md:py-12">
        <article className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <Link 
            to="/tips"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 mb-6 md:mb-8"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="font-medium">חזרה לטיפים</span>
          </Link>

          {/* Header */}
          <div className="bg-white dark:bg-card rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden mb-8">
            {/* Featured Image */}
            <div className="relative h-64 md:h-96 overflow-hidden">
              <img 
                src={tip.image} 
                alt={tip.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 right-0 left-0 p-6 md:p-8">
                <span className="inline-block px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold mb-4">
                  {tip.category}
                </span>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                  {tip.title}
                </h1>
              </div>
            </div>

            {/* Meta Information */}
            <div className="p-6 md:p-8 border-b-2 border-gray-100 dark:border-border">
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{tip.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{timeAgo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{tip.readTime}</span>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none p-6 md:p-8 prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:leading-relaxed prose-ul:my-4"
              dangerouslySetInnerHTML={{ __html: tip.content }}
            />
          </div>

          {/* Related Tips */}
          <div className="bg-muted/30 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
              מאמרים נוספים שעשויים לעניין אותך
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                to="/tips/sell-success"
                className="flex gap-4 p-4 bg-white dark:bg-card rounded-xl hover:shadow-md transition-shadow duration-200"
              >
                <img src={tipSelling} alt="" className="w-20 h-20 object-cover rounded-lg" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">איך למכור בהצלחה</h3>
                  <p className="text-sm text-muted-foreground">טיפים למכירה מהירה ויעילה</p>
                </div>
              </Link>
              <Link 
                to="/tips/smart-buyer"
                className="flex gap-4 p-4 bg-white dark:bg-card rounded-xl hover:shadow-md transition-shadow duration-200"
              >
                <img src={tipBuying} alt="" className="w-20 h-20 object-cover rounded-lg" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">מדריך לקונה החכם</h3>
                  <p className="text-sm text-muted-foreground">כל מה שצריך לדעת לפני קנייה</p>
                </div>
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default TipDetails;
