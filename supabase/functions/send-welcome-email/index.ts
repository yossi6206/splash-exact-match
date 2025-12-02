import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Custom welcome email template with RTL support and brand colors
function generateWelcomeEmailHTML(userName: string, userEmail: string): string {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ברוכים הבאים - שוק יד שנייה</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f9fc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 40px;">
          
          <!-- Logo Section -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <div style="display: inline-block; font-size: 32px; font-weight: 900; color: #ffffff; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 12px 24px; border-radius: 8px; letter-spacing: -1px;">
                שוק יד שנייה
              </div>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <h1 style="margin: 0; color: #1a1a1a; font-size: 28px; font-weight: 700;">
                🎉 ברוכים הבאים ל-שוק יד שנייה!
              </h1>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding-bottom: 16px;">
              <p style="margin: 0; color: #374151; font-size: 18px; line-height: 24px; text-align: right; font-weight: 600;">
                שלום ${userName},
              </p>
            </td>
          </tr>

          <!-- Main Message -->
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0; color: #374151; font-size: 16px; line-height: 24px; text-align: right;">
                אנחנו שמחים שהצטרפת אלינו! החשבון שלך נוצר בהצלחה ואתה מוכן להתחיל לקנות ולמכור.
              </p>
            </td>
          </tr>

          <!-- Features Section -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 16px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
                    <p style="margin: 0; color: #374151; font-size: 15px; line-height: 22px; text-align: right;">
                      <strong style="color: #667eea;">✨ פרסם מודעות בחינם</strong><br/>
                      העלה תמונות, תאר את המוצר ופרסם בקלות
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px; background-color: #f9fafb; border-radius: 8px; margin-bottom: 12px;">
                    <p style="margin: 0; color: #374151; font-size: 15px; line-height: 22px; text-align: right;">
                      <strong style="color: #667eea;">💬 תקשורת ישירה</strong><br/>
                      שלח הודעות למוכרים וקונים דרך המערכת
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px; background-color: #f9fafb; border-radius: 8px;">
                    <p style="margin: 0; color: #374151; font-size: 15px; line-height: 22px; text-align: right;">
                      <strong style="color: #667eea;">⭐ שמור מועדפים</strong><br/>
                      סמן מוצרים מעניינים ועקוב אחרי עדכונים
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 32px 0;">
              <a href="https://secondhandpro.co.il" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                התחל עכשיו
              </a>
            </td>
          </tr>

          <!-- Tips Section -->
          <tr>
            <td style="padding-bottom: 24px; border-top: 1px solid #e5e7eb; padding-top: 24px;">
              <p style="margin: 0 0 12px 0; color: #374151; font-size: 16px; line-height: 24px; text-align: right; font-weight: 600;">
                💡 טיפים למתחילים:
              </p>
              <ul style="margin: 0; padding-right: 20px; color: #6b7280; font-size: 14px; line-height: 22px; text-align: right;">
                <li style="margin-bottom: 8px;">העלה תמונות איכותיות של המוצרים שלך</li>
                <li style="margin-bottom: 8px;">כתוב תיאור מפורט וכן של המצב</li>
                <li style="margin-bottom: 8px;">קבע מחיר הוגן על סמך מחירי השוק</li>
                <li>השב במהירות להודעות של מתעניינים</li>
              </ul>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 32px 0;">
              <div style="border-top: 1px solid #e5e7eb;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-bottom: 8px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 20px;">
                <strong>שוק יד שנייה</strong> - לקנות מהר, למכור מהר<br/>
                המקום שבו עסקאות קורות
              </p>
            </td>
          </tr>

          <!-- Contact Info -->
          <tr>
            <td align="center" style="padding-bottom: 16px;">
              <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 18px;">
                יש לך שאלות? אנחנו כאן לעזור!<br/>
                צור קשר: <a href="mailto:support@secondhandpro.co.il" style="color: #667eea; text-decoration: none;">support@secondhandpro.co.il</a>
              </p>
            </td>
          </tr>

          <!-- Small Footer -->
          <tr>
            <td align="center">
              <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 16px;">
                מייל זה נשלח אוטומטית, אנא אל תענה למייל זה.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response("Method not allowed", { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    const { email, name } = await req.json();
    console.log("Welcome email requested for:", email, "Name:", name);

    if (!email) {
      throw new Error("Email is required");
    }

    const userName = name || "משתמש חדש";
    
    // Generate the HTML email
    console.log("Generating welcome email...");
    const html = generateWelcomeEmailHTML(userName, email);

    // Send the email via Resend
    console.log("Sending welcome email via Resend...");
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "שוק יד שנייה <noreply@secondhandpro.co.il>",
      to: [email],
      subject: "ברוכים הבאים ל-שוק יד שנייה! 🎉",
      html,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      throw emailError;
    }

    console.log("Welcome email sent successfully via Resend:", emailData?.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Welcome email sent successfully",
        messageId: emailData?.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error: any) {
    console.error("Error in send-welcome-email:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send welcome email" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
