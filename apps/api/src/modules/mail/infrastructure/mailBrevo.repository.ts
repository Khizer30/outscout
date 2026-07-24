import { BrevoClient } from "@getbrevo/brevo";
import { MailRepository } from "@modules/mail/domain/mail.repository";
import type { MailSendOptions, MailSenderConfig } from "@modules/mail/domain/mail.types";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailBrevoRepository extends MailRepository {
  private readonly logger = new Logger(MailBrevoRepository.name);
  private readonly client: BrevoClient;
  private readonly senderEmail: string;
  readonly senderName: string;

  constructor(config: ConfigService) {
    super();
    this.client = new BrevoClient({ apiKey: config.getOrThrow("BREVO_API_KEY") });
    this.senderEmail = config.getOrThrow("BREVO_SENDER_EMAIL");
    this.senderName = config.getOrThrow("BREVO_SENDER_NAME");
  }

  async send({ to, subject, textContent, htmlContent }: MailSendOptions): Promise<void> {
    await this.sendTransactional({ email: this.senderEmail, name: this.senderName }, to, subject, textContent, htmlContent);
  }

  async sendWith(senderConfig: MailSenderConfig, { to, subject, textContent, htmlContent }: MailSendOptions): Promise<void> {
    const client = new BrevoClient({ apiKey: senderConfig.apiKey });
    await this.sendTransactional({ email: senderConfig.senderEmail, name: senderConfig.senderName }, to, subject, textContent, htmlContent, client);
  }

  private async sendTransactional(
    sender: { email: string; name: string },
    to: string,
    subject: string,
    textContent: string,
    htmlContent: string,
    client = this.client
  ): Promise<void> {
    try {
      await client.transactionalEmails.sendTransacEmail({
        sender,
        to: [{ email: to }],
        subject,
        textContent,
        htmlContent
      });
      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send email to ${to}: ${message}`);
      throw new Error(`Failed to send email: ${message}`, { cause: error });
    }
  }
}
