import { AiRepository } from "@modules/ai/domain/ai.repository";
import { AiGeminiRepository } from "@modules/ai/infrastructure/aiGemini.repository";
import { AiController } from "@modules/ai/presentation/ai.controller";
import { AiService } from "@modules/ai/services/ai.service";
import { JWTModule } from "@modules/jwt/jwt.module";
import { WebScrapingModule } from "@modules/webScraping/webScraping.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [JWTModule, WebScrapingModule],
  controllers: [AiController],
  providers: [
    AiService,
    {
      provide: AiRepository,
      useClass: AiGeminiRepository
    }
  ],
  exports: [AiService, AiRepository]
})
export class AiModule {}
