import { LeadEntity } from "@modules/lead/domain/lead.entity";
import { LeadNotFoundError } from "@modules/lead/domain/lead.errors";
import { LeadRepository } from "@modules/lead/domain/lead.repository";
import { CreateLeadProps, LeadStatus } from "@modules/lead/domain/lead.types";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LeadService {
  constructor(private readonly leadRepo: LeadRepository) {}

  async create(data: CreateLeadProps): Promise<LeadEntity> {
    const lead = LeadEntity.create(data);

    return this.leadRepo.create(lead);
  }

  async findById(id: string): Promise<LeadEntity> {
    const lead = await this.leadRepo.findById(id);
    if (!lead) {
      throw new LeadNotFoundError({ id });
    }

    return lead;
  }

  async findByCompany(companyId: string, filters?: { status?: LeadStatus[] }): Promise<LeadEntity[]> {
    return this.leadRepo.findByCompany(companyId, filters);
  }

  async updateStatus(id: string, status: LeadStatus): Promise<LeadEntity> {
    const lead = await this.leadRepo.findById(id);
    if (!lead) {
      throw new LeadNotFoundError({ id });
    }

    const updated = await this.leadRepo.update(lead.updateStatus(status));
    if (!updated) {
      throw new LeadNotFoundError({ id });
    }

    return updated;
  }
}
