import { AuditAction } from "@modules/audit/domain/audit.types";
import { createId } from "@paralleldrive/cuid2";

export class AuditLogEntity {
  constructor(
    public readonly id: string,
    public readonly actorId: string | null,
    public readonly companyId: string | null,
    public readonly action: AuditAction,
    public readonly createdAt: Date
  ) {}

  static create(props: { id?: string; actorId?: string | null; companyId?: string | null; action: AuditAction; createdAt?: Date }): AuditLogEntity {
    return new AuditLogEntity(props.id ?? createId(), props.actorId ?? null, props.companyId ?? null, props.action, props.createdAt ?? new Date());
  }
}
