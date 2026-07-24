import { CompanyMembershipRole } from "@modules/company/domain/companyMembership.types";
import { CompanyInvitationStatus, InvitedByUserSummary } from "@modules/team/domain/invitation.types";
import { createId } from "@paralleldrive/cuid2";

export class CompanyInvitationEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly email: string,
    public readonly role: CompanyMembershipRole,
    public readonly status: CompanyInvitationStatus,
    public readonly token: string,
    public readonly invitedBy: InvitedByUserSummary | null,
    public readonly expiresAt: Date,
    public readonly acceptedAt: Date | null,
    public readonly createdAt: Date
  ) {}

  static create(props: {
    id?: string;
    companyId: string;
    email: string;
    role?: CompanyMembershipRole;
    status?: CompanyInvitationStatus;
    token: string;
    invitedBy?: InvitedByUserSummary | null;
    expiresAt: Date;
    acceptedAt?: Date | null;
    createdAt?: Date;
  }): CompanyInvitationEntity {
    return new CompanyInvitationEntity(
      props.id ?? createId(),
      props.companyId,
      props.email,
      props.role ?? "COMPANY_USER",
      props.status ?? "PENDING",
      props.token,
      props.invitedBy ?? null,
      props.expiresAt,
      props.acceptedAt ?? null,
      props.createdAt ?? new Date()
    );
  }

  isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  withToken(token: string): CompanyInvitationEntity {
    return new CompanyInvitationEntity(
      this.id,
      this.companyId,
      this.email,
      this.role,
      this.status,
      token,
      this.invitedBy,
      this.expiresAt,
      this.acceptedAt,
      this.createdAt
    );
  }

  resend(token: string, expiresAt: Date): CompanyInvitationEntity {
    return new CompanyInvitationEntity(this.id, this.companyId, this.email, this.role, "PENDING", token, this.invitedBy, expiresAt, null, this.createdAt);
  }

  accept(): CompanyInvitationEntity {
    return new CompanyInvitationEntity(
      this.id,
      this.companyId,
      this.email,
      this.role,
      "ACCEPTED",
      this.token,
      this.invitedBy,
      this.expiresAt,
      new Date(),
      this.createdAt
    );
  }

  reject(): CompanyInvitationEntity {
    return new CompanyInvitationEntity(
      this.id,
      this.companyId,
      this.email,
      this.role,
      "REJECTED",
      this.token,
      this.invitedBy,
      this.expiresAt,
      this.acceptedAt,
      this.createdAt
    );
  }

  revoke(): CompanyInvitationEntity {
    return new CompanyInvitationEntity(
      this.id,
      this.companyId,
      this.email,
      this.role,
      "REVOKED",
      this.token,
      this.invitedBy,
      this.expiresAt,
      this.acceptedAt,
      this.createdAt
    );
  }
}
