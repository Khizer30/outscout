import { LeadEntity } from "@modules/lead/domain/lead.entity";
import { LeadStatus } from "@modules/lead/domain/lead.types";

export abstract class LeadRepository {
  abstract create(lead: LeadEntity): Promise<LeadEntity>;
  abstract findById(id: string): Promise<LeadEntity | null>;
  abstract findByCompany(
    companyId: string,
    filters?: { status?: LeadStatus[] },
    pagination?: { page: number; limit: number }
  ): Promise<{ leads: LeadEntity[]; total: number }>;
  abstract update(lead: LeadEntity): Promise<LeadEntity | null>;
}
