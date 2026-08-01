import { ContactInfo, GenerateOutreachMessageInput, GeneratedMessage, RewriteOutreachMessageInput } from "@modules/ai/domain/ai.types";

export abstract class AiRepository {
  abstract extractBusinessInfo(content: string): Promise<ContactInfo>;
  abstract generateOutreachMessage(input: GenerateOutreachMessageInput): Promise<GeneratedMessage>;
  abstract rewriteOutreachMessage(input: RewriteOutreachMessageInput): Promise<GeneratedMessage>;
}
