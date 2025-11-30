import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const reviewSchema = z.object({
  rating: z.number().min(1, "יש לבחור דירוג").max(5),
  comment: z
    .string()
    .trim()
    .min(10, "הביקורת חייבת להכיל לפחות 10 תווים")
    .max(1000, "הביקורת חייבת להכיל עד 1000 תווים"),
  accuracy_rating: z.number().min(1).max(5).optional(),
  communication_rating: z.number().min(1).max(5).optional(),
  transaction_id: z.string().trim().max(100).optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface SellerReviewFormProps {
  sellerId: string;
  onReviewSubmitted: () => void;
}

export const SellerReviewForm = ({
  sellerId,
  onReviewSubmitted,
}: SellerReviewFormProps) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hoveredAccuracy, setHoveredAccuracy] = useState(0);
  const [hoveredCommunication, setHoveredCommunication] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      accuracy_rating: 0,
      communication_rating: 0,
      transaction_id: "",
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("יש להתחבר כדי להוסיף ביקורת");
        return;
      }

      const { error } = await supabase.from("seller_reviews").insert({
        seller_id: sellerId,
        reviewer_id: user.id,
        rating: data.rating,
        comment: data.comment,
        accuracy_rating: data.accuracy_rating || null,
        communication_rating: data.communication_rating || null,
        transaction_id: data.transaction_id || null,
      });

      if (error) throw error;

      toast.success("הביקורת נוספה בהצלחה!");
      form.reset();
      onReviewSubmitted();
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error("שגיאה בהוספת הביקורת");
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingStars = ({
    value,
    onChange,
    hovered,
    onHover,
    label,
  }: {
    value: number;
    onChange: (value: number) => void;
    hovered: number;
    onHover: (value: number) => void;
    label: string;
  }) => (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => onHover(star)}
            onMouseLeave={() => onHover(0)}
            className="focus:outline-none"
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                star <= (hovered || value)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6">כתוב ביקורת</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RatingStars
                    value={field.value}
                    onChange={field.onChange}
                    hovered={hoveredRating}
                    onHover={setHoveredRating}
                    label="דירוג כללי *"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="accuracy_rating"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RatingStars
                      value={field.value || 0}
                      onChange={field.onChange}
                      hovered={hoveredAccuracy}
                      onHover={setHoveredAccuracy}
                      label="דיוק התיאור (אופציונלי)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="communication_rating"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RatingStars
                      value={field.value || 0}
                      onChange={field.onChange}
                      hovered={hoveredCommunication}
                      onHover={setHoveredCommunication}
                      label="תקשורת (אופציונלי)"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="transaction_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>מזהה עסקה (אופציונלי)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="הזן מזהה עסקה אם קיים" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>הביקורת שלך *</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="שתף את החוויה שלך עם המוכר..."
                    className="min-h-[120px] resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "שולח..." : "פרסם ביקורת"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};
