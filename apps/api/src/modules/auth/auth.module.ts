import { VerificationRepository } from "@modules/auth/domain/verification.repository";
import { VerificationDrizzleRepository } from "@modules/auth/infrastructure/verificationDrizzle.repository";
import { AuthController } from "@modules/auth/presentation/auth.controller";
import { AuthService } from "@modules/auth/services/auth.service";
import { MailModule } from "@modules/mail/mail.module";
import { UserModule } from "@modules/user/user.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [UserModule, MailModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: VerificationRepository,
      useClass: VerificationDrizzleRepository
    }
  ]
})
export class AuthModule {}
