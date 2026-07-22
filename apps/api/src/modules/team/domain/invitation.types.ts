import { CompanyMembershipRole } from "@modules/company/domain/companyMembership.entity";
import { CompanyInvitationStatus } from "@modules/team/domain/invitation.entity";

export interface CompanyInvitationRecord {
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
