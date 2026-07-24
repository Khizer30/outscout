import { CompanyMembershipRole, CompanyMembershipStatus } from "@modules/company/domain/companyMembership.types";
import { createId } from "@paralleldrive/cuid2";

export class CompanyMembershipEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly userId: string,
    public readonly role: CompanyMembershipRole,
    public readonly status: CompanyMembershipStatus,
    public readonly joinedAt: Date
  ) {}

  static create(props: {
    id?: string;
    companyId: string;
    userId: string;
    role?: CompanyMembershipRole;
    status?: CompanyMembershipStatus;
    joinedAt?: Date;
  }): CompanyMembershipEntity {
    return new CompanyMembershipEntity(
      props.id ?? createId(),
      props.companyId,
      props.userId,
      props.role ?? "COMPANY_USER",
      props.status ?? "ACTIVE",
      props.joinedAt ?? new Date()
    );
  }
}
