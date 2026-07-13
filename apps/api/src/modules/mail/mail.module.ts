import { MailRepository } from "@modules/mail/domain/mail.repository";
import { MailBrevoRepository } from "@modules/mail/infrastructure/mailBrevo.repository";
import { MailService } from "@modules/mail/services/mail.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [
    MailService,
    {
      provide: MailRepository,
      useClass: MailBrevoRepository
    }
  ],
  exports: [MailService, MailRepository]
})
export class MailModule {}
