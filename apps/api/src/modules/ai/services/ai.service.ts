import {
  AiGenerationFailedError,
  AiGeneratedMessageAccessDeniedError,
  AiGeneratedMessageNotFoundError,
  InvalidMessagePartError
} from "@modules/ai/domain/ai.errors";
import { AiRepository } from "@modules/ai/domain/ai.repository";
import { ContactInfo, EMAIL_MESSAGE_PARTS, MessageChannel, MessagePart, WHATSAPP_MESSAGE_PARTS } from "@modules/ai/domain/ai.types";
import { AiGeneratedMessageEntity } from "@modules/ai/domain/aiGeneratedMessage.entity";
import { AiGeneratedMessageRepository } from "@modules/ai/domain/aiGeneratedMessage.repository";
import { CompanyNotFoundError } from "@modules/company/domain/company.errors";
import { CompanyService } from "@modules/company/services/company.service";
import { CompanyMessageRulesService } from "@modules/company/services/companyMessageRules.service";
import { LeadEntity } from "@modules/lead/domain/lead.entity";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly aiRepo: AiRepository,
    private readonly companyService: CompanyService,
    private readonly companyMessageRulesService: CompanyMessageRulesService,
    private readonly aiGeneratedMessageRepo: AiGeneratedMessageRepository
  ) {}

  async extractBusinessInfo(content: string): Promise<ContactInfo> {
    try {
      return await this.aiRepo.extractBusinessInfo(content);
    } catch (error) {
      this.logger.error(`Failed to extract contact info: ${error instanceof Error ? error.message : String(error)}`);
      throw new AiGenerationFailedError();
    }
  }

  async generateOutreachMessage(lead: LeadEntity, companyId: string, channel: MessageChannel, userId: string): Promise<AiGeneratedMessageEntity> {
    const company = await this.companyService.findById(companyId);
    if (!company) {
      throw new CompanyNotFoundError({ id: companyId });
    }

    const messageRules = await this.companyMessageRulesService.findByCompanyAndChannel(companyId, channel);

    try {
      const generated = await this.aiRepo.generateOutreachMessage({
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

      const entity = AiGeneratedMessageEntity.create({
        leadId: lead.id,
        companyId,
        companyMessageRulesId: messageRules?.id ?? null,
        companyMessageRulesVersion: messageRules?.version ?? null,
        data: generated,
        createdBy: userId
      });

      return await this.aiGeneratedMessageRepo.create(entity);
    } catch (error) {
      this.logger.error(`Failed to generate outreach message: ${error instanceof Error ? error.message : String(error)}`);
      throw new AiGenerationFailedError();
    }
  }

  async rewriteOutreachMessage(id: string, companyId: string, prompt: string, messagePart: MessagePart | undefined): Promise<AiGeneratedMessageEntity> {
    const existing = await this.aiGeneratedMessageRepo.findById(id);
    if (!existing) {
      throw new AiGeneratedMessageNotFoundError({ id });
    }

    if (existing.companyId !== companyId) {
      throw new AiGeneratedMessageAccessDeniedError({ id });
    }

    if (messagePart) {
      const validParts: readonly string[] = existing.data.channel === "EMAIL" ? EMAIL_MESSAGE_PARTS : WHATSAPP_MESSAGE_PARTS;
      if (!validParts.includes(messagePart)) {
        throw new InvalidMessagePartError({ messagePart, channel: existing.data.channel });
      }
    }

    try {
      const rewritten = await this.aiRepo.rewriteOutreachMessage({ data: existing.data, prompt, messagePart });

      const updated = AiGeneratedMessageEntity.create({
        id: existing.id,
        leadId: existing.leadId,
        companyId: existing.companyId,
        companyMessageRulesId: existing.companyMessageRulesId,
        companyMessageRulesVersion: existing.companyMessageRulesVersion,
        data: rewritten,
        createdBy: existing.createdBy,
        createdAt: existing.createdAt
      });

      return await this.aiGeneratedMessageRepo.update(updated);
    } catch (error) {
      this.logger.error(`Failed to rewrite outreach message: ${error instanceof Error ? error.message : String(error)}`);
      throw new AiGenerationFailedError();
    }
  }

  async getByLead(leadId: string, companyId: string): Promise<AiGeneratedMessageEntity> {
    const message = await this.aiGeneratedMessageRepo.findByLead(leadId, companyId);
    if (!message) {
      throw new AiGeneratedMessageNotFoundError({ leadId });
    }

    return message;
  }
}
