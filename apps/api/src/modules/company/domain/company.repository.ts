import { CompanyEntity } from "@modules/company/domain/company.entity";
import { CompanyMembershipEntity } from "@modules/company/domain/companyMembership.entity";

export abstract class CompanyRepository {
  abstract create(company: CompanyEntity, membership: CompanyMembershipEntity): Promise<{ company: CompanyEntity; membership: CompanyMembershipEntity }>;
  abstract findById(id: string): Promise<CompanyEntity | null>;
  abstract findActiveMembershipsWithCompaniesByUserId(userId: string): Promise<{ company: CompanyEntity; membership: CompanyMembershipEntity }[]>;
  abstract findActiveMembershipForUser(userId: string, membershipId: string): Promise<{ company: CompanyEntity; membership: CompanyMembershipEntity } | null>;
}
