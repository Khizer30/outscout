import { SessionRepository } from "@modules/auth/domain/session.repository";
import { VerificationRepository } from "@modules/auth/domain/verification.repository";
import { SessionDrizzleRepository } from "@modules/auth/infrastructure/sessionDrizzle.repository";
import { VerificationDrizzleRepository } from "@modules/auth/infrastructure/verificationDrizzle.repository";
import { AuthController } from "@modules/auth/presentation/auth.controller";
import { AuthService } from "@modules/auth/services/auth.service";
import { SessionCronService } from "@modules/auth/services/sessionCron.service";
import { VerificationCronService } from "@modules/auth/services/verificationCron.service";
import { EncryptionModule } from "@modules/encryption/encryption.module";
import { JWTModule } from "@modules/jwt/jwt.module";
import { MailModule } from "@modules/mail/mail.module";
import { UserModule } from "@modules/user/user.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [UserModule, MailModule, JWTModule, EncryptionModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    VerificationCronService,
    SessionCronService,
    {
      provide: VerificationRepository,
      useClass: VerificationDrizzleRepository
    },
    {
      provide: SessionRepository,
      useClass: SessionDrizzleRepository
    }
  ]
})
export class AuthModule {}
