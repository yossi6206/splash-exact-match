import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

const jobSchema = z.object({
  company_name: z.string().trim().min(2, "שם חברה חייב להכיל לפחות 2 תווים").max(200, "שם חברה ארוך מדי"),
  title: z.string().trim().min(3, "כותרת משרה חייבת להכיל לפחות 3 תווים").max(200, "כותרת משרה ארוכה מדי"),
  location: z.string().trim().min(2, "מיקום חייב להכיל לפחות 2 תווים").max(200, "מיקום ארוך מדי"),
  description: z.string().trim().min(20, "תיאור המשרה חייב להכיל לפחות 20 תווים").max(10000, "תיאור המשרה ארוך מדי"),
  salary_min: z.number().int().min(0, "משכורת לא יכולה להיות שלילית").max(1000000, "משכורת גבוהה מדי").optional(),
  salary_max: z.number().int().min(0, "משכורת לא יכולה להיות שלילית").max(1000000, "משכורת גבוהה מדי").optional(),
  experience_min: z.number().int().min(0, "ניסיון לא יכול להיות שלילי").max(50, "ניסיון גבוה מדי").optional(),
  experience_max: z.number().int().min(0, "ניסיון לא יכול להיות שלילי").max(50, "ניסיון גבוה מדי").optional(),
  requirements: z.array(z.string().trim().min(1).max(500)).min(1, "חובה להוסיף לפחות דרישה אחת").max(20, "יותר מדי דרישות"),
}).refine((data) => !data.salary_min || !data.salary_max || data.salary_min <= data.salary_max, {
  message: "משכורת מינימלית חייבת להיות נמוכה או שווה למשכורת מקסימלית",
  path: ["salary_max"],
}).refine((data) => !data.experience_min || !data.experience_max || data.experience_min <= data.experience_max, {
  message: "ניסיון מינימלי חייב להיות נמוך או שווה לניסיון מקסימלי",
  path: ["experience_max"],
});

const PostJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    company_name: "",
    company_size: "",
    industry: "",
    title: "",
    location: "",
    job_type: "משרה מלאה",
    scope: "היברידי",
    salary_min: "",
    salary_max: "",
    experience_min: "",
    experience_max: "",
    description: "",
  });

  const [requirements, setRequirements] = useState<string[]>([""]);
  const [niceToHave, setNiceToHave] = useState<string[]>([""]);
  const [benefits, setBenefits] = useState<string[]>([""]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Validate location and company_name - only letters (Hebrew/English), spaces, and hyphens allowed
    if (name === "location" || name === "company_name") {
      if (value && !/^[\u0590-\u05FFa-zA-Z\s\-׳'"״]+$/.test(value)) {
        const fieldNames: Record<string, string> = {
          location: "מיקום",
          company_name: "שם החברה"
        };
        toast.error(`בשדה ${fieldNames[name]} ניתן להזין רק אותיות`);
        return;
      }
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleArrayChange = (
    index: number,
    value: string,
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);
  };

  const addArrayItem = (
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setArray([...array, ""]);
  };

  const removeArrayItem = (
    index: number,
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (array.length > 1) {
      const newArray = array.filter((_, i) => i !== index);
      setArray(newArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("עליך להתחבר כדי לפרסם משרה");
      navigate("/auth");
      return;
    }

    // Validate form data
    const filteredRequirements = requirements.filter((r) => r.trim() !== "");
    const filteredNiceToHave = niceToHave.filter((n) => n.trim() !== "");
    const filteredBenefits = benefits.filter((b) => b.trim() !== "");

    try {
      jobSchema.parse({
        company_name: formData.company_name,
        title: formData.title,
        location: formData.location,
        description: formData.description,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : undefined,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : undefined,
        experience_min: formData.experience_min ? parseInt(formData.experience_min) : undefined,
        experience_max: formData.experience_max ? parseInt(formData.experience_max) : undefined,
        requirements: filteredRequirements,
      });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        toast.error(validationError.errors[0].message);
        return;
      }
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.from("jobs").insert({
        user_id: user.id,
        company_name: formData.company_name,
        company_size: formData.company_size || null,
        industry: formData.industry || null,
        title: formData.title,
        location: formData.location,
        job_type: formData.job_type,
        scope: formData.scope,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        experience_min: formData.experience_min ? parseInt(formData.experience_min) : null,
        experience_max: formData.experience_max ? parseInt(formData.experience_max) : null,
        description: formData.description,
        requirements: filteredRequirements,
        nice_to_have: filteredNiceToHave,
        benefits: filteredBenefits,
        status: "active",
      }).select();

      if (error) throw error;

      toast.success("המשרה פורסמה בהצלחה!");
      navigate("/dashboard/my-jobs");
    } catch (error: any) {
      console.error("Error posting job:", error);
      toast.error("שגיאה בפרסום המשרה: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-primary" />
          פרסם משרה חדשה
        </h1>
        <p className="text-muted-foreground">
          מלא את הפרטים למטה ופרסם משרה חדשה באתר
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Details */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">פרטי החברה</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">שם החברה *</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  required
                  placeholder="טכנולוגיות עתיד בע״מ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_size">גודל החברה</Label>
                <Select
                  value={formData.company_size}
                  onValueChange={(value) =>
                    setFormData({ ...formData, company_size: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר גודל חברה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 עובדים</SelectItem>
                    <SelectItem value="11-50">11-50 עובדים</SelectItem>
                    <SelectItem value="51-200">51-200 עובדים</SelectItem>
                    <SelectItem value="201-500">201-500 עובדים</SelectItem>
                    <SelectItem value="501-1000">501-1000 עובדים</SelectItem>
                    <SelectItem value="1000+">1000+ עובדים</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">תחום</Label>
              <Input
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                placeholder="טכנולוגיה, פיננסים, שיווק..."
              />
            </div>
          </div>
        </Card>

        {/* Job Details */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">פרטי המשרה</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">כותרת המשרה *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="מפתח.ת Full Stack"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">מיקום *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="תל אביב"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job_type">סוג משרה *</Label>
                <Select
                  value={formData.job_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, job_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="משרה מלאה">משרה מלאה</SelectItem>
                    <SelectItem value="משרה חלקית">משרה חלקית</SelectItem>
                    <SelectItem value="פרילנס">פרילנס</SelectItem>
                    <SelectItem value="קבלן">קבלן</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scope">אופן עבודה *</Label>
                <Select
                  value={formData.scope}
                  onValueChange={(value) =>
                    setFormData({ ...formData, scope: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="היברידי">היברידי</SelectItem>
                    <SelectItem value="במשרד">במשרד</SelectItem>
                    <SelectItem value="עבודה מרחוק">עבודה מרחוק</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>טווח שכר (₪)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    name="salary_min"
                    type="number"
                    value={formData.salary_min}
                    onChange={handleInputChange}
                    placeholder="מינימום"
                  />
                  <span>-</span>
                  <Input
                    name="salary_max"
                    type="number"
                    value={formData.salary_max}
                    onChange={handleInputChange}
                    placeholder="מקסימום"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>ניסיון (שנים)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    name="experience_min"
                    type="number"
                    value={formData.experience_min}
                    onChange={handleInputChange}
                    placeholder="מינימום"
                  />
                  <span>-</span>
                  <Input
                    name="experience_max"
                    type="number"
                    value={formData.experience_max}
                    onChange={handleInputChange}
                    placeholder="מקסימום"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">תיאור המשרה *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder="תאר את המשרה, הצוות, והאתגרים..."
              />
            </div>
          </div>
        </Card>

        {/* Requirements */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">דרישות התפקיד</h2>
          <div className="space-y-3">
            {requirements.map((req, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={req}
                  onChange={(e) =>
                    handleArrayChange(index, e.target.value, requirements, setRequirements)
                  }
                  placeholder={`דרישה ${index + 1}`}
                />
                {requirements.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem(index, requirements, setRequirements)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem(requirements, setRequirements)}
              className="w-full"
            >
              <Plus className="w-4 h-4 ml-2" />
              הוסף דרישה
            </Button>
          </div>

          <Separator className="my-6" />

          <h3 className="text-lg font-bold text-foreground mb-4">יתרון משמעותי</h3>
          <div className="space-y-3">
            {niceToHave.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) =>
                    handleArrayChange(index, e.target.value, niceToHave, setNiceToHave)
                  }
                  placeholder={`יתרון ${index + 1}`}
                />
                {niceToHave.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem(index, niceToHave, setNiceToHave)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem(niceToHave, setNiceToHave)}
              className="w-full"
            >
              <Plus className="w-4 h-4 ml-2" />
              הוסף יתרון
            </Button>
          </div>
        </Card>

        {/* Benefits */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">מה אנחנו מציעים</h2>
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={benefit}
                  onChange={(e) =>
                    handleArrayChange(index, e.target.value, benefits, setBenefits)
                  }
                  placeholder={`הטבה ${index + 1}`}
                />
                {benefits.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeArrayItem(index, benefits, setBenefits)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem(benefits, setBenefits)}
              className="w-full"
            >
              <Plus className="w-4 h-4 ml-2" />
              הוסף הטבה
            </Button>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" size="lg" className="flex-1" disabled={loading}>
            {loading ? "מפרסם..." : "פרסם משרה"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => navigate("/dashboard")}
          >
            ביטול
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
