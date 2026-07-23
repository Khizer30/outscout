import { getContrastColor, isLightColor } from "@common/colour";
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
  const message = type === "verify" ? "Use the following OTP code to verify your email address:" : "Use the following OTP code to reset your password:";

  const isLight = isLightColor(primaryColor);

  const outerBg = isLight ? "#F8FAFC" : primaryColor;
  const cardBg = isLight ? "#FFFFFF" : "#1E293B";
  const cardBorder = isLight ? "#E2E8F0" : "rgba(255, 255, 255, 0.1)";
  const headingColor = isLight ? "#0F172A" : "#F8FAFC";
  const bodyTextColor = isLight ? "#334155" : "#CBD5E1";
  const mutedTextColor = isLight ? "#64748B" : "#94A3B8";
  const badgeBg = isLight ? "#F1F5F9" : "#0F172A";
  const badgeBorder = isLight ? "#E2E8F0" : "#334155";
  const footerBg = isLight ? "#F8FAFC" : "rgba(0, 0, 0, 0.2)";
  const footerBorder = isLight ? "#E2E8F0" : "rgba(255, 255, 255, 0.08)";
  const otpTextColor = getContrastColor(secondaryColor);

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="x-apple-disable-message-reformatting" />
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: ${outerBg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${outerBg}; width: 100%;">
        <tr>
          <td align="center" style="padding: 40px 16px;">
            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; width: 100%; border-collapse: separate; background-color: ${cardBg}; border-radius: 16px; border: 1px solid ${cardBorder}; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01); overflow: hidden;">
              <tr>
                <td style="height: 5px; background-color: ${secondaryColor}; font-size: 0; line-height: 0;">&nbsp;</td>
              </tr>

              <!-- Header -->
              <tr>
                <td align="center" style="padding: 40px 40px 24px 40px;">
                  ${
                    companyImage
                      ? `<img src="${companyImage}" alt="${companyName}" style="max-height: 48px; max-width: 200px; height: auto; display: block; margin: 0 auto 20px auto; border: 0;" />`
                      : `<table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto 16px auto;">
                          <tr>
                            <td align="center" style="padding: 6px 16px; background-color: ${badgeBg}; border: 1px solid ${badgeBorder}; border-radius: 20px; color: ${secondaryColor}; font-size: 12px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase;">
                              ${companyName}
                            </td>
                          </tr>
                        </table>`
                  }
                  <h1 style="margin: 0; color: ${headingColor}; font-size: 26px; font-weight: 700; line-height: 1.35; letter-spacing: -0.3px; text-align: center;">
                    ${title}
                  </h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 0 40px 32px 40px;">
                  <p style="margin: 0 0 12px 0; color: ${headingColor}; font-size: 16px; font-weight: 600; text-align: center;">
                    Hi ${receiverName},
                  </p>
                  <p style="margin: 0 0 28px 0; color: ${bodyTextColor}; font-size: 15px; line-height: 1.65; text-align: center;">
                    ${message}
                  </p>

                  <!-- OTP Box -->
                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 32px 0;">
                    <tr>
                      <td align="center">
                        <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="background-color: ${secondaryColor}; border-radius: 14px; border: 1px solid rgba(0, 0, 0, 0.05); box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);">
                          <tr>
                            <td align="center" style="padding: 18px 36px;">
                              <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 32px; font-weight: 700; color: ${otpTextColor}; letter-spacing: 8px; line-height: 1;">
                                ${otp}
                              </span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Expiration & Security Card -->
                  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${badgeBg}; border: 1px solid ${badgeBorder}; border-radius: 12px; margin: 0;">
                    <tr>
                      <td style="padding: 16px 20px;">
                        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="color: ${mutedTextColor}; font-size: 13px; line-height: 1.5; text-align: center;">
                              <strong style="color: ${headingColor}; font-weight: 600;">⏰ Note:</strong> This OTP will expire in 10 minutes. Please do not share it with anyone.<br />
                              If you did not request this code, you can safely ignore this message.
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 40px; background-color: ${footerBg}; border-top: 1px solid ${footerBorder}; text-align: center;">
                  <p style="margin: 0; color: ${mutedTextColor}; font-size: 12px; line-height: 1.5;">
                    This is an automated security message from <strong style="color: ${bodyTextColor}; font-weight: 600;">${senderName ?? companyName}</strong>.<br />
                    Please do not reply directly to this email.
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
