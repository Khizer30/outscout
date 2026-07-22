import { DatabaseModule } from "@database/database.module";
import { CompanyModule } from "@modules/company/company.module";
import { EncryptionModule } from "@modules/encryption/encryption.module";
import { JWTModule } from "@modules/jwt/jwt.module";
import { MailModule } from "@modules/mail/mail.module";
import { InvitationRepository } from "@modules/team/domain/invitation.repository";
import { InvitationDrizzleRepository } from "@modules/team/infrastructure/invitationDrizzle.repository";
import { TeamController } from "@modules/team/presentation/team.controller";
import { TeamService } from "@modules/team/services/team.service";
import { UserModule } from "@modules/user/user.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [DatabaseModule, JWTModule, MailModule, EncryptionModule, CompanyModule, UserModule],
  controllers: [TeamController],
  providers: [
    TeamService,
    {
      provide: InvitationRepository,
      useClass: InvitationDrizzleRepository
    }
  ],
  exports: [TeamService, InvitationRepository]
})
export class TeamModule {}
