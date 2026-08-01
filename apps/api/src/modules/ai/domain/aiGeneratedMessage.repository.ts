import { AiGeneratedMessageEntity } from "@modules/ai/domain/aiGeneratedMessage.entity";

export abstract class AiGeneratedMessageRepository {
  abstract create(entity: AiGeneratedMessageEntity): Promise<AiGeneratedMessageEntity>;
  abstract findById(id: string): Promise<AiGeneratedMessageEntity | null>;
  abstract update(entity: AiGeneratedMessageEntity): Promise<AiGeneratedMessageEntity>;
}
