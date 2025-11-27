import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { itemType, itemData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let prompt = "";
    
    if (itemType === "car") {
      prompt = `נתח את הרכב הבא ותן המלצה מקצועית:
דגם: ${itemData.model}
שנה: ${itemData.year}
יד: ${itemData.hand}
קילומטראז': ${itemData.km?.toLocaleString()}
מחיר מבוקש: ₪${itemData.price?.toLocaleString()}
מיקום: ${itemData.location}
תיאור: ${itemData.description || "אין תיאור"}

אנא ספק:
1. ניתוח מקצועי של מצב הרכב על בסיס הנתונים
2. האם המחיר הוגן? השווה למחירי שוק
3. המלצה ברורה - האם כדאי לרכוש?
4. נקודות חשובות לבדוק לפני הרכישה

תן תשובה מקצועית בעברית, תמציתית וברורה.`;
    } else if (itemType === "property") {
      prompt = `נתח את הנכס הבא ותן המלצה מקצועית:
כותרת: ${itemData.title}
סוג: ${itemData.property_type}
חדרים: ${itemData.rooms}
גודל: ${itemData.size} מ"ר
קומה: ${itemData.floor}${itemData.total_floors ? ` מתוך ${itemData.total_floors}` : ""}
מחיר: ₪${itemData.price?.toLocaleString()}
מיקום: ${itemData.location}
מצב: ${itemData.condition || "לא צוין"}
תיאור: ${itemData.description || "אין תיאור"}

אנא ספק:
1. ניתוח מקצועי של הנכס על בסיס הנתונים
2. האם המחיר הוגן ביחס למיקום וגודל?
3. המלצה ברורה - האם כדאי לרכוש/לשכור?
4. נקודות חשובות לבדוק לפני החתימה

תן תשובה מקצועית בעברית, תמציתית וברורה.`;
    } else if (itemType === "laptop") {
      prompt = `נתח את המחשב הנייד הבא ותן המלצה מקצועית:
דגם: ${itemData.model}
מחיר: ₪${itemData.price?.toLocaleString()}
מיקום: ${itemData.location}
תיאור: ${itemData.description || "אין תיאור"}

אנא ספק:
1. ניתוח מקצועי של המחשב על בסיס הנתונים
2. האם המחיר הוגן? השווה למחירי שוק
3. האם המפרט מתאים לשימושים שונים (עבודה, גיימינג, וכו')
4. המלצה ברורה - האם כדאי לרכוש?

תן תשובה מקצועית בעברית, תמציתית וברורה.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "אתה יועץ רכישה מקצועי המומחה לניתוח מוצרים ומתן המלצות מבוססות נתונים. תן תשובות ברורות, תמציתיות ומקצועיות בעברית."
          },
          {
            role: "user",
            content: prompt
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "חרגת ממכסת הבקשות. אנא נסה שוב מאוחר יותר." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "יש להוסיף קרדיט לחשבון Lovable AI." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate report");
    }

    const data = await response.json();
    const report = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ report }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-ai-report function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
