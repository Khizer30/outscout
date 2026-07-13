import type { EmailType } from "@modules/mail/domain/mail.types";

interface Props {
  type: EmailType;
  receiverName: string;
  otp: string;
  senderName?: string;
  companyName: string;
  companyImage?: string;
  primaryColor: string;
  secondaryColor: string;
}

export default function generateOtpEmail({ type, receiverName, otp, senderName, companyName, companyImage, primaryColor, secondaryColor }: Props): string {
  const title = type === "verify" ? "Verify Your Email" : "Reset Your Password";
  const message = type === "verify" ? "Use the following OTP to verify your email." : "Use the following OTP to reset your password.";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: ${primaryColor}; font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: ${primaryColor}; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 25px 60px rgba(0,0,0,0.5); overflow: hidden;">
              <tr>
                <td style="height: 6px; background: ${secondaryColor};"></td>
              </tr>
              <!-- Header -->
              <tr>
                <td align="center" style="padding: 48px 40px 24px 40px; background-image: radial-gradient(circle at top, rgba(255,255,255,0.06), transparent 60%);">
                  ${companyImage ? `<img src="${companyImage}" alt="${companyName}" style="max-height: 48px; margin-bottom: 16px; display: block; margin-left: auto; margin-right: auto;" />` : ""}
                  <p style="margin: 0 0 12px 0; color: ${secondaryColor}; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase;">
                    ${companyName}
                  </p>
                  <h1 style="margin: 0; color: #F5F7FB; font-size: 30px; font-weight: 600; line-height: 1.3;">
                    ${title}
                  </h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 0 40px 40px 40px;">
                  <p style="margin: 0 0 20px 0; color: #F5F7FB; font-size: 16px; line-height: 1.7;">
                    Hi ${receiverName},
                  </p>
                  <p style="margin: 0 0 30px 0; color: #C9D3E6; font-size: 16px; line-height: 1.7;">
                    ${message}
                  </p>

                  <!-- OTP Box -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 30px 0;">
                    <tr>
                      <td align="center">
                        <div style="display: inline-block; padding: 22px 48px; background-color: ${secondaryColor}; border-radius: 16px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 12px 30px rgba(0,0,0,0.25);">
                          <div style="font-size: 34px; font-weight: 700; color: #FFFFFF; letter-spacing: 10px; font-family: 'Courier New', monospace; line-height: 1.2;">
                            ${otp}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0 0 18px 0; color: #F5F7FB; font-size: 14px; line-height: 1.6; text-align: center;">
                    This OTP will expire in 10 minutes. Please do not share it with anyone.
                  </p>
                  <p style="margin: 0; color: #C9D3E6; font-size: 14px; line-height: 1.6; text-align: center;">
                    If you did not request this, simply ignore this message.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 32px 24px; background-color: rgba(0,0,0,0.25); border-top: 1px solid rgba(255,255,255,0.05);">
                  <p style="margin: 0; color: #C9D3E6; font-size: 12px; line-height: 1.5; text-align: center;">
                    This is an automated message from ${senderName ?? companyName}. Please do not reply to this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `.trim();
}
