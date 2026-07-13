import type { MailSendOptions } from "@modules/mail/domain/mail.entity";

export interface MailSenderConfig {
  apiKey: string;
  senderEmail: string;
  senderName: string;
}

export abstract class MailRepository {
  abstract readonly senderName: string;
  abstract send(options: MailSendOptions): Promise<void>;
  abstract sendWith(senderConfig: MailSenderConfig, options: MailSendOptions): Promise<void>;
}
