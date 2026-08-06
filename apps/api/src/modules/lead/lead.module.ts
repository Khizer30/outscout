import { DatabaseModule } from "@database/database.module";
import { AiModule } from "@modules/ai/ai.module";
import { CompanyModule } from "@modules/company/company.module";
import { JWTModule } from "@modules/jwt/jwt.module";
import { LeadRepository } from "@modules/lead/domain/lead.repository";
import { LeadDrizzleRepository } from "@modules/lead/infrastructure/leadDrizzle.repository";
import { LeadController } from "@modules/lead/presentation/lead.controller";
import { LeadService } from "@modules/lead/services/lead.service";
import { LeadCacheService } from "@modules/lead/services/leadCache.service";
import { MailModule } from "@modules/mail/mail.module";
import { MapModule } from "@modules/map/map.module";
import { WebScrapingModule } from "@modules/webScraping/webScraping.module";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { RedisModule } from "@redis/redis.module";

@Module({
  imports: [
    DatabaseModule,
    JWTModule,
    WebScrapingModule,
    AiModule,
    MapModule,
    RedisModule,
    CompanyModule,
    MailModule,
    BullModule.registerQueue({ name: "webScraper" })
  ],
  controllers: [LeadController],
  providers: [
    LeadService,
    LeadCacheService,
    {
      provide: LeadRepository,
      useClass: LeadDrizzleRepository
    }
  ],
  exports: [LeadService]
})
export class LeadModule {}
