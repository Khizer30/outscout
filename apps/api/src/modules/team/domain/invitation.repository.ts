import { CompanyInvitationEntity } from "@modules/team/domain/invitation.entity";
import { CompanyInvitationStatus } from "@modules/team/domain/invitation.types";

export abstract class InvitationRepository {
  abstract create(invitation: CompanyInvitationEntity): Promise<CompanyInvitationEntity>;
  abstract findById(id: string): Promise<CompanyInvitationEntity | null>;
  abstract findByCompany(companyId: string, filters?: { email?: string; status?: CompanyInvitationStatus[] }): Promise<CompanyInvitationEntity[]>;
  abstract findByEmail(email: string, filters?: { status?: CompanyInvitationStatus[] }): Promise<CompanyInvitationEntity[]>;
  abstract update(invitation: CompanyInvitationEntity): Promise<CompanyInvitationEntity | null>;
}
