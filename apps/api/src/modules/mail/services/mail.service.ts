import { MailRepository } from "@modules/mail/domain/mail.repository";
import type { CompanyMailConfig } from "@modules/mail/domain/mail.types";
import { OutscoutBranding } from "@modules/mail/domain/mail.value-objects";
import generateInvitationEmail from "@modules/mail/templates/invitation.html";
import generateInvitationText from "@modules/mail/templates/invitation.text";
import generateOtpEmail from "@modules/mail/templates/otp.html";
import generateOtpText from "@modules/mail/templates/otp.text";
import { Injectable } from "@nestjs/common";

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
        companyImage: OutscoutBranding.LOGO_URL,
        primaryColor: OutscoutBranding.PRIMARY_COLOR,
        secondaryColor: OutscoutBranding.SECONDARY_COLOR
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
        companyImage: OutscoutBranding.LOGO_URL,
        primaryColor: OutscoutBranding.PRIMARY_COLOR,
        secondaryColor: OutscoutBranding.SECONDARY_COLOR
      })
    });
  }

  async sendInvitationEmail(to: string, acceptUrl: string | null, companyConfig: CompanyMailConfig): Promise<void> {
    const primaryColor = companyConfig.primaryColor ?? OutscoutBranding.PRIMARY_COLOR;
    const secondaryColor = companyConfig.secondaryColor ?? OutscoutBranding.SECONDARY_COLOR;
    const companyImage = companyConfig.companyImageURL ?? OutscoutBranding.LOGO_URL;

    const subject = `You've been invited to join ${companyConfig.companyName} on Outscout`;
    const textContent = generateInvitationText({ companyName: companyConfig.companyName, acceptUrl });
    const htmlContent = generateInvitationEmail({ companyName: companyConfig.companyName, acceptUrl, companyImage, primaryColor, secondaryColor });

    if (companyConfig.decryptedApiKey && companyConfig.fromEmail) {
      await this.sender.sendWith(
        {
          apiKey: companyConfig.decryptedApiKey,
          senderEmail: companyConfig.fromEmail,
          senderName: companyConfig.companyName
        },
        { to, subject, textContent, htmlContent }
      );
      return;
    }

    await this.sender.send({ to, subject, textContent, htmlContent });
  }
}
