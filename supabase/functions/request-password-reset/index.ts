import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
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
  <title>איפוס סיסמה - שוק יד שנייה</title>
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
                <strong>שוק יד שנייה</strong> - לקנות מהר, למכור מהר<br/>
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
    const { email } = await req.json();
    console.log("Password reset requested for:", email);

    if (!email) {
      throw new Error("Email is required");
    }

    // Create Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Generate password reset token
    console.log("Generating reset link...");
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${Deno.env.get("SUPABASE_URL")}/auth/v1/verify`
      }
    });

    if (error) {
      console.error("Error generating reset link:", error);
      throw error;
    }

    console.log("Reset link generated successfully");

    // Extract the reset link
    const resetLink = data.properties.action_link;
    
    // Generate the HTML email
    console.log("Generating custom branded email...");
    const html = generateResetEmailHTML(resetLink, email);

    // Send the email via Resend
    console.log("Sending email via Resend...");
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "שוק יד שנייה <noreply@secondhandpro.co.il>",
      to: [email],
      subject: "איפוס סיסמה - שוק יד שנייה",
      html,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      throw emailError;
    }

    console.log("Email sent successfully via Resend:", emailData?.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Password reset email sent successfully",
        messageId: emailData?.id
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error: any) {
    console.error("Error in request-password-reset:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to process password reset request" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
