// Secondhand Filter Configuration - Matches exactly the PostSecondhand form fields

export const categories = ["ריהוט", "מוצרי חשמל", "מחשבים", "מכשירים סלולריים", "ספורט ופנאי", "אופנה", "תינוקות וילדים"];

export const subcategories: Record<string, string[]> = {
  "ריהוט": [
    "ספות", "כורסאות", "שולחנות אוכל", "שולחנות סלון", "כיסאות",
    "ארונות בגדים", "ארונות נעליים", "מיטות זוגיות", "מיטות יחיד",
    "שידות", "מדפים", "מראות", "ארונות מטבח", "שולחנות עבודה"
  ],
  "מוצרי חשמל": [
    "מקררים", "מקפיאים", "מכונות כביסה", "מייבשי כביסה",
    "תנורים", "כיריים", "מיקרוגל", "מזגנים", "מאווררים",
    "מדיחי כלים", "שואבי אבק", "מערכות סטריאו", "טלוויזיות"
  ],
  "מחשבים": [
    "מחשבים ניידים", "מחשבים נייחים", "מחשבי גיימינג", "מחשבים לעבודה",
    "מקבוק", "אולטרה בוק", "טאבלטים", "מסכים", "מקלדות", "עכברים",
    "אוזניות", "כרטיסי מסך", "מעבדים", "זיכרון RAM", "כוננים", "לוחות אם"
  ],
  "מכשירים סלולריים": [
    "אייפון", "סמסונג גלקסי", "שיאומי", "וואווי", "אופו", "וואן פלוס",
    "גוגל פיקסל", "נוקיה", "מוטורולה", "שעונים חכמים", "אוזניות אלחוטיות",
    "מטענים", "כיסויים", "מגני מסך", "סוללות חיצוניות"
  ],
  "ספורט ופנאי": [
    "אופני כביש", "אופני הרים", "אופניים חשמליים", "קורקינטים",
    "ציוד כושר ביתי", "משקולות", "הליכונים", "אופני כושר",
    "משחקי קופסא", "משחקי וידאו", "ספרים", "גיטרות", "פסנתרים", "תופים"
  ],
  "אופנה": [
    "חולצות", "מכנסיים", "שמלות", "חצאיות", "מעילים",
    "נעלי ספורט", "נעלי עקב", "סנדלים", "מגפיים",
    "תיקי יד", "תיקי גב", "שעונים", "תכשיטים", "משקפי שמש"
  ],
  "תינוקות וילדים": [
    "עגלות", "טיולונים", "כיסאות אוכל", "מיטות תינוק", "עריסות",
    "צעצועי התפתחות", "משחקי בנייה", "בגדי תינוקות (0-2)",
    "בגדי ילדים (2-6)", "בגדי ילדים (6-12)", "אביזרי האכלה", "מוצצים ובקבוקים"
  ]
};

export const conditions = ["חדש", "כמו חדש", "במצב טוב", "משומש", "דורש תיקון"];

export const cities = [
  "תל אביב", "ירושלים", "חיפה", "באר שבע", "נתניה", "פתח תקווה",
  "ראשון לציון", "אשדוד", "רחובות", "בני ברק", "הרצליה", "כפר סבא",
  "רמת גן", "חולון", "אילת", "עכו", "נהריה", "קריית שמונה"
];

export const colors = ["לבן", "שחור", "אפור", "אפור כהה", "חום", "בז'", "קרם", "כחול", "כחול כהה", "תכלת", "ירוק", "ירוק כהה", "אדום", "בורדו", "ורוד", "סגול", "צהוב", "כתום", "כסוף", "זהב", "נחושת", "טורקיז", "צבעוני", "מנומר/דוגמה"];

// ============== FURNITURE FILTERS ==============
export const furnitureFilters = {
  materials: ["עץ מלא", "עץ מלא - אלון", "עץ מלא - אורן", "עץ מלא - מייפל", "עץ MDF", "סנדוויץ׳/פורמייקה", "מתכת", "אלומיניום", "פלסטיק", "זכוכית מחוסמת", "זכוכית רגילה", "עור אמיתי", "עור סינטטי", "בד", "קטיפה", "ראטן", "במבוק", "שילוב חומרים"],
  sizes: ["קטן", "בינוני", "גדול", "ענק", "חד-מושבי", "דו-מושבי", "תלת-מושבי", "ארבע-מושבי"],
  conditionDetail: ["ללא שריטות", "שריטות קלות", "שריטות בינוניות", "סימני שימוש", "דורש ריפוד מחדש", "דורש תיקון קל"],
  assembly: ["מורכב ומוכן", "דורש הרכבה פשוטה", "דורש הרכבה מקצועית", "ניתן לפירוק"],
  styles: ["מודרני", "קלאסי", "כפרי", "סקנדינבי", "תעשייתי", "וינטג׳", "מזרחי", "מינימליסטי"],
  
  // Sofas & Armchairs
  sofaTypes: ["ספה ישרה", "ספת פינה", "ספה נפתחת", "ספת פוף", "ספת עור", "ספה מודולרית", "ספת רהיטים", "לאב-סיט"],
  sofaUpholstery: ["בד", "עור אמיתי", "עור סינטטי", "קטיפה", "פשתן", "מיקרופייבר", "ויסקוזה", "פוליאסטר"],
  sofaSeating: ["דו-מושבית", "תלת-מושבית", "ארבע-מושבית", "פינתית L", "פינתית U", "מודולרית"],
  sofaFeatures: ["נפתחת למיטה", "עם ארגז מצעים", "רגליים מתכת", "רגליים עץ", "ריקליינר", "משענות יד מתכווננות", "כריות נשלפות", "ראש מתכוונן"],
  sofaFilling: ["ספוג צפיפות גבוהה", "ספוג רגיל", "נוצות", "קפיצים", "לטקס", "שילוב"],

  // Beds
  bedTypes: ["מיטה זוגית", "מיטה וחצי", "מיטת יחיד", "מיטת קומותיים", "מיטה מתכווננת", "מיטת יום", "מיטת ברזל", "מיטה עם אחסון"],
  bedSizes: ["80x190", "90x190", "120x190", "140x190", "140x200", "160x200", "180x200", "200x200"],
  mattressTypes: ["קפיצים", "ספוג", "לטקס", "מזרן כיס", "מזרן זיכרון", "מזרן היברידי", "ללא מזרן"],
  mattressHardness: ["רך", "רך-בינוני", "בינוני", "בינוני-קשה", "קשה"],
  bedFeatures: ["עם ארגז מצעים", "עם מסגרת", "ראש מיטה מרופד", "ראש מיטה עץ", "בסיס עם רגליים", "ראש מיטה עם אחסון", "תאורת LED"],
  bedFrame: ["עץ מלא", "MDF", "מתכת", "ריפוד בד", "ריפוד עור"],

  // Tables
  tableTypes: ["שולחן אוכל", "שולחן סלון", "שולחן עבודה", "שולחן כתיבה", "שולחן צד", "שולחן קפה", "שולחן בר", "שולחן חוץ"],
  tableShapes: ["מלבני", "עגול", "אובלי", "ריבועי", "לא סימטרי", "עם עיגולים"],
  tableSeating: ["2 סועדים", "4 סועדים", "6 סועדים", "8 סועדים", "10 סועדים", "12+ סועדים", "נפתח"],
  tableExtension: ["קבוע", "נפתח באמצע", "נפתח בצדדים", "מתקפל"],
  tableTop: ["עץ מלא", "MDF/פורניר", "זכוכית", "שיש", "גרניט", "קרמיקה", "משטח מלמין"],

  // Chairs
  chairTypes: ["כיסא אוכל", "כיסא משרדי", "כיסא גיימינג", "כיסא בר", "כיסא נדנדה", "שרפרף", "כיסא מתקפל", "כורסה"],
  chairFeatures: ["עם ידיות", "מרופד", "מתכוונן גובה", "גלגלים", "ארגונומי", "תמיכה לומברית", "משענת ראש", "רשת נושמת"],
  chairBase: ["4 רגליים", "5 רגליים עם גלגלים", "רגל מרכזית", "מתכת", "עץ", "פלסטיק"],

  // Closets
  closetTypes: ["ארון הזזה", "ארון דלתות", "ארון פינתי", "קומודה", "ארון נעליים", "ארון בגדים פתוח", "מערכת ארונות מודולרית"],
  closetDoors: ["דלת אחת", "2 דלתות", "3 דלתות", "4 דלתות", "5+ דלתות", "ללא דלתות"],
  closetFeatures: ["עם מראה", "עם תאורה פנימית", "מגירות", "מדפים", "תליה כפולה", "מגירות תכשיטים", "מדפי נעליים", "מוט תליה נשלף"],
  closetInternalOrg: ["תליה בלבד", "מדפים בלבד", "שילוב תליה ומדפים", "מערכת מודולרית"],
};

// ============== ELECTRONICS FILTERS ==============
export const electronicsFilters = {
  brands: ["Samsung", "LG", "Bosch", "Siemens", "Electrolux", "Whirlpool", "Haier", "Beko", "Candy", "Ariston", "Miele", "AEG", "Panasonic", "Sharp", "Toshiba"],
  energyRating: ["A+++", "A++", "A+", "A", "B", "C", "D", "לא ידוע"],
  purchaseSource: ["יבואן רשמי", "חנות רשת", "אינטרנט - אתר ישראלי", "אינטרנט - חו״ל", "יד שנייה", "אחר"],

  // Fridges
  fridgeTypes: ["מקרר דו-דלתי", "מקרר חד-דלתי", "מקרר צד בצד (Side by Side)", "מקרר פרנצ׳ דור", "מקרר משולב מקפיא עליון", "מקרר משולב מקפיא תחתון", "מקרר מיני", "מקרר יין"],
  fridgeSizes: ["עד 200 ליטר", "200-300 ליטר", "300-400 ליטר", "400-500 ליטר", "500-600 ליטר", "600-700 ליטר", "מעל 700 ליטר"],
  fridgeFeatures: ["No Frost", "מתקן מים", "מתקן קרח", "אזור טריות", "דלת בתוך דלת", "חיסכוני", "מדחס אינוורטר", "Wi-Fi/Smart", "מסך מגע", "בר מים חיצוני"],

  // Washers
  washerTypes: ["מכונת כביסה פתח קדמי", "מכונת כביסה פתח עליון", "מכונה משולבת כביסה-ייבוש", "מכונת כביסה תעשייתית", "מכונת כביסה סלים"],
  washerCapacity: ["5 ק״ג", "6 ק״ג", "7 ק״ג", "8 ק״ג", "9 ק״ג", "10 ק״ג", "12 ק״ג", "14 ק״ג", "מעל 14 ק״ג"],
  washerFeatures: ["אינוורטר", "מנוע ישיר", "הוספת כביסה באמצע", "Wi-Fi/Smart", "קיטור", "חיסכוני", "תכנית מהירה", "תכנית אלרגיה", "תוף נירוסטה"],
  washerSpin: ["800 סל״ד", "1000 סל״ד", "1200 סל״ד", "1400 סל״ד", "1600 סל״ד"],

  // Dryers
  dryerTypes: ["מייבש קונדנסור", "מייבש משאבת חום", "מייבש פליטה", "מייבש משולב"],
  dryerCapacity: ["7 ק״ג", "8 ק״ג", "9 ק״ג", "10 ק״ג", "12 ק״ג"],
  dryerFeatures: ["חיישן לחות", "תכניות מרובות", "סל לסריגים", "Wi-Fi/Smart", "שקט"],

  // Ovens
  ovenTypes: ["תנור בנוי", "תנור משולב כיריים", "תנור טורבו", "תנור משולב מיקרוגל", "תנור אדים", "תנור פיצה", "טוסטר אובן"],
  ovenFeatures: ["פירוליטי (ניקוי עצמי)", "טורבו", "גריל", "תכניות אפייה", "Wi-Fi/Smart", "טלסקופים", "מאוורר כפול", "מדחום מובנה"],
  ovenSize: ["קומפקטי (45 ס״מ)", "סטנדרטי (60 ס״מ)", "רחב (90 ס״מ)"],

  // Cooktops
  cooktopTypes: ["כיריים אינדוקציה", "כיריים גז", "כיריים קרמיות", "כיריים חשמליות", "משולב גז ואינדוקציה"],
  cooktopBurners: ["2 להבות", "3 להבות", "4 להבות", "5 להבות", "6 להבות"],

  // AC
  acTypes: ["מזגן עילי", "מזגן מרכזי", "מזגן מיני מרכזי", "מזגן נייד", "מפוצל (ספליט)", "מולטי ספליט"],
  acCapacity: ["9,000 BTU", "12,000 BTU", "18,000 BTU", "21,000 BTU", "24,000 BTU", "מעל 24,000 BTU"],
  acFeatures: ["אינוורטר", "Wi-Fi/Smart", "סינון אוויר", "חימום", "שקט במיוחד", "פלזמה", "יונים", "טורבו"],
  acInstallation: ["מותקן ומחובר", "דורש התקנה", "נייד - לא דורש התקנה"],

  // TVs
  tvTypes: ["LED", "OLED", "QLED", "Neo QLED", "Mini LED", "LCD", "פלזמה"],
  tvSizes: ["32 אינץ׳", "40 אינץ׳", "43 אינץ׳", "50 אינץ׳", "55 אינץ׳", "65 אינץ׳", "75 אינץ׳", "85 אינץ׳", "מעל 85 אינץ׳"],
  tvFeatures: ["Smart TV", "4K UHD", "8K", "HDR10", "HDR10+", "Dolby Vision", "120Hz", "144Hz", "Gaming Mode", "HDMI 2.1", "VRR", "Ambilight"],
  tvOS: ["Android TV", "Google TV", "WebOS (LG)", "Tizen (Samsung)", "Fire TV", "Roku TV", "ללא מערכת"],

  // Dishwashers
  dishwasherTypes: ["מדיח כלים רחב", "מדיח כלים צר", "מדיח כלים שולחני", "מדיח כלים מובנה"],
  dishwasherCapacity: ["6 מערכות", "9 מערכות", "12 מערכות", "14 מערכות", "מעל 14 מערכות"],
  dishwasherFeatures: ["מגש סכו״ם שלישי", "קיטור", "חיסכוני", "שקט", "Wi-Fi/Smart", "זיהוי עומס"],

  // Vacuums
  vacuumTypes: ["שואב אבק רובוטי", "שואב אבק אלחוטי", "שואב אבק עם שקית", "שואב אבק ללא שקית", "שואב אבק מים", "שואב אבק ידני"],
  vacuumFeatures: ["HEPA", "Wi-Fi/Smart", "מיפוי", "שטיפה", "תחנת ריקון", "אוטונומיה גבוהה"],
};

// ============== COMPUTERS FILTERS ==============
export const computersFilters = {
  brands: ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "MSI", "Microsoft", "Samsung", "LG", "Razer", "אחר"],
  processors: ["Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 3", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9", "Apple M1", "Apple M2", "Apple M3", "אחר"],
  ramOptions: ["4GB", "8GB", "16GB", "32GB", "64GB"],
  storageOptions: ["128GB", "256GB", "512GB", "1TB", "2TB"],
  storageTypes: ["SSD", "HDD", "SSD + HDD"],
  screenSizes: ["11.6\"", "13.3\"", "14\"", "15.6\"", "16\"", "17.3\"", "24\"", "27\"", "32\""],
  graphicsCards: ["Intel UHD", "Intel Iris", "NVIDIA GeForce GTX", "NVIDIA GeForce RTX", "AMD Radeon", "Apple GPU", "ללא כרטיס ייעודי"],
  operatingSystems: ["Windows 11", "Windows 10", "macOS", "Chrome OS", "Linux", "ללא מערכת הפעלה"],
};

// ============== PHONES FILTERS ==============
export const phonesFilters = {
  brands: ["Apple", "Samsung", "Xiaomi", "Huawei", "Oppo", "OnePlus", "Google", "Nokia", "Motorola", "Sony", "אחר"],
  storageOptions: ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"],
  conditions: ["חדש באריזה", "כמו חדש", "מצב מעולה", "מצב טוב", "מצב סביר", "לחלקי חילוף"],
  ramOptions: ["2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"],
  screenSizes: ["5.0-5.5\"", "5.5-6.0\"", "6.0-6.5\"", "6.5-7.0\"", "מעל 7.0\""],
};

// ============== SPORTS FILTERS ==============
export const sportsFilters = {
  brands: ["Nike", "Adidas", "Puma", "Giant", "Trek", "Specialized", "Decathlon", "Reebok", "Under Armour"],

  // Bikes
  bikeBrands: ["Giant", "Trek", "Specialized", "Cannondale", "Scott", "Merida", "BMC", "Cube", "Santa Cruz", "Orbea", "אחר"],
  bikeTypes: ["אופני כביש", "אופני הרים", "אופניים היברידיים", "אופני עיר", "אופני BMX", "אופני ילדים", "אופני גראבל", "אופני טריאתלון"],
  bikeSizes: ["XS (14-15\")", "S (15-17\")", "M (17-19\")", "L (19-21\")", "XL (21-23\")", "גלגל 16\"", "גלגל 20\"", "גלגל 24\"", "גלגל 26\"", "גלגל 27.5\"", "גלגל 29\"", "גלגל 700c"],
  bikeFeatures: ["מתלים קדמיים", "מתלים מלאים", "בלמי דיסק הידראוליים", "בלמי דיסק מכניים", "בלמי V", "חשמלי", "קרבון", "אלומיניום", "פלדה", "טיטניום"],
  bikeGears: ["ללא הילוכים", "7 הילוכים", "9 הילוכים", "10 הילוכים", "11 הילוכים", "12 הילוכים", "Shimano", "SRAM"],

  // E-Bikes
  eBikeBrands: ["Bosch", "Shimano Steps", "Bafang", "Yamaha", "Kalkhoff", "Cube", "Giant", "Trek", "Specialized", "אחר"],
  eBikeBattery: ["250Wh", "400Wh", "500Wh", "625Wh", "750Wh", "מעל 750Wh"],
  eBikeRange: ["עד 40 ק״מ", "40-60 ק״מ", "60-80 ק״מ", "80-120 ק״מ", "מעל 120 ק״מ"],
  eBikeMotorLocation: ["מנוע גלגל אחורי", "מנוע גלגל קדמי", "מנוע מרכזי"],
  eBikeSpeed: ["עד 25 קמ״ש (חוקי)", "עד 32 קמ״ש", "עד 45 קמ״ש"],

  // Scooters
  scooterTypes: ["קורקינט חשמלי", "קורקינט רגיל", "קורקינט ספורט", "קורקינט ילדים"],
  scooterSpeed: ["עד 25 קמ״ש", "25-35 קמ״ש", "35-45 קמ״ש", "מעל 45 קמ״ש"],
  scooterRange: ["עד 20 ק״מ", "20-40 ק״מ", "40-60 ק״מ", "מעל 60 ק״מ"],
  scooterFeatures: ["בלם דיסק", "בלם אלקטרוני", "כפתור שיוט", "תאורה", "מתלים", "גלגלים מנופחים", "IP54/עמיד מים"],

  // Gym Equipment
  gymEquipTypes: ["הליכון", "אופני כושר", "אליפטיקל", "חתירה", "מכונת משקולות", "ספסל אימון", "משקולות חופשיות", "מוט מתח", "TRX", "כדור פיזיו"],
  gymBrands: ["Life Fitness", "Technogym", "NordicTrack", "Bowflex", "Kettler", "Horizon", "Precor", "Matrix", "אחר"],
  gymFeatures: ["מסך מגע", "תכניות אימון", "חיבור Bluetooth", "מדידת דופק", "מתקפל", "משקל מקסימלי גבוה"],
  gymMaxWeight: ["עד 100 ק״ג", "100-120 ק״ג", "120-150 ק״ג", "מעל 150 ק״ג"],

  // Instruments
  instrumentTypes: ["גיטרה אקוסטית", "גיטרה קלאסית", "גיטרה חשמלית", "גיטרה בס", "פסנתר אקוסטי", "פסנתר כנף", "פסנתר חשמלי", "קלידים", "סינתיסייזר", "תופים אקוסטיים", "תופים חשמליים", "כינור", "ויולה", "צ׳לו", "חליל", "סקסופון", "חצוצרה", "קלרינט", "אוקולה"],
  instrumentBrands: ["Yamaha", "Fender", "Gibson", "Roland", "Casio", "Ibanez", "Pearl", "Epiphone", "Taylor", "Martin", "Steinway", "Kawai", "אחר"],
  instrumentConditions: ["חדש באריזה", "כמו חדש", "משומש - מצב מעולה", "משומש - מצב טוב", "דורש כוונון", "דורש תיקון"],
  instrumentAccessories: ["נרתיק כלול", "מגבר כלול", "סטנד כלול", "כבלים כלולים", "מטרונום כלול", "ללא אביזרים"],
};

// ============== FASHION FILTERS ==============
export const fashionFilters = {
  brands: ["Zara", "H&M", "Mango", "Castro", "Fox", "TNT", "Golf", "American Eagle", "Banana Republic", "GAP", "Pull&Bear", "Massimo Dutti", "Tommy Hilfiger", "Calvin Klein", "Levi's"],
  sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL", "34", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "48", "50"],
  genders: ["נשים", "גברים", "יוניסקס", "ילדים", "תינוקות"],
  seasons: ["כל השנה", "קיץ", "חורף", "אביב/סתיו", "מעבר"],
  conditions: ["חדש עם תווית", "חדש ללא תווית", "לבוש פעם אחת", "משומש - מצב מעולה", "משומש - מצב טוב", "משומש - מצב סביר"],
  materials: ["כותנה", "פוליאסטר", "צמר", "משי", "פשתן", "ג׳ינס", "קורדרוי", "עור", "שילוב"],

  // Shirts
  shirtTypes: ["חולצת טי", "חולצה מכופתרת", "פולו", "סווטשירט", "קפוצ׳ון", "גופיה", "חולצת בייסיק", "חולצת ספורט"],
  
  // Pants
  pantsTypes: ["ג׳ינס", "מכנסי בד", "מכנסי ספורט", "מכנסיים קצרים", "לגינס", "מכנסי שבת", "מכנסי צ׳ינו", "מכנסי פשתן"],
  
  // Dresses
  dressTypes: ["שמלת ערב", "שמלת קז׳ואל", "שמלת מקסי", "שמלת מיני", "שמלת מידי", "שמלת כלה", "שמלת קוקטייל", "שמלת חוף"],
  
  // Coats
  coatTypes: ["מעיל חורף", "ג׳קט", "מעיל גשם", "מעיל קל", "בלייזר", "וסט", "מעיל פוך", "מעיל צמר", "טרנץ׳"],

  // Shoes
  shoeBrands: ["Nike", "Adidas", "New Balance", "Puma", "Converse", "Vans", "Dr. Martens", "Steve Madden", "Aldo", "Clarks", "Birkenstock", "Crocs", "Timberland", "אחר"],
  shoeSizes: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48"],
  shoeTypes: ["נעלי ספורט", "נעלי ריצה", "נעלי עקב", "סנדלים", "מגפיים", "נעלי בלט", "נעלי אוקספורד", "כפכפים", "נעלי עבודה", "נעלי טיולים", "מוקסינים", "לופרס"],
  shoeWidth: ["צר", "רגיל", "רחב", "רחב במיוחד"],

  // Bags
  bagTypes: ["תיק יד", "תיק צד", "תיק גב", "ארנק", "תיק מסמכים", "תיק ערב", "תיק קלאץ׳", "תיק ספורט", "מזוודה"],
  bagBrands: ["Michael Kors", "Coach", "Guess", "Longchamp", "Kipling", "Samsonite", "Tumi", "Herschel", "Fjällräven", "אחר"],
  bagMaterials: ["עור אמיתי", "עור סינטטי", "בד", "ניילון", "קנבס", "PVC", "רשת"],
  bagSizes: ["קטן", "בינוני", "גדול", "XL"],

  // Jewelry
  jewelryTypes: ["שרשרת", "צמיד", "טבעת", "עגילים", "שעון", "סיכה", "סט תכשיטים", "אנקלט"],
  jewelryMaterials: ["זהב 14K", "זהב 18K", "זהב 22K", "כסף 925", "פלטינה", "נירוסטה", "טיטניום", "ציפוי זהב", "תכשיט אופנה"],
  jewelryStones: ["יהלום", "זירקון", "אמרלד", "רובי", "ספיר", "פנינה", "אופל", "ללא אבן"],
  
  // Watches
  watchTypes: ["שעון אוטומטי", "שעון קוורץ", "שעון חכם", "שעון כרונוגרף", "שעון צלילה", "שעון שמלה"],
  watchBrands: ["Rolex", "Omega", "Tag Heuer", "Seiko", "Citizen", "Casio", "G-Shock", "Apple Watch", "Samsung", "Garmin", "Tissot", "אחר"],
};

// ============== BABY & KIDS FILTERS ==============
export const babyKidsFilters = {
  sizes: ["0-3 חודשים", "3-6 חודשים", "6-9 חודשים", "9-12 חודשים", "12-18 חודשים", "18-24 חודשים", "2-3 שנים", "3-4 שנים", "4-5 שנים", "5-6 שנים", "6-8 שנים", "8-10 שנים", "10-12 שנים"],
  safety: ["תקן ישראלי", "תקן אירופאי (CE)", "תקן אמריקאי", "ללא תקן ידוע"],

  // Strollers
  strollerBrands: ["Bugaboo", "Maxi-Cosi", "Chicco", "Baby Jogger", "UPPAbaby", "Cybex", "Britax", "Nuna", "Silver Cross", "iCandy", "Joie", "אחר"],
  strollerTypes: ["עגלת תינוק פול סייז", "טיולון", "עגלה כפולה", "עגלת רוץ", "עגלה קלה", "עגלת תאומים", "מערכת נסיעה (Travel System)"],
  strollerFeatures: ["מתקפל ביד אחת", "ידית הפיכה", "גלגלים גדולים", "סלקל", "קל משקל", "עמיד גשם", "סלסלת אחסון גדולה", "בלם רגל", "גלגלים מנופחים"],
  strollerWeight: ["עד 5 ק״ג", "5-8 ק״ג", "8-12 ק״ג", "מעל 12 ק״ג"],
  strollerMaxAge: ["עד 6 חודשים", "עד שנה", "עד 3 שנים", "עד 4+ שנים"],

  // Cribs
  cribTypes: ["מיטת תינוק", "עריסה", "מיטת מעבר", "מיטה ניידת", "לול", "מיטה צמודת הורים", "עריסת נדנדה"],
  cribSizes: ["60x120 ס״מ", "70x140 ס״מ", "80x160 ס״מ", "נייד/מתקפל"],
  cribFeatures: ["מגן ראש", "מזרן כלול", "גלגלים", "מתכווננת גובה", "ארגז אחסון", "צדדים נשלפים", "הופכת למיטת מעבר"],
  cribMaterial: ["עץ מלא", "MDF", "מתכת", "רשת"],

  // Car Seats
  carSeatTypes: ["סלקל (0-13 ק״ג)", "קבוצה 0+ (0-18 ק״ג)", "קבוצה 1 (9-18 ק״ג)", "קבוצה 2-3 (15-36 ק״ג)", "בוסטר", "כיסא משולב 0-36 ק״ג"],
  carSeatBrands: ["Maxi-Cosi", "Cybex", "Britax", "Chicco", "Joie", "Nuna", "BeSafe", "Recaro", "Graco", "אחר"],
  carSeatFeatures: ["איזופיקס", "מסתובב 360", "מונע שכחה", "מתכוונן שכיבה", "הגנת צד", "ראש מתכוונן"],
  carSeatDirection: ["פנים לאחור בלבד", "פנים קדימה בלבד", "דו-כיווני"],

  // High Chairs
  highChairTypes: ["כיסא אוכל קלאסי", "כיסא אוכל מודולרי", "בוסטר לכיסא", "כיסא מתקפל", "כיסא גבוה עם מגש"],
  feedingBrands: ["Stokke", "Chicco", "Inglesina", "BabyBjörn", "IKEA", "Joie", "Peg Perego", "אחר"],
  highChairFeatures: ["מגש נשלף", "גלגלים", "מתכוונן גובה", "ריפוד רחיץ", "מתקפל", "רצועות 5 נקודות"],

  // Toys
  toyAgeGroups: ["0-3 חודשים", "3-6 חודשים", "6-12 חודשים", "1-2 שנים", "2-3 שנים", "3-5 שנים", "5-7 שנים", "7+ שנים"],
  toyTypes: ["צעצועי התפתחות", "משחקי בנייה", "בובות", "משחקי תפקידים", "משחקי חוץ", "משחקי קופסא", "צעצועים מוזיקליים", "צעצועי רכיבה", "פאזלים"],
  toyBrands: ["Fisher-Price", "LEGO", "DUPLO", "Playmobil", "Melissa & Doug", "VTech", "Hasbro", "Mattel", "Little Tikes", "אחר"],
  toyCondition: ["חדש באריזה", "כמו חדש", "משומש מצב מעולה", "משומש מצב טוב", "חסרים חלקים"],
  toyFeatures: ["עם צלילים", "עם אורות", "אינטראקטיבי", "חינוכי", "ללא סוללות"],

  // Baby Clothes
  babyClothBrands: ["Carter's", "H&M Kids", "Zara Kids", "GAP Kids", "Next", "Primark", "Fox Kids", "Shilav", "אחר"],
  clothingConditions: ["חדש עם תווית", "כמו חדש", "משומש - מצב מעולה", "משומש - מצב טוב"],
};

// Get filters for a specific category and subcategory
export const getFiltersForCategory = (category: string, subcategory?: string) => {
  const baseFilters = {
    conditions,
    cities,
    colors,
  };

  switch (category) {
    case "ריהוט":
      return {
        ...baseFilters,
        materials: furnitureFilters.materials,
        styles: furnitureFilters.styles,
        assembly: furnitureFilters.assembly,
        ...getSubcategoryFilters("furniture", subcategory),
      };
    case "מוצרי חשמל":
      return {
        ...baseFilters,
        brands: electronicsFilters.brands,
        energyRating: electronicsFilters.energyRating,
        ...getSubcategoryFilters("electronics", subcategory),
      };
    case "מחשבים":
      return {
        ...baseFilters,
        brands: computersFilters.brands,
        processors: computersFilters.processors,
        ramOptions: computersFilters.ramOptions,
        storageOptions: computersFilters.storageOptions,
        storageTypes: computersFilters.storageTypes,
        screenSizes: computersFilters.screenSizes,
        graphicsCards: computersFilters.graphicsCards,
        operatingSystems: computersFilters.operatingSystems,
        ...getSubcategoryFilters("computers", subcategory),
      };
    case "מכשירים סלולריים":
      return {
        ...baseFilters,
        brands: phonesFilters.brands,
        storageOptions: phonesFilters.storageOptions,
        phoneConditions: phonesFilters.conditions,
        ramOptions: phonesFilters.ramOptions,
        screenSizes: phonesFilters.screenSizes,
        ...getSubcategoryFilters("phones", subcategory),
      };
    case "ספורט ופנאי":
      return {
        ...baseFilters,
        ...getSubcategoryFilters("sports", subcategory),
      };
    case "אופנה":
      return {
        ...baseFilters,
        brands: fashionFilters.brands,
        sizes: fashionFilters.sizes,
        genders: fashionFilters.genders,
        seasons: fashionFilters.seasons,
        ...getSubcategoryFilters("fashion", subcategory),
      };
    case "תינוקות וילדים":
      return {
        ...baseFilters,
        sizes: babyKidsFilters.sizes,
        safety: babyKidsFilters.safety,
        ...getSubcategoryFilters("baby", subcategory),
      };
    default:
      return baseFilters;
  }
};

const getSubcategoryFilters = (category: string, subcategory?: string) => {
  if (!subcategory) return {};

  // Furniture subcategories
  if (category === "furniture") {
    if (["ספות", "כורסאות"].includes(subcategory)) {
      return {
        types: furnitureFilters.sofaTypes,
        upholstery: furnitureFilters.sofaUpholstery,
        seating: furnitureFilters.sofaSeating,
        features: furnitureFilters.sofaFeatures,
        filling: furnitureFilters.sofaFilling,
      };
    }
    if (["מיטות זוגיות", "מיטות יחיד"].includes(subcategory)) {
      return {
        types: furnitureFilters.bedTypes,
        bedSizes: furnitureFilters.bedSizes,
        mattressTypes: furnitureFilters.mattressTypes,
        hardness: furnitureFilters.mattressHardness,
        features: furnitureFilters.bedFeatures,
        frame: furnitureFilters.bedFrame,
      };
    }
    if (["שולחנות אוכל", "שולחנות סלון", "שולחנות עבודה"].includes(subcategory)) {
      return {
        types: furnitureFilters.tableTypes,
        shapes: furnitureFilters.tableShapes,
        seating: furnitureFilters.tableSeating,
        extension: furnitureFilters.tableExtension,
        tableTop: furnitureFilters.tableTop,
      };
    }
    if (subcategory === "כיסאות") {
      return {
        types: furnitureFilters.chairTypes,
        features: furnitureFilters.chairFeatures,
        base: furnitureFilters.chairBase,
      };
    }
    if (["ארונות בגדים", "ארונות נעליים"].includes(subcategory)) {
      return {
        types: furnitureFilters.closetTypes,
        doors: furnitureFilters.closetDoors,
        features: furnitureFilters.closetFeatures,
        internalOrg: furnitureFilters.closetInternalOrg,
      };
    }
  }

  // Electronics subcategories
  if (category === "electronics") {
    if (["מקררים", "מקפיאים"].includes(subcategory)) {
      return {
        types: electronicsFilters.fridgeTypes,
        fridgeSizes: electronicsFilters.fridgeSizes,
        features: electronicsFilters.fridgeFeatures,
      };
    }
    if (subcategory === "מכונות כביסה") {
      return {
        types: electronicsFilters.washerTypes,
        capacity: electronicsFilters.washerCapacity,
        features: electronicsFilters.washerFeatures,
        spin: electronicsFilters.washerSpin,
      };
    }
    if (subcategory === "מייבשי כביסה") {
      return {
        types: electronicsFilters.dryerTypes,
        capacity: electronicsFilters.dryerCapacity,
        features: electronicsFilters.dryerFeatures,
      };
    }
    if (subcategory === "תנורים") {
      return {
        types: electronicsFilters.ovenTypes,
        ovenSize: electronicsFilters.ovenSize,
        features: electronicsFilters.ovenFeatures,
      };
    }
    if (subcategory === "כיריים") {
      return {
        types: electronicsFilters.cooktopTypes,
        burners: electronicsFilters.cooktopBurners,
      };
    }
    if (subcategory === "מזגנים") {
      return {
        types: electronicsFilters.acTypes,
        capacity: electronicsFilters.acCapacity,
        features: electronicsFilters.acFeatures,
        installation: electronicsFilters.acInstallation,
      };
    }
    if (subcategory === "טלוויזיות") {
      return {
        types: electronicsFilters.tvTypes,
        tvSizes: electronicsFilters.tvSizes,
        features: electronicsFilters.tvFeatures,
        os: electronicsFilters.tvOS,
      };
    }
    if (subcategory === "מדיחי כלים") {
      return {
        types: electronicsFilters.dishwasherTypes,
        capacity: electronicsFilters.dishwasherCapacity,
        features: electronicsFilters.dishwasherFeatures,
      };
    }
    if (subcategory === "שואבי אבק") {
      return {
        types: electronicsFilters.vacuumTypes,
        features: electronicsFilters.vacuumFeatures,
      };
    }
  }

  // Sports subcategories
  if (category === "sports") {
    if (["אופני כביש", "אופני הרים"].includes(subcategory)) {
      return {
        brands: sportsFilters.bikeBrands,
        types: sportsFilters.bikeTypes,
        bikeSizes: sportsFilters.bikeSizes,
        features: sportsFilters.bikeFeatures,
        gears: sportsFilters.bikeGears,
      };
    }
    if (subcategory === "אופניים חשמליים") {
      return {
        brands: sportsFilters.eBikeBrands,
        battery: sportsFilters.eBikeBattery,
        range: sportsFilters.eBikeRange,
        motorLocation: sportsFilters.eBikeMotorLocation,
        speed: sportsFilters.eBikeSpeed,
      };
    }
    if (subcategory === "קורקינטים") {
      return {
        types: sportsFilters.scooterTypes,
        speed: sportsFilters.scooterSpeed,
        range: sportsFilters.scooterRange,
        features: sportsFilters.scooterFeatures,
      };
    }
    if (["ציוד כושר ביתי", "משקולות", "הליכונים", "אופני כושר"].includes(subcategory)) {
      return {
        types: sportsFilters.gymEquipTypes,
        brands: sportsFilters.gymBrands,
        features: sportsFilters.gymFeatures,
        maxWeight: sportsFilters.gymMaxWeight,
      };
    }
    if (["גיטרות", "פסנתרים", "תופים"].includes(subcategory)) {
      return {
        types: sportsFilters.instrumentTypes,
        brands: sportsFilters.instrumentBrands,
        instrumentConditions: sportsFilters.instrumentConditions,
        accessories: sportsFilters.instrumentAccessories,
      };
    }
  }

  // Computers subcategories
  if (category === "computers") {
    if (["מחשבים ניידים", "מקבוק", "אולטרה בוק"].includes(subcategory)) {
      return {
        brands: computersFilters.brands,
        processors: computersFilters.processors,
        ramOptions: computersFilters.ramOptions,
        storageOptions: computersFilters.storageOptions,
        storageTypes: computersFilters.storageTypes,
        screenSizes: ["11.6\"", "13.3\"", "14\"", "15.6\"", "16\"", "17.3\""],
        graphicsCards: computersFilters.graphicsCards,
        operatingSystems: computersFilters.operatingSystems,
      };
    }
    if (["מחשבים נייחים", "מחשבי גיימינג", "מחשבים לעבודה"].includes(subcategory)) {
      return {
        brands: computersFilters.brands,
        processors: computersFilters.processors,
        ramOptions: computersFilters.ramOptions,
        storageOptions: computersFilters.storageOptions,
        storageTypes: computersFilters.storageTypes,
        graphicsCards: computersFilters.graphicsCards,
        operatingSystems: computersFilters.operatingSystems,
      };
    }
    if (subcategory === "מסכים") {
      return {
        brands: computersFilters.brands,
        screenSizes: ["24\"", "27\"", "32\"", "34\"", "49\""],
        resolution: ["Full HD (1080p)", "QHD (1440p)", "4K UHD", "5K", "Ultrawide"],
        panelType: ["IPS", "VA", "TN", "OLED"],
        refreshRate: ["60Hz", "75Hz", "144Hz", "165Hz", "240Hz"],
        features: ["G-Sync", "FreeSync", "HDR", "USB-C", "מובנה רמקולים", "מתכוונן גובה"],
      };
    }
    if (["כרטיסי מסך", "מעבדים", "זיכרון RAM", "כוננים", "לוחות אם"].includes(subcategory)) {
      return {
        componentBrands: ["NVIDIA", "AMD", "Intel", "Corsair", "Kingston", "Samsung", "Western Digital", "Seagate", "ASUS", "MSI", "Gigabyte", "אחר"],
        componentCondition: ["חדש באריזה", "כמו חדש", "משומש - עובד מעולה", "משומש - עובד", "לחלקים"],
      };
    }
    if (["מקלדות", "עכברים", "אוזניות"].includes(subcategory)) {
      return {
        peripheralBrands: ["Logitech", "Razer", "SteelSeries", "Corsair", "HyperX", "Microsoft", "Apple", "Sony", "JBL", "אחר"],
        connectivity: ["אלחוטי Bluetooth", "אלחוטי USB", "חוטי USB", "חוטי 3.5mm"],
        features: subcategory === "מקלדות" 
          ? ["מכאנית", "ממברנה", "RGB", "עברית", "נומרית", "ארגונומית"]
          : subcategory === "עכברים"
          ? ["גיימינג", "ארגונומי", "אנכי", "מעקב אופטי", "מעקב לייזר"]
          : ["Over-ear", "On-ear", "In-ear", "מבטלות רעש", "מיקרופון מובנה", "גיימינג"],
      };
    }
    if (subcategory === "טאבלטים") {
      return {
        brands: ["Apple", "Samsung", "Lenovo", "Huawei", "Microsoft", "Amazon", "אחר"],
        screenSizes: ["7-8\"", "9-10\"", "11-12\"", "12\"+"],
        storageOptions: ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"],
        connectivity: ["WiFi בלבד", "WiFi + Cellular"],
      };
    }
  }

  // Phones subcategories
  if (category === "phones") {
    if (["אייפון", "סמסונג גלקסי", "שיאומי", "וואווי", "אופו", "וואן פלוס", "גוגל פיקסל", "נוקיה", "מוטורולה"].includes(subcategory)) {
      return {
        storageOptions: phonesFilters.storageOptions,
        phoneConditions: phonesFilters.conditions,
        ramOptions: phonesFilters.ramOptions,
        screenSizes: phonesFilters.screenSizes,
      };
    }
    if (subcategory === "שעונים חכמים") {
      return {
        brands: ["Apple Watch", "Samsung Galaxy Watch", "Garmin", "Fitbit", "Huawei Watch", "Xiaomi", "אחר"],
        features: ["GPS", "מד דופק", "מד חמצן", "תשלומים", "LTE/Cellular", "עמידות במים"],
        connectivity: ["Bluetooth בלבד", "WiFi + Bluetooth", "LTE + WiFi + Bluetooth"],
      };
    }
    if (subcategory === "אוזניות אלחוטיות") {
      return {
        brands: ["Apple AirPods", "Samsung Galaxy Buds", "Sony", "Jabra", "Bose", "JBL", "Beats", "אחר"],
        type: ["True Wireless", "Neckband", "Over-ear אלחוטיות"],
        features: ["מבטלות רעש (ANC)", "מצב שקיפות", "עמידות מים", "טעינה אלחוטית"],
      };
    }
    if (["מטענים", "כיסויים", "מגני מסך", "סוללות חיצוניות"].includes(subcategory)) {
      return {
        compatibility: ["iPhone", "Samsung", "אוניברסלי", "USB-C", "Lightning", "Micro USB"],
      };
    }
  }

  // Fashion subcategories
  if (category === "fashion") {
    if (subcategory === "חולצות") {
      return { types: fashionFilters.shirtTypes, materials: fashionFilters.materials };
    }
    if (subcategory === "מכנסיים") {
      return { types: fashionFilters.pantsTypes, materials: fashionFilters.materials };
    }
    if (["שמלות", "חצאיות"].includes(subcategory)) {
      return { types: fashionFilters.dressTypes, materials: fashionFilters.materials };
    }
    if (subcategory === "מעילים") {
      return { types: fashionFilters.coatTypes, materials: fashionFilters.materials };
    }
    if (["נעלי ספורט", "נעלי עקב", "סנדלים", "מגפיים"].includes(subcategory)) {
      return {
        shoeBrands: fashionFilters.shoeBrands,
        shoeSizes: fashionFilters.shoeSizes,
        types: fashionFilters.shoeTypes,
        width: fashionFilters.shoeWidth,
      };
    }
    if (["תיקי יד", "תיקי גב"].includes(subcategory)) {
      return {
        types: fashionFilters.bagTypes,
        bagBrands: fashionFilters.bagBrands,
        bagMaterials: fashionFilters.bagMaterials,
        bagSizes: fashionFilters.bagSizes,
      };
    }
    if (subcategory === "תכשיטים") {
      return {
        types: fashionFilters.jewelryTypes,
        jewelryMaterials: fashionFilters.jewelryMaterials,
        stones: fashionFilters.jewelryStones,
      };
    }
    if (subcategory === "שעונים") {
      return {
        types: fashionFilters.watchTypes,
        watchBrands: fashionFilters.watchBrands,
      };
    }
  }

  // Baby & Kids subcategories
  if (category === "baby") {
    if (["עגלות", "טיולונים"].includes(subcategory)) {
      return {
        brands: babyKidsFilters.strollerBrands,
        types: babyKidsFilters.strollerTypes,
        features: babyKidsFilters.strollerFeatures,
        weight: babyKidsFilters.strollerWeight,
        maxAge: babyKidsFilters.strollerMaxAge,
      };
    }
    if (["מיטות תינוק", "עריסות"].includes(subcategory)) {
      return {
        types: babyKidsFilters.cribTypes,
        cribSizes: babyKidsFilters.cribSizes,
        features: babyKidsFilters.cribFeatures,
        cribMaterial: babyKidsFilters.cribMaterial,
      };
    }
    if (subcategory === "כיסאות אוכל") {
      return {
        types: babyKidsFilters.highChairTypes,
        brands: babyKidsFilters.feedingBrands,
        features: babyKidsFilters.highChairFeatures,
      };
    }
    if (["צעצועי התפתחות", "משחקי בנייה"].includes(subcategory)) {
      return {
        ageGroups: babyKidsFilters.toyAgeGroups,
        types: babyKidsFilters.toyTypes,
        brands: babyKidsFilters.toyBrands,
        toyCondition: babyKidsFilters.toyCondition,
        features: babyKidsFilters.toyFeatures,
      };
    }
    if (["בגדי תינוקות (0-2)", "בגדי ילדים (2-6)", "בגדי ילדים (6-12)"].includes(subcategory)) {
      return {
        brands: babyKidsFilters.babyClothBrands,
        clothingConditions: babyKidsFilters.clothingConditions,
      };
    }
  }

  return {};
};

// Map category URL slug to Hebrew name
export const categorySlugToHebrew: Record<string, string> = {
  "furniture": "ריהוט",
  "electronics": "מוצרי חשמל",
  "computers": "מחשבים",
  "phones": "מכשירים סלולריים",
  "sports": "ספורט ופנאי",
  "fashion": "אופנה",
  "kids": "תינוקות וילדים",
};

// Map Hebrew category to URL slug
export const categoryHebrewToSlug: Record<string, string> = {
  "ריהוט": "furniture",
  "מוצרי חשמל": "electronics",
  "מחשבים": "computers",
  "מכשירים סלולריים": "phones",
  "ספורט ופנאי": "sports",
  "אופנה": "fashion",
  "תינוקות וילדים": "kids",
};
