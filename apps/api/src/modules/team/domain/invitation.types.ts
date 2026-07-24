import { CompanyMembershipRole } from "@modules/company/domain/companyMembership.types";

export type CompanyInvitationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "REVOKED" | "EXPIRED";

export interface InvitedByUserSummary {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
}

export interface CompanyInvitationRecord {
  id: string;
  companyId: string;
  email: string;
  role: CompanyMembershipRole;
  status: CompanyInvitationStatus;
  token: string;
  invitedBy: InvitedByUserSummary | null;
  expiresAt: Date;
  acceptedAt: Date | null;
  createdAt: Date;
}

export interface CompanyInvitationPersistenceRecord {
  id: string;
  companyId: string;
  email: string;
  role: CompanyMembershipRole;
  status: CompanyInvitationStatus;
  token: string;
  invitedBy: string | null;
  expiresAt: Date;
  acceptedAt: Date | null;
  createdAt: Date;
}

export interface InvitationTokenPayload {
  invitationId: string;
  email: string;
  companyId: string;
}
