import { ContactInfo } from "@modules/ai/domain/ai.types";

export abstract class AiRepository {
  abstract extractContactInfo(content: string): Promise<ContactInfo>;
}
