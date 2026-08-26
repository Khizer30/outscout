import { AuditLogRepository } from "@modules/audit/domain/audit.repository";
import { AuditDrizzleRepository } from "@modules/audit/infrastructure/auditDrizzle.repository";
import { AuditService } from "@modules/audit/services/audit.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [
    AuditService,
    {
      provide: AuditLogRepository,
      useClass: AuditDrizzleRepository
    }
  ],
  exports: [AuditService]
})
export class AuditModule {}
