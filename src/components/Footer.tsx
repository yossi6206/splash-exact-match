import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const categories = [
    "נדל\"ן",
    "רכב",
    "יד שניה",
    "דרושים",
    "עסקים למכירה",
    "בגדי מקצוע"
  ];

  const aboutLinks = [
    "אודות יד2",
    "צור קשר",
    "מדיניות פרטיות",
    "תנאי שימוש",
    "נגישות"
  ];

  const helpLinks = [
    "מרכז עזרה",
    "איך לפרסם מודעה",
    "טיפים למכירה",
    "שאלות נפוצות"
  ];

  return (
    <footer className="bg-gradient-to-br from-muted via-background to-muted border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="text-right">
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">יד2</h3>
            <p className="text-foreground/70 mb-6 leading-relaxed">
              הפלטפורמה המובילה למכירה וקנייה בישראל. מחברים בין אלפי משתמשים מדי יום.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-3 justify-end">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-secondary/10 hover:bg-secondary hover:text-secondary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-accent/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="text-right">
            <h4 className="text-lg font-bold text-foreground mb-4">קטגוריות פופולריות</h4>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <a 
                    href="#" 
                    className="text-foreground/70 hover:text-primary transition-colors duration-200 hover:underline"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Help Links */}
          <div className="text-right">
            <h4 className="text-lg font-bold text-foreground mb-4">אודות ועזרה</h4>
            <ul className="space-y-2 mb-6">
              {aboutLinks.map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-foreground/70 hover:text-primary transition-colors duration-200 hover:underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-foreground/70 hover:text-secondary transition-colors duration-200 hover:underline"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="text-right">
            <h4 className="text-lg font-bold text-foreground mb-4">צור קשר</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 justify-end text-foreground/70">
                <span>info@yad2.co.il</span>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-3 justify-end text-foreground/70">
                <span>03-1234567</span>
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-secondary" />
                </div>
              </div>
              <div className="flex items-center gap-3 justify-end text-foreground/70">
                <span>תל אביב, ישראל</span>
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-right">
            <p className="text-foreground/60 text-sm">
              © {currentYear} יד2. כל הזכויות שמורות.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                מדיניות פרטיות
              </a>
              <span className="text-foreground/40">|</span>
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                תנאי שימוש
              </a>
              <span className="text-foreground/40">|</span>
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors">
                הסכם משתמש
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
