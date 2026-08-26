import { AuditLogEntity } from "@modules/audit/domain/audit.entity";
import { AuditAction } from "@modules/audit/domain/audit.types";
import { AuditLog, AuditLogInsert } from "@schema/index";

export class AuditMapper {
  static toDomain(row: AuditLog): AuditLogEntity {
    return new AuditLogEntity(row.id, row.actorId, row.companyId, row.action as AuditAction, row.createdAt);
  }

  static toPersistence(entity: AuditLogEntity): AuditLogInsert {
    return {
      id: entity.id,
      actorId: entity.actorId,
      companyId: entity.companyId,
      action: entity.action,
      createdAt: entity.createdAt
    };
  }
}
