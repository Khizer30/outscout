import { ContactInfo } from "@modules/ai/domain/ai.types";

export abstract class AiRepository {
  abstract extractBusinessInfo(content: string): Promise<ContactInfo>;
}
