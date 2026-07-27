import { AiRepository } from "@modules/ai/domain/ai.repository";
import { AiGoogleRepository } from "@modules/ai/infrastructure/aiGoogle.repository";
import { AiService } from "@modules/ai/services/ai.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [
    AiService,
    {
      provide: AiRepository,
      useClass: AiGoogleRepository
    }
  ],
  exports: [AiService, AiRepository]
})
export class AiModule {}
