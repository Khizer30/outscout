export type EmailType = "verify" | "reset";

export interface MailSendOptions {
  to: string;
  subject: string;
  textContent: string;
  htmlContent: string;
}

export interface CompanyMailConfig {
  decryptedApiKey?: string | null;
  fromEmail?: string | null;
  companyName: string;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  companyImageURL?: string | null;
}
