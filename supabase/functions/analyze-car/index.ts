import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { carDetails } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing car:', carDetails);

    const systemPrompt = `אתה מומחה לבדיקת רכבים ויועץ מקצועי לרכישת רכבים. 
    תפקידך לנתח את פרטי הרכב ולספק דוח מקצועי הכולל:
    1. הערכת מצב הרכב על סמך הק"מ, שנה ומספר ידיים
    2. ניתוח המחיר ביחס לשוק
    3. נקודות חזקות של הרכב
    4. דברים שחשוב לבדוק לפני הרכישה
    5. המלצה סופית - כדאי לרכוש או לא
    
    הדוח צריך להיות מקצועי אבל קריא, בעברית, ובאורך של כ-300-400 מילים.`;

    const userPrompt = `אנא נתח את הרכב הבא:
    דגם: ${carDetails.model}
    תיאור: ${carDetails.description}
    שנה: ${carDetails.year}
    ק"מ: ${carDetails.km}
    יד: ${carDetails.hand}
    מיקום: ${carDetails.location}
    מחיר: ${carDetails.price}
    תכונות: ${carDetails.features?.join(', ') || 'לא צוינו'}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'הגעת למגבלת השימוש, אנא נסה שוב מאוחר יותר' }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'נדרשת תשלום נוסף, אנא הוסף יתרה למערכת' }), 
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    console.log('Analysis completed successfully');

    return new Response(
      JSON.stringify({ analysis }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-car function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
