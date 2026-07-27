import { AiGenerationFailedError } from "@modules/ai/domain/ai.errors";
import { AiRepository } from "@modules/ai/domain/ai.repository";
import { ContactInfo } from "@modules/ai/domain/ai.types";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly aiRepo: AiRepository) {}

  async extractBusinessInfo(content: string): Promise<ContactInfo> {
    try {
      return await this.aiRepo.extractBusinessInfo(content);
    } catch (error) {
      this.logger.error(`Failed to extract contact info: ${error instanceof Error ? error.message : String(error)}`);
      throw new AiGenerationFailedError();
    }
  }
}
