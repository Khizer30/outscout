import { DatabaseModule } from "@database/database.module";
import { LeadRepository } from "@modules/lead/domain/lead.repository";
import { LeadDrizzleRepository } from "@modules/lead/infrastructure/leadDrizzle.repository";
import { LeadController } from "@modules/lead/presentation/lead.controller";
import { LeadService } from "@modules/lead/services/lead.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [DatabaseModule],
  controllers: [LeadController],
  providers: [
    LeadService,
    {
      provide: LeadRepository,
      useClass: LeadDrizzleRepository
    }
  ],
  exports: [LeadService, LeadRepository]
})
export class LeadModule {}
