import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface SendOtpEmailArgs {
  to: string;
  otp: string;
  appName: 'caguei' | 'caguei Admin';
}

// Falls back to a console log (existing dev behavior) whenever RESEND_API_KEY
// isn't set, so local dev keeps working without a Resend account.
export async function sendOtpEmail({ to, otp, appName }: SendOtpEmailArgs) {
  if (!resend) {
    console.log(`\n========================================`);
    console.log(`[DEV EMAIL FALLBACK — no RESEND_API_KEY set]`);
    console.log(`To: ${to}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`========================================\n`);
    return;
  }

  const from = process.env.RESEND_OTP_FROM || 'caguei <otp@cagueistudio.com>';

  try {
    await resend.emails.send({
      from,
      to,
      subject: `${otp} is your ${appName} verification code`,
      html: `
        <div style="font-family: sans-serif; max-width: 420px; margin: 0 auto; padding: 24px;">
          <h1 style="font-size: 20px; margin-bottom: 8px;">${appName}</h1>
          <p style="color: #444; margin-bottom: 24px;">Your verification code is:</p>
          <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 0 0 24px;">${otp}</p>
          <p style="color: #888; font-size: 13px;">This code expires in 5 minutes. If you didn't request it, you can ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    // Don't let an email-provider outage silently swallow the OTP in prod —
    // log loudly so it's visible in server logs even though the user won't
    // get the code by email.
    console.error(`[RESEND] Failed to send OTP email to ${to}:`, error);
    throw error;
  }
}
