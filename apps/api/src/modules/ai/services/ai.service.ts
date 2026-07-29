import { AiGenerationFailedError } from "@modules/ai/domain/ai.errors";
import { AiRepository } from "@modules/ai/domain/ai.repository";
import { ContactInfo, GeneratedMessage, MessageChannel } from "@modules/ai/domain/ai.types";
import { CompanyNotFoundError } from "@modules/company/domain/company.errors";
import { CompanyService } from "@modules/company/services/company.service";
import { CompanyMessageRulesService } from "@modules/company/services/companyMessageRules.service";
import { LeadAccessDeniedError, LeadNotFoundError } from "@modules/lead/domain/lead.errors";
import { LeadRepository } from "@modules/lead/domain/lead.repository";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly aiRepo: AiRepository,
    private readonly leadRepo: LeadRepository,
    private readonly companyService: CompanyService,
    private readonly companyMessageRulesService: CompanyMessageRulesService
  ) {}

  async extractBusinessInfo(content: string): Promise<ContactInfo> {
    try {
      return await this.aiRepo.extractBusinessInfo(content);
    } catch (error) {
      this.logger.error(`Failed to extract contact info: ${error instanceof Error ? error.message : String(error)}`);
      throw new AiGenerationFailedError();
    }
  }

  async generateOutreachMessage(leadId: string, companyId: string, channel: MessageChannel): Promise<GeneratedMessage> {
    const lead = await this.leadRepo.findById(leadId);
    if (!lead) {
      throw new LeadNotFoundError({ id: leadId });
    }

    if (lead.companyId !== companyId) {
      throw new LeadAccessDeniedError({ id: leadId });
    }

    const company = await this.companyService.findById(companyId);
    if (!company) {
      throw new CompanyNotFoundError({ id: companyId });
    }

    const messageRules = await this.companyMessageRulesService.findByCompanyAndChannel(companyId, channel);

    try {
      return await this.aiRepo.generateOutreachMessage({
        channel,
        lead: {
          name: lead.name,
          description: lead.description,
          primaryType: lead.primaryType,
          address: lead.address,
          phone: lead.phone,
          website: lead.website,
          businessStatus: lead.businessStatus,
          rating: lead.rating,
          userRatingCount: lead.userRatingCount,
          emails: lead.emails,
          socialLinks: lead.socialLinks
        },
        company: { about: company.about },
        messageRules: { rules: messageRules?.rules ?? null, greeting: messageRules?.greeting ?? null }
      });
    } catch (error) {
      this.logger.error(`Failed to generate outreach message: ${error instanceof Error ? error.message : String(error)}`);
      throw new AiGenerationFailedError();
    }
  }
}
