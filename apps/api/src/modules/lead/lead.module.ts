import { DatabaseModule } from "@database/database.module";
import { AiModule } from "@modules/ai/ai.module";
import { JWTModule } from "@modules/jwt/jwt.module";
import { LeadRepository } from "@modules/lead/domain/lead.repository";
import { LeadSourceRepository } from "@modules/lead/domain/leadSource.repository";
import { LeadDrizzleRepository } from "@modules/lead/infrastructure/leadDrizzle.repository";
import { LeadSourceGooglePlacesRepository } from "@modules/lead/infrastructure/leadSourceGooglePlaces.repository";
import { LeadController } from "@modules/lead/presentation/lead.controller";
import { LeadService } from "@modules/lead/services/lead.service";
import { WebScrapingModule } from "@modules/webScraping/webScraping.module";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";

@Module({
  imports: [DatabaseModule, JWTModule, WebScrapingModule, AiModule, BullModule.registerQueue({ name: "webScraper" })],
  controllers: [LeadController],
  providers: [
    LeadService,
    {
      provide: LeadRepository,
      useClass: LeadDrizzleRepository
    },
    {
      provide: LeadSourceRepository,
      useClass: LeadSourceGooglePlacesRepository
    }
  ],
  exports: [LeadService, LeadRepository]
})
export class LeadModule {}
