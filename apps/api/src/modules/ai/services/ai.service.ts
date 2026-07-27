import { AiGenerationFailedError } from "@modules/ai/domain/ai.errors";
import { AiRepository } from "@modules/ai/domain/ai.repository";
import { ContactInfo } from "@modules/ai/domain/ai.types";
import { WebScrapingService } from "@modules/webScraping/services/webScraping.service";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly aiRepo: AiRepository,
    private readonly webScrapingService: WebScrapingService
  ) {}

  async extractContactInfo(websiteUrl: string): Promise<ContactInfo> {
    const content = await this.webScrapingService.scrape(websiteUrl);
    if (!content) {
      throw new AiGenerationFailedError({ websiteUrl, reason: "Failed to scrape website" });
    }

    try {
      return await this.aiRepo.extractContactInfo(content);
    } catch (error) {
      this.logger.error(`Failed to extract contact info for ${websiteUrl}: ${error instanceof Error ? error.message : String(error)}`);
      throw new AiGenerationFailedError({ websiteUrl });
    }
  }
}
