import { MailRepository } from "@modules/mail/domain/mail.repository";
import generateOtpEmail from "@modules/mail/templates/otp.html";
import generateOtpText from "@modules/mail/templates/otp.text";
import { Injectable } from "@nestjs/common";

export interface CompanyMailConfig {
  decryptedApiKey: string;
  fromEmail: string;
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  companyImageURL?: string | null;
}

const OUTSCOUT_PRIMARY_COLOR = "#141F2D";
const OUTSCOUT_SECONDARY_COLOR = "#D97A3E";

@Injectable()
export class MailService {
  constructor(private readonly sender: MailRepository) {}

  async sendVerificationEmail(to: string, receiverName: string, otp: string): Promise<void> {
    await this.sender.send({
      to,
      subject: "Verify Your Email",
      textContent: generateOtpText({ type: "verify", receiverName, otp, companyName: this.sender.senderName }),
      htmlContent: generateOtpEmail({
        type: "verify",
        receiverName,
        otp,
        companyName: this.sender.senderName,
        primaryColor: OUTSCOUT_PRIMARY_COLOR,
        secondaryColor: OUTSCOUT_SECONDARY_COLOR
      })
    });
  }

  async sendResetEmail(to: string, receiverName: string, otp: string): Promise<void> {
    await this.sender.send({
      to,
      subject: "Reset Your Password",
      textContent: generateOtpText({ type: "reset", receiverName, otp, companyName: this.sender.senderName }),
      htmlContent: generateOtpEmail({
        type: "reset",
        receiverName,
        otp,
        companyName: this.sender.senderName,
        primaryColor: OUTSCOUT_PRIMARY_COLOR,
        secondaryColor: OUTSCOUT_SECONDARY_COLOR
      })
    });
  }

  async sendAsCompany(companyConfig: CompanyMailConfig, to: string, subject: string, textContent: string, htmlContent: string): Promise<void> {
    await this.sender.sendWith(
      {
        apiKey: companyConfig.decryptedApiKey,
        senderEmail: companyConfig.fromEmail,
        senderName: companyConfig.companyName
      },
      { to, subject, textContent, htmlContent }
    );
  }
}
