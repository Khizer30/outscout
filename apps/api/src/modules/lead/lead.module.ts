import { DatabaseModule } from "@database/database.module";
import { AiModule } from "@modules/ai/ai.module";
import { JWTModule } from "@modules/jwt/jwt.module";
import { LeadRepository } from "@modules/lead/domain/lead.repository";
import { LeadDrizzleRepository } from "@modules/lead/infrastructure/leadDrizzle.repository";
import { LeadController } from "@modules/lead/presentation/lead.controller";
import { LeadService } from "@modules/lead/services/lead.service";
import { MapModule } from "@modules/map/map.module";
import { WebScrapingModule } from "@modules/webScraping/webScraping.module";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { RedisModule } from "@redis/redis.module";

@Module({
  imports: [DatabaseModule, JWTModule, WebScrapingModule, AiModule, MapModule, RedisModule, BullModule.registerQueue({ name: "webScraper" })],
  controllers: [LeadController],
  providers: [
    LeadService,
    {
      provide: LeadRepository,
      useClass: LeadDrizzleRepository
    }
  ],
  exports: [LeadService]
})
export class LeadModule {}
