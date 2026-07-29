import { DatabaseService } from "@database/services/database.service";
import { AiGeneratedMessageEntity } from "@modules/ai/domain/aiGeneratedMessage.entity";
import { AiGeneratedMessageRepository } from "@modules/ai/domain/aiGeneratedMessage.repository";
import { AiGeneratedMessageMapper } from "@modules/ai/infrastructure/aiGeneratedMessage.mapper";
import { Injectable } from "@nestjs/common";
import { aiGeneratedMessagesTable } from "@schema/index";

@Injectable()
export class AiGeneratedMessageDrizzleRepository extends AiGeneratedMessageRepository {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async create(entity: AiGeneratedMessageEntity): Promise<AiGeneratedMessageEntity> {
    const [row] = await this.databaseService.db.insert(aiGeneratedMessagesTable).values(AiGeneratedMessageMapper.toPersistence(entity)).returning();

    return AiGeneratedMessageMapper.toDomain(row);
  }
}
