import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FreelancerReviewFormProps {
  freelancerId: string;
  onReviewSubmitted: () => void;
}

const FreelancerReviewForm = ({ freelancerId, onReviewSubmitted }: FreelancerReviewFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    comment: "",
    projectType: "",
    rating: 0,
    workQuality: 0,
    communication: 0,
    professionalism: 0,
    deadline: 0
  });

  const RatingInput = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: number; 
    onChange: (rating: number) => void;
  }) => {
    return (
      <div className="space-y-2">
        <Label className="text-sm text-right block">{label}</Label>
        <div className="flex gap-1 justify-end flex-row-reverse">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-7 h-7 ${
                  star <= value
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast({
        title: "שגיאה",
        description: "יש לבחור דירוג כללי",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "נדרש התחברות",
          description: "יש להתחבר כדי להוסיף ביקורת",
          variant: "destructive"
        });
        return;
      }

      // Get user profile for name
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const { error } = await supabase
        .from("freelancer_reviews")
        .insert({
          freelancer_id: freelancerId,
          reviewer_id: user.id,
          reviewer_name: profile?.full_name || "משתמש אנונימי",
          rating: formData.rating,
          title: formData.title,
          comment: formData.comment,
          project_type: formData.projectType || null,
          work_quality_rating: formData.workQuality || null,
          communication_rating: formData.communication || null,
          professionalism_rating: formData.professionalism || null,
          deadline_rating: formData.deadline || null
        });

      if (error) throw error;

      toast({
        title: "הביקורת נוספה בהצלחה!",
        description: "תודה על המשוב שלך"
      });

      // Reset form
      setFormData({
        title: "",
        comment: "",
        projectType: "",
        rating: 0,
        workQuality: 0,
        communication: 0,
        professionalism: 0,
        deadline: 0
      });

      onReviewSubmitted();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "שגיאה",
        description: "לא ניתן להוסיף ביקורת",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">כתוב ביקורת</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Overall Rating */}
          <RatingInput
            label="דירוג כללי *"
            value={formData.rating}
            onChange={(rating) => setFormData({ ...formData, rating })}
          />

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-right block">כותרת הביקורת *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="למשל: עבודה מעולה ומקצועית"
              required
              className="text-right"
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-right block">הביקורת שלך *</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="שתף את החוויה שלך מהעבודה עם הפרילנסר..."
              rows={5}
              required
              className="text-right"
            />
          </div>

          {/* Project Type */}
          <div className="space-y-2">
            <Label htmlFor="projectType" className="text-right block">סוג הפרויקט</Label>
            <Input
              id="projectType"
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              placeholder="למשל: פיתוח אתר, עיצוב לוגו"
              className="text-right"
            />
          </div>

          {/* Detailed Ratings */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-semibold text-sm text-right">דירוגים מפורטים (אופציונלי)</h4>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <RatingInput
                label="איכות עבודה"
                value={formData.workQuality}
                onChange={(rating) => setFormData({ ...formData, workQuality: rating })}
              />
              
              <RatingInput
                label="תקשורת"
                value={formData.communication}
                onChange={(rating) => setFormData({ ...formData, communication: rating })}
              />
              
              <RatingInput
                label="מקצועיות"
                value={formData.professionalism}
                onChange={(rating) => setFormData({ ...formData, professionalism: rating })}
              />
              
              <RatingInput
                label="עמידה בזמנים"
                value={formData.deadline}
                onChange={(rating) => setFormData({ ...formData, deadline: rating })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "שולח..." : "פרסם ביקורת"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FreelancerReviewForm;
