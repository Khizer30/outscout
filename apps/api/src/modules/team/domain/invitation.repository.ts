import { CompanyInvitationEntity } from "@modules/team/domain/invitation.entity";

export abstract class InvitationRepository {
  abstract create(invitation: CompanyInvitationEntity): Promise<CompanyInvitationEntity>;
  abstract findById(id: string): Promise<CompanyInvitationEntity | null>;
  abstract findPendingByCompany(companyId: string, email?: string): Promise<CompanyInvitationEntity[]>;
  abstract update(invitation: CompanyInvitationEntity): Promise<CompanyInvitationEntity | null>;
}
