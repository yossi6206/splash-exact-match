import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Custom email template with RTL support and brand colors
function generateResetEmailHTML(resetLink: string, userEmail: string): string {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>איפוס סיסמה - yad2</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f9fc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 40px;">
          
          <!-- Logo Section -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <div style="display: inline-block; font-size: 32px; font-weight: 900; color: #ffffff; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 12px 24px; border-radius: 8px; text-transform: lowercase; letter-spacing: -1px;">
                yad2
              </div>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <h1 style="margin: 0; color: #1a1a1a; font-size: 28px; font-weight: 700;">
                איפוס סיסמה
              </h1>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding-bottom: 16px;">
              <p style="margin: 0; color: #374151; font-size: 16px; line-height: 24px; text-align: right;">
                שלום,
              </p>
            </td>
          </tr>

          <!-- Main Message -->
          <tr>
            <td style="padding-bottom: 16px;">
              <p style="margin: 0; color: #374151; font-size: 16px; line-height: 24px; text-align: right;">
                קיבלנו בקשה לאיפוס הסיסמה עבור החשבון המקושר למייל: <strong>${userEmail}</strong>
              </p>
            </td>
          </tr>

          <!-- Button Section -->
          <tr>
            <td align="center" style="padding: 32px 0;">
              <a href="${resetLink}" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                איפוס סיסמה
              </a>
            </td>
          </tr>

          <!-- Validity Notice -->
          <tr>
            <td style="padding-bottom: 16px;">
              <p style="margin: 0; color: #374151; font-size: 16px; line-height: 24px; text-align: right;">
                הקישור תקף ל-24 שעות בלבד.
              </p>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding-bottom: 24px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 20px; text-align: right;">
                אם לא ביקשת לאפס את הסיסמה, אנא התעלם ממייל זה. הסיסמה שלך תישאר ללא שינוי.
              </p>
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
                <strong>yad2</strong> - לקנות מהר, למכור מהר<br/>
                המקום שבו עסקאות קורות
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { 
      status: 405,
      headers: corsHeaders 
    });
  }

  try {
    console.log("Received password reset email request");

    // Parse the webhook payload from Supabase Auth
    const payload = await req.json();
    console.log("Payload received for user:", payload.user?.email);

    // Extract user email and token information
    const { user, email_data } = payload;
    
    if (!user?.email) {
      throw new Error("User email not found in payload");
    }

    if (!email_data) {
      throw new Error("Email data not found in payload");
    }

    const { token_hash, redirect_to, email_action_type } = email_data;

    // Construct the reset link
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const resetLink = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

    console.log("Generating custom branded email...");

    // Generate the HTML email
    const html = generateResetEmailHTML(resetLink, user.email);

    console.log("Sending email via Resend...");

    // Send the email via Resend
    const { data, error } = await resend.emails.send({
      from: "yad2 <onboarding@resend.dev>",
      to: [user.email],
      subject: "איפוס סיסמה - yad2",
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log("Email sent successfully via Resend:", data?.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: data?.id 
      }),
      {
        status: 200,
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
      }
    );
  } catch (error) {
    console.error("Error in send-reset-email function:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage 
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
      }
    );
  }
});
