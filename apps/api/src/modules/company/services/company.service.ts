import { CompanyEntity } from "@modules/company/domain/company.entity";
import { UserAlreadyHasCompanyError } from "@modules/company/domain/company.errors";
import { CompanyRepository } from "@modules/company/domain/company.repository";
import { CompanyMembershipEntity } from "@modules/company/domain/companyMembership.entity";
import { Injectable } from "@nestjs/common";

interface CreateCompanyData {
  name: string;
  about?: string | null;
  companyImageURL?: string | null;
}

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepo: CompanyRepository) {}

  async createCompany(userId: string, data: CreateCompanyData): Promise<{ company: CompanyEntity; membership: CompanyMembershipEntity }> {
    // Check if the user already has an active company membership
    const activeMembership = await this.companyRepo.findActiveMembershipByUserId(userId);
    if (activeMembership) {
      throw new UserAlreadyHasCompanyError({ userId });
    }

    // Create the plain domain entities
    const company = CompanyEntity.create({
      name: data.name,
      about: data.about,
      companyImageURL: data.companyImageURL
    });

    const membership = CompanyMembershipEntity.create({
      companyId: company.id,
      userId,
      role: "COMPANY_ADMIN",
      status: "ACTIVE"
    });

    // Save using the transactional repository method
    return await this.companyRepo.create(company, membership);
  }

  async findById(id: string): Promise<CompanyEntity | null> {
    return this.companyRepo.findById(id);
  }

  async findActiveMembershipByUserId(userId: string): Promise<CompanyMembershipEntity | null> {
    return this.companyRepo.findActiveMembershipByUserId(userId);
  }
}
