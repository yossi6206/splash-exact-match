import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase, X, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { createValidatedChangeHandler, freelancerValidationConfig } from "@/utils/formValidation";

const freelancerSchema = z.object({
  full_name: z.string().trim().min(2, "שם מלא חובה").max(100, "שם ארוך מדי"),
  title: z.string().trim().min(3, "כותרת חייבת להכיל לפחות 3 תווים").max(200, "כותרת ארוכה מדי"),
  category: z.string().min(1, "קטגוריה חובה"),
  hourly_rate: z.number().int().min(30, "תעריף מינימלי 30 ₪").max(5000, "תעריף מקסימלי 5000 ₪"),
  bio: z.string().trim().min(50, "תיאור חייב להכיל לפחות 50 תווים").max(3000, "תיאור ארוך מדי").optional().or(z.literal("")),
  location: z.string().trim().min(2, "מיקום חובה").optional().or(z.literal("")),
  experience_years: z.number().int().min(0, "ניסיון לא יכול להיות שלילי").max(50, "ניסיון גבוה מדי").optional(),
  portfolio_url: z.string().trim().url("כתובת אתר לא תקינה").optional().or(z.literal("")),
  availability: z.string().min(1, "זמינות חובה"),
});

const PostFreelancer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const [formData, setFormData] = useState({
    full_name: "",
    title: "",
    category: "",
    hourly_rate: "",
    bio: "",
    location: "",
    experience_years: "",
    portfolio_url: "",
    availability: "available",
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);

  const categories = [
    "עיצוב גרפי",
    "פיתוח ווב ואפליקציות",
    "כתיבה ותוכן",
    "שיווק דיגיטלי",
    "עריכת וידאו ואנימציה",
    "צילום ועריכת תמונות",
    "ייעוץ עסקי",
    "תרגום",
    "הפקת אודיו",
  ];

  const availableLanguages = ["עברית", "אנגלית", "ערבית", "רוסית", "צרפתית", "ספרדית"];

  const locations = [
    "תל אביב-יפו",
    "ירושלים",
    "חיפה",
    "באר שבע",
    "מרכז",
    "דרום",
    "צפון",
    "עבודה מרחוק",
  ];

  const handleInputChange = createValidatedChangeHandler(setFormData, formData, freelancerValidationConfig);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("גודל התמונה מוגבל ל-5MB");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleLanguageToggle = (language: string) => {
    setLanguages((prev) =>
      prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("עליך להתחבר כדי לפרסם פרופיל פרילנסר");
      navigate("/auth");
      return;
    }

    if (skills.length === 0) {
      toast.error("נא להוסיף לפחות מיומנות אחת");
      return;
    }

    try {
      setLoading(true);

      // Validate form data
      const validatedData = freelancerSchema.parse({
        full_name: formData.full_name,
        title: formData.title,
        category: formData.category,
        hourly_rate: parseInt(formData.hourly_rate),
        bio: formData.bio,
        location: formData.location,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
        portfolio_url: formData.portfolio_url,
        availability: formData.availability,
      });

      // Upload avatar if exists
      let avatarUrl = null;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, avatarFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        avatarUrl = publicUrl;
      }

      // Insert freelancer
      const { error } = await supabase
        .from("freelancers")
        .insert({
          user_id: user.id,
          full_name: validatedData.full_name,
          title: validatedData.title,
          category: validatedData.category,
          location: validatedData.location || null,
          hourly_rate: validatedData.hourly_rate,
          experience_years: validatedData.experience_years || null,
          availability: validatedData.availability,
          portfolio_url: validatedData.portfolio_url || null,
          avatar_url: avatarUrl,
          bio: validatedData.bio || null,
          skills: skills,
          languages: languages,
        });

      if (error) throw error;

      toast.success("הפרופיל נפרסם בהצלחה!");
      navigate("/dashboard/my-ads");
    } catch (error: any) {
      console.error("Error posting freelancer:", error);
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
      } else {
        toast.error(error.message || "שגיאה בפרסום הפרופיל");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">פרסם פרופיל פרילנסר</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          הצג את כישוריך והתחל לקבל הצעות עבודה מלקוחות פוטנציאליים
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card className="p-6 bg-white border-2">
          <h2 className="text-xl font-bold text-foreground mb-4">פרטים אישיים</h2>

          <div className="space-y-4">
            {/* Avatar Upload */}
            <div>
              <Label htmlFor="avatar">תמונת פרופיל (אופציונלי)</Label>
              <div className="flex items-center gap-4 mt-2">
                {avatarPreview && (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border">
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    גודל מקסימלי: 5MB
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">
                  שם מלא <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="שם ושם משפחה"
                  required
                  dir="rtl"
                />
              </div>

              <div>
                <Label htmlFor="title">
                  כותרת מקצועית <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="לדוגמה: מעצב גרפי בעל ניסיון"
                  required
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">
                  קטגוריה <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger id="category" dir="rtl">
                    <SelectValue placeholder="בחר קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">מיקום</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                >
                  <SelectTrigger id="location" dir="rtl">
                    <SelectValue placeholder="בחר מיקום" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hourly_rate">
                  תעריף לשעה (₪) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="hourly_rate"
                  name="hourly_rate"
                  type="number"
                  value={formData.hourly_rate}
                  onChange={handleInputChange}
                  placeholder="150"
                  required
                  min="30"
                  max="5000"
                  dir="rtl"
                />
              </div>

              <div>
                <Label htmlFor="experience_years">שנות ניסיון</Label>
                <Input
                  id="experience_years"
                  name="experience_years"
                  type="number"
                  value={formData.experience_years}
                  onChange={handleInputChange}
                  placeholder="5"
                  min="0"
                  max="50"
                  dir="rtl"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="availability">
                זמינות <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.availability}
                onValueChange={(value) => setFormData({ ...formData, availability: value })}
                required
              >
                <SelectTrigger id="availability" dir="rtl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">זמין</SelectItem>
                  <SelectItem value="busy">עסוק</SelectItem>
                  <SelectItem value="unavailable">לא זמין</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="portfolio_url">קישור לתיק עבודות / אתר אישי</Label>
              <Input
                id="portfolio_url"
                name="portfolio_url"
                type="url"
                value={formData.portfolio_url}
                onChange={handleInputChange}
                placeholder="https://example.com/portfolio"
                dir="ltr"
              />
            </div>

            <div>
              <Label htmlFor="bio">תיאור מקצועי</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="ספר על עצמך, הניסיון שלך, והשירותים שאתה מציע..."
                rows={6}
                className="resize-none"
                dir="rtl"
              />
              <p className="text-xs text-muted-foreground mt-1">
                מינימום 50 תווים (מומלץ 100-300 תווים)
              </p>
            </div>
          </div>
        </Card>

        {/* Skills */}
        <Card className="p-6 bg-white border-2">
          <h2 className="text-xl font-bold text-foreground mb-4">
            מיומנויות <span className="text-destructive">*</span>
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="הוסף מיומנות (לדוגמה: Photoshop, React, כתיבה שיווקית)"
                dir="rtl"
              />
              <Button type="button" onClick={addSkill} variant="outline">
                הוסף
              </Button>
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-primary/10 text-primary px-3 py-1.5 rounded-full flex items-center gap-2"
                  >
                    <span className="text-sm font-medium">{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {skills.length === 0 && (
              <p className="text-sm text-muted-foreground">הוסף לפחות מיומנות אחת</p>
            )}
          </div>
        </Card>

        {/* Languages */}
        <Card className="p-6 bg-white border-2">
          <h2 className="text-xl font-bold text-foreground mb-4">שפות</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {availableLanguages.map((language) => (
              <div key={language} className="flex items-center gap-2">
                <Checkbox
                  id={`lang-${language}`}
                  checked={languages.includes(language)}
                  onCheckedChange={() => handleLanguageToggle(language)}
                />
                <Label htmlFor={`lang-${language}`} className="cursor-pointer">
                  {language}
                </Label>
              </div>
            ))}
          </div>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" size="lg" disabled={loading} className="flex-1">
            {loading ? "מפרסם..." : "פרסם פרופיל"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => navigate("/freelancers")}
            disabled={loading}
          >
            ביטול
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostFreelancer;
