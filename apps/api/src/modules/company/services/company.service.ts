import { CompanyEntity } from "@modules/company/domain/company.entity";
import { CompanyNotFoundError, CompanyUpdateConflictError } from "@modules/company/domain/company.errors";
import { CompanyRepository } from "@modules/company/domain/company.repository";
import { CompanyMembershipEntity } from "@modules/company/domain/companyMembership.entity";
import { MediaService } from "@modules/media/services/media.service";
import { Injectable, Logger } from "@nestjs/common";

interface CreateCompanyData {
  name: string;
  about?: string | null;
  companyImageURL?: string | null;
}

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(
    private readonly companyRepo: CompanyRepository,
    private readonly mediaService: MediaService
  ) {}

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
    return this.companyRepo.findMembershipsByUserId(userId, { status: ["ACTIVE"] });
  }

  async updateCompany(id: string, data: { name?: string; about?: string | null; companyImageURL?: string }): Promise<CompanyEntity> {
    const company = await this.companyRepo.findById(id);
    if (!company) {
      throw new CompanyNotFoundError({ id });
    }

    const oldImageURL = company.companyImageURL;
    const updatedCompany = company.update(data);
    const saved = await this.companyRepo.update(updatedCompany);

    if (!saved) {
      throw new CompanyUpdateConflictError({ id });
    }

    if (data.companyImageURL !== undefined && oldImageURL) {
      try {
        await this.mediaService.deleteImage(oldImageURL);
      } catch (error) {
        this.logger.error("Failed to delete old company image", error);
      }
    }

    return saved;
  }

  async deleteCompany(id: string): Promise<void> {
    const company = await this.companyRepo.findById(id);
    if (!company) {
      throw new CompanyNotFoundError({ id });
    }

    const deletedCompany = company.delete();
    const saved = await this.companyRepo.update(deletedCompany);

    if (!saved) {
      throw new CompanyUpdateConflictError({ id });
    }
  }
}
