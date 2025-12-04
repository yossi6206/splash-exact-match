import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Send } from "lucide-react";
import logoNew from "@/assets/logo-new.png";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


const newsletterSchema = z.object({
  email: z.string().email({ message: "כתובת אימייל לא תקינה" }).max(255),
});

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const categories = [
    "נדל\"ן",
    "רכב",
    "יד שניה",
    "דרושים",
    "עסקים למכירה",
    "בגדי מקצוע"
  ];

  const aboutLinks = [
    "אודות SecondHandPro",
    "צור קשר",
    "מדיניות פרטיות",
    "תנאי שימוש",
    "נגישות",
    "מרכז עזרה"
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate email
      const result = newsletterSchema.safeParse({ email });
      if (!result.success) {
        toast({
          title: "שגיאה",
          description: result.error.errors[0].message,
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);

      const { error } = await supabase
        .from("newsletter_subscriptions")
        .insert([{ email: email.trim().toLowerCase() }]);

      if (error) {
        if (error.code === "23505") { // Unique constraint violation
          toast({
            title: "כבר רשום",
            description: "כתובת האימייל כבר רשומה לניוזלטר שלנו",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "תודה על ההרשמה!",
          description: "נשלח לך עדכונים למייל שלך",
        });
        setEmail("");
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast({
        title: "שגיאה",
        description: "משהו השתבש. אנא נסה שוב מאוחר יותר",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-muted/50 via-background to-muted/50 border-t border-border/50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Social - Center */}
          <div className="lg:col-span-1 text-center space-y-6">
            <div>
              <img 
                src={logoNew} 
                alt="SecondHandPro" 
                className="h-12 w-auto object-contain mx-auto mb-3"
              />
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
              <a href="mailto:info@secondhandpro.co.il" className="flex items-center gap-3 justify-end text-foreground/70 hover:text-primary transition-colors group">
                <span className="text-sm">info@secondhandpro.co.il</span>
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

        {/* Newsletter Signup Section */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="max-w-xl mx-auto text-center">
            <div className="mb-4">
              <h4 className="text-xl font-bold text-foreground mb-2">הישארו מעודכנים</h4>
              <p className="text-foreground/70 text-sm">
                הירשמו לניוזלטר שלנו וקבלו עדכונים על מוצרים חדשים, טיפים ומבצעים מיוחדים
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="w-4 h-4 ml-2" />
                הרשמה
              </Button>
              <Input
                type="email"
                placeholder="הכנס את כתובת המייל שלך"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                className="flex-1 text-right"
              />
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 text-center">
            <p className="text-foreground/60 text-sm order-2 md:order-1">
              © {currentYear} SecondHandPro. כל הזכויות שמורות.
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
