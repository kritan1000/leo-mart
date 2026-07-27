import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
}

export function passwordResetEmailTemplate(resetUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:40px auto;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <tr>
          <td style="background-color:#4f46e5;padding:24px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:24px;">LeoMart</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 24px;">
            <h2 style="color:#333333;margin:0 0 16px;font-size:20px;">Reset Your Password</h2>
            <p style="color:#666666;line-height:1.6;margin:0 0 24px;">
              We received a request to reset your password. Click the button below to create a new password. This link will expire in 1 hour.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="text-align:center;padding:0 0 24px;">
                  <a href="${resetUrl}" style="display:inline-block;background-color:#4f46e5;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:bold;font-size:16px;">
                    Reset Password
                  </a>
                </td>
              </tr>
            </table>
            <p style="color:#999999;line-height:1.6;margin:0;font-size:14px;">
              If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f9f9f9;padding:16px 24px;text-align:center;">
            <p style="color:#999999;margin:0;font-size:12px;">&copy; ${new Date().getFullYear()} LeoMart. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
