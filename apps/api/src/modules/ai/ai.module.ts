import { DatabaseModule } from "@database/database.module";
import { AiRepository } from "@modules/ai/domain/ai.repository";
import { AiGeneratedMessageRepository } from "@modules/ai/domain/aiGeneratedMessage.repository";
import { AiGeneratedMessageDrizzleRepository } from "@modules/ai/infrastructure/aiGeneratedMessageDrizzle.repository";
import { AiGoogleRepository } from "@modules/ai/infrastructure/aiGoogle.repository";
import { AiController } from "@modules/ai/presentation/ai.controller";
import { AiService } from "@modules/ai/services/ai.service";
import { CompanyModule } from "@modules/company/company.module";
import { JWTModule } from "@modules/jwt/jwt.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [DatabaseModule, JWTModule, CompanyModule],
  controllers: [AiController],
  providers: [
    AiService,
    {
      provide: AiRepository,
      useClass: AiGoogleRepository
    },
    {
      provide: AiGeneratedMessageRepository,
      useClass: AiGeneratedMessageDrizzleRepository
    }
  ],
  exports: [AiService]
})
export class AiModule {}
