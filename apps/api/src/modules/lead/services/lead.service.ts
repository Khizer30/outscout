import { LeadEntity } from "@modules/lead/domain/lead.entity";
import { LeadAccessDeniedError, LeadNotFoundError } from "@modules/lead/domain/lead.errors";
import { LeadRepository } from "@modules/lead/domain/lead.repository";
import { LeadStatus, UpdateLeadProps } from "@modules/lead/domain/lead.types";
import { LeadSourceRepository } from "@modules/lead/domain/leadSource.repository";
import { LeadSourceSearchParams } from "@modules/lead/domain/leadSource.types";
import { WebScrapingService } from "@modules/webScraping/services/webScraping.service";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class LeadService {
  private readonly logger = new Logger(LeadService.name);

  constructor(
    private readonly leadRepo: LeadRepository,
    private readonly leadSourceRepo: LeadSourceRepository,
    private readonly webScrapingService: WebScrapingService
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

    // Log Websites Markdown
    for (const lead of leads) {
      if (lead.website) {
        const scraped = await this.webScrapingService.scrape(lead.website);
        if (scraped) {
          this.logger.log(`Scraped ${lead.website}:\n${scraped}`);
        }
      }
    }

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

  async update(id: string, companyId: string, props: UpdateLeadProps): Promise<LeadEntity> {
    const lead = await this.findById(id, companyId);

    const updated = await this.leadRepo.update(lead.update(props));
    if (!updated) {
      throw new LeadNotFoundError({ id });
    }

    return updated;
  }
}
