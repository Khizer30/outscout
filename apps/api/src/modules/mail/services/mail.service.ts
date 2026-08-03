import { MailRepository } from "@modules/mail/domain/mail.repository";
import type { EmailLanguage, MailSenderConfig } from "@modules/mail/domain/mail.types";
import { OutscoutBranding } from "@modules/mail/domain/mail.value-objects";
import generateInvitationEmail from "@modules/mail/templates/invitation.html";
import generateInvitationText from "@modules/mail/templates/invitation.text";
import generateOtpEmail from "@modules/mail/templates/otp.html";
import generateOtpText from "@modules/mail/templates/otp.text";
import generateOutreachEmail from "@modules/mail/templates/outreach.html";
import generateOutreachText from "@modules/mail/templates/outreach.text";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private readonly sender: MailRepository) {}

  async sendVerificationEmail(to: string, receiverName: string, otp: string, language: EmailLanguage = "EN"): Promise<void> {
    const subject = language === "AR" ? "تحقق من بريدك الإلكتروني" : "Verify Your Email";

    await this.sender.send({
      to,
      subject,
      textContent: generateOtpText({ type: "verify", receiverName, otp, companyName: this.sender.senderName, language }),
      htmlContent: generateOtpEmail({
        type: "verify",
        receiverName,
        otp,
        companyName: this.sender.senderName,
        companyImage: OutscoutBranding.LOGO_URL,
        primaryColor: OutscoutBranding.PRIMARY_COLOR,
        secondaryColor: OutscoutBranding.SECONDARY_COLOR,
        language
      })
    });
  }

  async sendResetEmail(to: string, receiverName: string, otp: string, language: EmailLanguage = "EN"): Promise<void> {
    const subject = language === "AR" ? "إعادة تعيين كلمة المرور" : "Reset Your Password";

    await this.sender.send({
      to,
      subject,
      textContent: generateOtpText({ type: "reset", receiverName, otp, companyName: this.sender.senderName, language }),
      htmlContent: generateOtpEmail({
        type: "reset",
        receiverName,
        otp,
        companyName: this.sender.senderName,
        companyImage: OutscoutBranding.LOGO_URL,
        primaryColor: OutscoutBranding.PRIMARY_COLOR,
        secondaryColor: OutscoutBranding.SECONDARY_COLOR,
        language
      })
    });
  }

  async sendInvitationEmail(to: string, acceptUrl: string | null, companyName: string, language: EmailLanguage = "EN"): Promise<void> {
    const subject = language === "AR" ? `تمت دعوتك للانضمام إلى ${companyName} على Outscout` : `You've been invited to join ${companyName} on Outscout`;
    const textContent = generateInvitationText({ companyName, acceptUrl, language });
    const htmlContent = generateInvitationEmail({
      companyName,
      acceptUrl,
      companyImage: OutscoutBranding.LOGO_URL,
      primaryColor: OutscoutBranding.PRIMARY_COLOR,
      secondaryColor: OutscoutBranding.SECONDARY_COLOR,
      language
    });

    await this.sender.send({ to, subject, textContent, htmlContent });
  }

  async sendLeadOutreachEmail(
    senderConfig: MailSenderConfig,
    to: string,
    subject: string,
    body: string,
    branding: { signature: string | null; companyImage?: string | null; primaryColor?: string | null; secondaryColor?: string | null }
  ): Promise<void> {
    const { signature } = branding;

    await this.sender.sendWith(senderConfig, {
      to,
      subject,
      textContent: generateOutreachText({ body, signature }),
      htmlContent: generateOutreachEmail({
        body,
        signature,
        companyName: senderConfig.senderName,
        companyImage: branding.companyImage,
        primaryColor: branding.primaryColor ?? OutscoutBranding.PRIMARY_COLOR,
        secondaryColor: branding.secondaryColor ?? OutscoutBranding.SECONDARY_COLOR
      })
    });
  }
}
