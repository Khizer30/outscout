import { CompanyEntity } from "@modules/company/domain/company.entity";
import { CompanyMembershipEntity } from "@modules/company/domain/companyMembership.entity";

export abstract class CompanyRepository {
  abstract create(company: CompanyEntity, membership: CompanyMembershipEntity): Promise<{ company: CompanyEntity; membership: CompanyMembershipEntity }>;
  abstract findById(id: string): Promise<CompanyEntity | null>;
  abstract findActiveMembershipsByUserId(
    userId: string,
    membershipId?: string,
    companyId?: string
  ): Promise<{ company: CompanyEntity; membership: CompanyMembershipEntity }[]>;
  abstract addMembership(membership: CompanyMembershipEntity): Promise<CompanyMembershipEntity>;
  abstract update(company: CompanyEntity): Promise<CompanyEntity | null>;
}
