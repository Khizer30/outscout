import { DatabaseService } from "@database/services/database.service";
import { AuditLogEntity } from "@modules/audit/domain/audit.entity";
import { AuditLogRepository } from "@modules/audit/domain/audit.repository";
import { AuditMapper } from "@modules/audit/infrastructure/audit.mapper";
import { Injectable } from "@nestjs/common";
import { auditLogsTable } from "@schema/auditLogs";

@Injectable()
export class AuditDrizzleRepository extends AuditLogRepository {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async create(entity: AuditLogEntity): Promise<AuditLogEntity> {
    const [row] = await this.databaseService.db.insert(auditLogsTable).values(AuditMapper.toPersistence(entity)).returning();
    return AuditMapper.toDomain(row);
  }
}
