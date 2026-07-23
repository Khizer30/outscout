import { CompanyEntity } from "@modules/company/domain/company.entity";
import { CompanyMembershipEntity, CompanyMembershipStatus } from "@modules/company/domain/companyMembership.entity";

export abstract class CompanyRepository {
  abstract create(company: CompanyEntity, membership: CompanyMembershipEntity): Promise<{ company: CompanyEntity; membership: CompanyMembershipEntity }>;
  abstract findById(id: string): Promise<CompanyEntity | null>;
  abstract findMembershipsByUserId(
    userId: string,
    filters?: { membershipId?: string; companyId?: string; status?: CompanyMembershipStatus[] }
  ): Promise<{ company: CompanyEntity; membership: CompanyMembershipEntity }[]>;
  abstract addMembership(membership: CompanyMembershipEntity): Promise<CompanyMembershipEntity>;
  abstract update(company: CompanyEntity): Promise<CompanyEntity | null>;
}
