import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ReportListingDialogProps {
  itemId: string;
  itemType: "car" | "property" | "laptop" | "secondhand" | "job" | "business" | "freelancer";
}

const reportReasons = [
  { value: "inappropriate", label: "תוכן לא הולם" },
  { value: "fraud", label: "חשד להונאה" },
  { value: "misleading-price", label: "מחיר מטעה" },
  { value: "false-description", label: "תיאור שקרי" },
  { value: "duplicate", label: "מודעה כפולה" },
  { value: "sold", label: "המוצר כבר נמכר" },
  { value: "other", label: "סיבה אחרת" },
];

export const ReportListingDialog = ({ itemId, itemType }: ReportListingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("נא לבחור סיבת דיווח");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("reports" as any)
        .insert({
          item_id: itemId,
          item_type: itemType,
          reason,
          details,
          reporter_id: user?.id || null,
        });

      if (error) throw error;

      toast.success("הדיווח נשלח בהצלחה. תודה על ההתראה!");
      setOpen(false);
      setReason("");
      setDetails("");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("אירעה שגיאה בשליחת הדיווח");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
          <Flag className="h-4 w-4 ml-2" />
          דווח על מודעה
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>דווח על מודעה</DialogTitle>
          <DialogDescription>
            אם מצאת בעיה במודעה זו, נשמח לשמוע על כך. הדיווח שלך יישאר אנונימי.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label>סיבת הדיווח</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {reportReasons.map((reportReason) => (
                <div key={reportReason.value} className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value={reportReason.value} id={reportReason.value} />
                  <Label htmlFor={reportReason.value} className="cursor-pointer font-normal">
                    {reportReason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="details">פרטים נוספים (אופציונלי)</Label>
            <Textarea
              id="details"
              placeholder="ספר לנו עוד על הבעיה שמצאת..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            ביטול
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "שולח..." : "שלח דיווח"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
