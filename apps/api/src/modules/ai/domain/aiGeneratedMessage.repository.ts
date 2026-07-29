import { AiGeneratedMessageEntity } from "@modules/ai/domain/aiGeneratedMessage.entity";

export abstract class AiGeneratedMessageRepository {
  abstract create(entity: AiGeneratedMessageEntity): Promise<AiGeneratedMessageEntity>;
}
