import { AuditLogEntity } from "@modules/audit/domain/audit.entity";
import { AuditLogRepository } from "@modules/audit/domain/audit.repository";
import { AuditAction } from "@modules/audit/domain/audit.types";
import { Injectable } from "@nestjs/common";

interface LogAuditAction {
  action: AuditAction;
  actorId?: string | null;
  companyId?: string | null;
}

@Injectable()
export class AuditService {
  constructor(private readonly auditLogRepo: AuditLogRepository) {}

  async log(data: LogAuditAction): Promise<AuditLogEntity> {
    const entry = AuditLogEntity.create(data);
    return this.auditLogRepo.create(entry);
  }
}
