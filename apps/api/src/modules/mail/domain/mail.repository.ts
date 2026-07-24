import type { MailSendOptions, MailSenderConfig } from "@modules/mail/domain/mail.types";

export abstract class MailRepository {
  abstract readonly senderName: string;
  abstract send(options: MailSendOptions): Promise<void>;
  abstract sendWith(senderConfig: MailSenderConfig, options: MailSendOptions): Promise<void>;
}
