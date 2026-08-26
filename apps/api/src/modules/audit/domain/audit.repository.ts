import { AuditLogEntity } from "@modules/audit/domain/audit.entity";

export abstract class AuditLogRepository {
  abstract create(log: AuditLogEntity): Promise<AuditLogEntity>;
}
