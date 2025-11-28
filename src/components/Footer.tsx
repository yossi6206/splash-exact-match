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
    "אודות שוק יד שנייה",
    "צור קשר",
    "מדיניות פרטיות",
    "תנאי שימוש",
    "נגישות",
    "מרכז עזרה"
  ];

  return (
    <footer className="bg-gradient-to-br from-muted/50 via-background to-muted/50 border-t border-border/50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Social - Center */}
          <div className="lg:col-span-1 text-center space-y-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-primary mb-3">שוק יד שנייה</h3>
              <p className="text-foreground/70 text-sm leading-relaxed max-w-xs mx-auto">
                הפלטפורמה המובילה למכירה וקנייה בישראל. מחברים בין אלפי משתמשים מדי יום.
              </p>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex gap-3 justify-center flex-wrap">
              <a 
                href="#" 
                className="w-11 h-11 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-11 h-11 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-11 h-11 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-11 h-11 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="text-right">
            <h4 className="text-lg font-bold text-foreground mb-5 border-b border-border/30 pb-3">קטגוריות פופולריות</h4>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <a 
                    href="#" 
                    className="text-foreground/70 hover:text-primary transition-colors duration-200 text-sm inline-block hover:translate-x-1"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Help Links */}
          <div className="text-right">
            <h4 className="text-lg font-bold text-foreground mb-5 border-b border-border/30 pb-3">אודות ועזרה</h4>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-foreground/70 hover:text-primary transition-colors duration-200 text-sm inline-block hover:translate-x-1"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="text-right">
            <h4 className="text-lg font-bold text-foreground mb-5 border-b border-border/30 pb-3">צור קשר</h4>
            <div className="space-y-4">
              <a href="mailto:info@shook-yad2.co.il" className="flex items-center gap-3 justify-end text-foreground/70 hover:text-primary transition-colors group">
                <span className="text-sm">info@shook-yad2.co.il</span>
                <div className="w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
              </a>
              <a href="tel:03-1234567" className="flex items-center gap-3 justify-end text-foreground/70 hover:text-primary transition-colors group">
                <span className="text-sm">03-1234567</span>
                <div className="w-10 h-10 rounded-full bg-secondary/10 group-hover:bg-secondary/20 flex items-center justify-center transition-colors">
                  <Phone className="w-5 h-5 text-secondary" />
                </div>
              </a>
              <div className="flex items-center gap-3 justify-end text-foreground/70">
                <span className="text-sm">תל אביב, ישראל</span>
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 text-center">
            <p className="text-foreground/60 text-sm order-2 md:order-1">
              © {currentYear} שוק יד שנייה. כל הזכויות שמורות.
            </p>
            <div className="flex gap-4 text-sm order-1 md:order-2 flex-wrap justify-center">
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors whitespace-nowrap">
                מדיניות פרטיות
              </a>
              <span className="text-foreground/30">•</span>
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors whitespace-nowrap">
                תנאי שימוש
              </a>
              <span className="text-foreground/30">•</span>
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors whitespace-nowrap">
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
