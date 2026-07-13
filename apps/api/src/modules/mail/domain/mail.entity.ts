export type EmailType = "verify" | "reset";

export interface MailSendOptions {
  to: string;
  subject: string;
  textContent: string;
  htmlContent: string;
}

export const OUTSCOUT_PRIMARY_COLOR = "#38BDF8";
export const OUTSCOUT_SECONDARY_COLOR = "#2DD4BF";
export const OUTSCOUT_LOGO_URL = "https://res.cloudinary.com/dl0xs7uz9/image/upload/v1783928238/logo_dark_d6gadw.png";
