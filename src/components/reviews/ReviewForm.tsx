import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RatingStars } from "./RatingStars";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number().min(1, "יש לבחור דירוג").max(5),
  title: z.string().trim().min(3, "הכותרת חייבת להכיל לפחות 3 תווים").max(100, "הכותרת ארוכה מדי"),
  comment: z.string().trim().min(10, "הביקורת חייבת להכיל לפחות 10 תווים").max(1000, "הביקורת ארוכה מדי")
});

interface ReviewFormProps {
  onSubmit: (review: { rating: number; title: string; comment: string }) => void;
  isSubmitting?: boolean;
}

export const ReviewForm = ({ onSubmit, isSubmitting = false }: ReviewFormProps) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = reviewSchema.parse({ rating, title, comment });
      setErrors({});
      onSubmit({
        rating: validated.rating,
        title: validated.title,
        comment: validated.comment
      });
      
      // Reset form
      setRating(0);
      setTitle("");
      setComment("");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        
        toast({
          title: "שגיאה בטופס",
          description: "אנא תקן את השגיאות בטופס",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">כתוב ביקורת</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label>דירוג כולל *</Label>
            <div>
              <RatingStars
                rating={rating}
                interactive
                size="lg"
                onRatingChange={setRating}
              />
              {errors.rating && (
                <p className="text-sm text-destructive mt-1">{errors.rating}</p>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">כותרת הביקורת *</Label>
            <Input
              id="title"
              placeholder="סכם את הביקורת שלך במשפט אחד"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">הביקורת שלך *</Label>
            <Textarea
              id="comment"
              placeholder="ספר לנו על החוויה שלך עם המוצר..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              maxLength={1000}
              className={errors.comment ? "border-destructive" : ""}
            />
            <div className="flex justify-between items-center">
              {errors.comment ? (
                <p className="text-sm text-destructive">{errors.comment}</p>
              ) : (
                <div />
              )}
              <span className="text-sm text-muted-foreground">
                {comment.length}/1000
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "שולח..." : "פרסם ביקורת"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};