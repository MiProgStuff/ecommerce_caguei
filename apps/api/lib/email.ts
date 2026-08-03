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
      html: otpEmailHtml({ appName, otp }),
      text: otpEmailText({ appName, otp }),
    });
  } catch (error) {
    // Don't let an email-provider outage silently swallow the OTP in prod —
    // log loudly so it's visible in server logs even though the user won't
    // get the code by email.
    console.error(`[RESEND] Failed to send OTP email to ${to}:`, error);
    throw error;
  }
}

const COMPANY_FOOTER = 'caguei';
// Absolute URL required — email clients fetch images over the public
// internet, not relative to any app. Points at the store's hosted asset;
// won't resolve until NEXT_PUBLIC_APP_URL is a real publicly-reachable host.
const LOGO_URL = `${process.env.NEXT_PUBLIC_APP_URL || 'https://cagueistudio.com'}/brand/logo-wordmark.png`;

function otpEmailHtml({ appName, otp }: { appName: string; otp: string }) {
  const isAdmin = appName.includes('Admin');
  return `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; background-color: #f5f1ea; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f1ea; padding: 32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 480px; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 32px 32px 8px;">
                    <img src="${LOGO_URL}" alt="caguei" width="120" style="display: block; height: auto; margin-bottom: 8px;" />
                    ${isAdmin ? `<p style="margin: 0 0 24px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #999;">Admin Console</p>` : `<div style="margin-bottom: 16px;"></div>`}
                    <p style="margin: 0 0 8px; font-size: 15px; color: #222;">
                      Here's the verification code you requested to sign in:
                    </p>
                    <p style="margin: 24px 0; font-size: 30px; font-weight: 700; letter-spacing: 6px; color: #1a1a1a;">
                      ${otp}
                    </p>
                    <p style="margin: 0 0 32px; font-size: 13px; color: #666; line-height: 1.5;">
                      This code expires in 5 minutes. If you didn't request it, you can safely ignore this email — no account changes were made.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 32px; border-top: 1px solid #eee;">
                    <p style="margin: 0; font-size: 12px; color: #999;">${COMPANY_FOOTER}</p>
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

function otpEmailText({ appName, otp }: { appName: string; otp: string }) {
  return [
    appName,
    '',
    `Here's the verification code you requested to sign in: ${otp}`,
    '',
    "This code expires in 5 minutes. If you didn't request it, you can safely ignore this email — no account changes were made.",
    '',
    '—',
    COMPANY_FOOTER,
  ].join('\n');
}
