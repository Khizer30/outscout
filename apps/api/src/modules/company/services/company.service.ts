import { CompanyEntity } from "@modules/company/domain/company.entity";
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

  async findActiveMembershipsByUserId(userId: string): Promise<{ company: CompanyEntity; membership: CompanyMembershipEntity }[]> {
    return this.companyRepo.findActiveMembershipsByUserId(userId);
  }
}
