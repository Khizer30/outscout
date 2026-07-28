import { AiService } from "@modules/ai/services/ai.service";
import { LeadEntity } from "@modules/lead/domain/lead.entity";
import { LeadAccessDeniedError, LeadNotEnrichingError, LeadNotFoundError, LeadWebsiteMissingError } from "@modules/lead/domain/lead.errors";
import { LeadRepository } from "@modules/lead/domain/lead.repository";
import { LeadSocialLinks, LeadStatus, UpdateLeadProps } from "@modules/lead/domain/lead.types";
import { LeadSourceRepository } from "@modules/lead/domain/leadSource.repository";
import {
  LeadSourceAutocompleteParams,
  LeadSourceAutocompleteResult,
  LeadSourcePlaceDetailsResult,
  LeadSourceSearchParams
} from "@modules/lead/domain/leadSource.types";
import { WebScrapingService } from "@modules/webScraping/services/webScraping.service";
import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bullmq";

@Injectable()
export class LeadService {
  private readonly logger = new Logger(LeadService.name);

  constructor(
    private readonly leadRepo: LeadRepository,
    private readonly leadSourceRepo: LeadSourceRepository,
    private readonly webScrapingService: WebScrapingService,
    private readonly aiService: AiService,
    @InjectQueue("webScraper") private readonly webScraperQueue: Queue
  ) {}

  async autocomplete(params: LeadSourceAutocompleteParams): Promise<LeadSourceAutocompleteResult[]> {
    return this.leadSourceRepo.autocomplete(params);
  }

  async getPlaceDetails(placeId: string): Promise<LeadSourcePlaceDetailsResult | null> {
    return this.leadSourceRepo.getPlaceDetails(placeId);
  }

  async generate(companyId: string, params: LeadSourceSearchParams): Promise<LeadEntity[]> {
    const results = await this.leadSourceRepo.searchNearby(params);

    const leads = results.map((result) =>
      LeadEntity.create({
        id: result.placeId,
        companyId,
        status: "ENRICHING",
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

    const created = await this.leadRepo.createMany(leads);

    await this.webScraperQueue.addBulk(created.map((lead) => ({ name: "processLead", data: { leadId: lead.id, companyId } })));

    return created;
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

  async processLead(id: string, companyId: string): Promise<LeadEntity> {
    const lead = await this.findById(id, companyId);

    if (lead.status !== "ENRICHING") {
      throw new LeadNotEnrichingError({ id, status: lead.status });
    }

    if (!lead.website) {
      throw new LeadWebsiteMissingError({ id });
    }

    const content = await this.webScrapingService.scrape(lead.website);
    if (!content) {
      throw new LeadWebsiteMissingError({ id, website: lead.website, reason: "Failed to scrape website" });
    }

    const contactInfo = await this.aiService.extractBusinessInfo(content);

    const socialLinks: LeadSocialLinks = {
      instagram: contactInfo.instagram ?? undefined,
      facebook: contactInfo.facebook ?? undefined,
      twitter: contactInfo.twitter ?? undefined,
      linkedin: contactInfo.linkedin ?? undefined,
      tiktok: contactInfo.tiktok ?? undefined,
      youtube: contactInfo.youtube ?? undefined,
      whatsapp: contactInfo.whatsapp ?? undefined,
      otherLinks: contactInfo.other
    };

    return this.update(id, companyId, {
      status: "READY",
      description: contactInfo.description,
      emails: contactInfo.emails,
      otherPhones: contactInfo.phones,
      socialLinks
    });
  }
}
