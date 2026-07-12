import { MailService } from "@modules/mail/service/mail.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
