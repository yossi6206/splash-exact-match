import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AIReportProps {
  itemType: "car" | "property" | "laptop" | "business" | "secondhand";
  itemData: any;
}

const AIReport = ({ itemType, itemData }: AIReportProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const { toast } = useToast();

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-ai-report", {
        body: { itemType, itemData }
      });

      if (error) throw error;

      setReport(data.report);
      toast({
        title: "דוח נוצר בהצלחה",
        description: "ניתוח מקצועי מבוסס AI מוכן",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו ליצור את הדוח. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="mt-6 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          דוח AI מקצועי
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!report ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              קבל ניתוח מקצועי מבוסס AI, המחיר והמלצות לרכישה
            </p>
            <Button 
              onClick={generateReport} 
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  מייצר דוח...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  צור דוח AI
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {report.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="text-foreground mb-3">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
            <Button 
              onClick={generateReport} 
              variant="outline" 
              size="sm"
              disabled={isGenerating}
            >
              צור דוח חדש
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIReport;
