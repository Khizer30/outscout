import { isLightColor } from "@common/colour";

interface Props {
  body: string;
  signature: string | null;
  companyName: string;
  companyImage?: string | null;
  primaryColor: string;
  secondaryColor: string;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function toHtml(text: string): string {
  return escapeHtml(text).replace(/\n\n/g, '</p><p style="margin: 0 0 16px 0;">').replace(/\n/g, "<br />");
}

export default function generateOutreachEmail({ body, signature, companyName, companyImage, primaryColor, secondaryColor }: Props): string {
  const isLight = isLightColor(primaryColor);

  const outerBg = isLight ? "#F8FAFC" : primaryColor;
  const cardBg = isLight ? "#FFFFFF" : "#1E293B";
  const cardBorder = isLight ? "#E2E8F0" : "rgba(255, 255, 255, 0.1)";
  const bodyTextColor = isLight ? "#334155" : "#CBD5E1";
  const mutedTextColor = isLight ? "#64748B" : "#94A3B8";
  const badgeBg = isLight ? "#F1F5F9" : "#0F172A";
  const badgeBorder = isLight ? "#E2E8F0" : "#334155";
  const footerBg = isLight ? "#F8FAFC" : "rgba(0, 0, 0, 0.2)";
  const footerBorder = isLight ? "#E2E8F0" : "rgba(255, 255, 255, 0.08)";

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="x-apple-disable-message-reformatting" />
      <title>Message from ${escapeHtml(companyName)}</title>
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
                <td align="center" style="padding: 32px 40px 8px 40px;">
                  ${
                    companyImage
                      ? `<img src="${companyImage}" alt="${escapeHtml(companyName)}" style="max-height: 48px; max-width: 200px; height: auto; display: block; margin: 0 auto; border: 0;" />`
                      : `<table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                          <tr>
                            <td align="center" style="padding: 6px 16px; background-color: ${badgeBg}; border: 1px solid ${badgeBorder}; border-radius: 20px; color: ${secondaryColor}; font-size: 12px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase;">
                              ${escapeHtml(companyName)}
                            </td>
                          </tr>
                        </table>`
                  }
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 24px 40px 32px 40px; color: ${bodyTextColor}; font-size: 15px; line-height: 1.65;">
                  <p style="margin: 0 0 16px 0;">${toHtml(body)}</p>
                  ${signature ? `<p style="margin: 24px 0 0 0; color: ${mutedTextColor};">${toHtml(signature)}</p>` : ""}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 24px 40px; background-color: ${footerBg}; border-top: 1px solid ${footerBorder}; text-align: center;">
                  <p style="margin: 0; color: ${mutedTextColor}; font-size: 12px; line-height: 1.5;">
                    Sent by <strong style="color: ${bodyTextColor}; font-weight: 600;">${escapeHtml(companyName)}</strong> via Outscout.
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
