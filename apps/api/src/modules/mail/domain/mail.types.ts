export type EmailType = "verify" | "reset";

export interface MailSendOptions {
  to: string;
  subject: string;
  textContent: string;
  htmlContent: string;
}
