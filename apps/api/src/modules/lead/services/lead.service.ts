import { LeadEntity } from "@modules/lead/domain/lead.entity";
import { LeadAccessDeniedError, LeadNotFoundError } from "@modules/lead/domain/lead.errors";
import { LeadRepository } from "@modules/lead/domain/lead.repository";
import { LeadStatus } from "@modules/lead/domain/lead.types";
import { LeadSourceRepository } from "@modules/lead/domain/leadSource.repository";
import { LeadSourceSearchParams } from "@modules/lead/domain/leadSource.types";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LeadService {
  constructor(
    private readonly leadRepo: LeadRepository,
    private readonly leadSourceRepo: LeadSourceRepository
  ) {}

  async generate(companyId: string, params: LeadSourceSearchParams): Promise<LeadEntity[]> {
    const results = await this.leadSourceRepo.searchNearby(params);

    const leads = results.map((result) =>
      LeadEntity.create({
        id: result.placeId,
        companyId,
        name: result.name,
        address: result.address,
        latitude: result.latitude,
        longitude: result.longitude,
        phone: result.phone,
        website: result.website,
        businessStatus: result.businessStatus,
        rating: result.rating,
        userRatingCount: result.userRatingCount,
        primaryType: result.primaryType,
        types: result.types,
        otherPhones: result.otherPhones
      })
    );

    return this.leadRepo.createMany(leads);
  }

  async findById(id: string, companyId: string): Promise<LeadEntity> {
    const lead = await this.leadRepo.findById(id);
    if (!lead) {
      throw new LeadNotFoundError({ id });
    }

    if (lead.companyId !== companyId) {
      throw new LeadAccessDeniedError({ id });
    }

    return lead;
  }

  async findByCompany(
    companyId: string,
    filters?: { status?: LeadStatus[] },
    pagination?: { page: number; limit: number }
  ): Promise<{ leads: LeadEntity[]; total: number }> {
    return this.leadRepo.findByCompany(companyId, filters, pagination);
  }

  async updateStatus(id: string, companyId: string, status: LeadStatus): Promise<LeadEntity> {
    const lead = await this.findById(id, companyId);

    const updated = await this.leadRepo.update(lead.update({ status }));
    if (!updated) {
      throw new LeadNotFoundError({ id });
    }

    return updated;
  }
}
