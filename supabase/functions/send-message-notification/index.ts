import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MessageNotificationRequest {
  recipientId: string;
  senderName: string;
  messagePreview: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientId, senderName, messagePreview }: MessageNotificationRequest = await req.json();

    console.log("Sending message notification to recipient:", recipientId);

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get recipient email from profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", recipientId)
      .single();

    if (profileError) {
      console.error("Error fetching recipient profile:", profileError);
      throw new Error("Failed to fetch recipient profile");
    }

    // Get recipient email from auth.users
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(recipientId);

    if (userError || !user?.email) {
      console.error("Error fetching recipient email:", userError);
      throw new Error("Failed to fetch recipient email");
    }

    const recipientEmail = user.email;
    const recipientName = profile?.full_name || "משתמש";

    console.log(`Sending notification email to: ${recipientEmail}`);

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "secondhandpro <noreply@secondhandpro.co.il>",
      to: [recipientEmail],
      subject: "קיבלת הודעה חדשה ב-secondhandpro",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>הודעה חדשה</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 28px;">secondhandpro</h1>
              <p style="color: #666; margin: 5px 0 0 0;">הפלטפורמה המובילה למכירה ורכישה</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: white; margin: 0; font-size: 22px;">שלום ${recipientName},</h2>
            </div>

            <div style="padding: 20px 0;">
              <p style="font-size: 16px; margin-bottom: 15px;">קיבלת הודעה חדשה מ<strong>${senderName}</strong>:</p>
              
              <div style="background-color: #f8f9fa; padding: 15px; border-right: 4px solid #2563eb; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 0; color: #555; font-style: italic;">"${messagePreview}"</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://secondhandpro.co.il/messages" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                  צפה בהודעה
                </a>
              </div>

              <p style="font-size: 14px; color: #666; margin-top: 25px;">
                ענה במהירות כדי לשמור על תקשורת טובה עם הקונים שלך! 💬
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

            <div style="text-align: center; padding: 20px 0;">
              <p style="color: #999; font-size: 13px; margin: 5px 0;">
                © 2024 secondhandpro. כל הזכויות שמורות.
              </p>
              <p style="color: #999; font-size: 13px; margin: 5px 0;">
                <a href="https://secondhandpro.co.il" style="color: #2563eb; text-decoration: none;">secondhandpro.co.il</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, emailResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-message-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
