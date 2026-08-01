import { DatabaseService } from "@database/services/database.service";
import { AiGeneratedMessageEntity } from "@modules/ai/domain/aiGeneratedMessage.entity";
import { AiGeneratedMessageRepository } from "@modules/ai/domain/aiGeneratedMessage.repository";
import { AiGeneratedMessageMapper } from "@modules/ai/infrastructure/aiGeneratedMessage.mapper";
import { Injectable } from "@nestjs/common";
import { aiGeneratedMessagesTable } from "@schema/index";
import { and, desc, eq } from "drizzle-orm";

@Injectable()
export class AiGeneratedMessageDrizzleRepository extends AiGeneratedMessageRepository {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async create(entity: AiGeneratedMessageEntity): Promise<AiGeneratedMessageEntity> {
    const [row] = await this.databaseService.db.insert(aiGeneratedMessagesTable).values(AiGeneratedMessageMapper.toPersistence(entity)).returning();

    return AiGeneratedMessageMapper.toDomain(row);
  }

  async findById(id: string): Promise<AiGeneratedMessageEntity | null> {
    const [row] = await this.databaseService.db.select().from(aiGeneratedMessagesTable).where(eq(aiGeneratedMessagesTable.id, id));

    return row ? AiGeneratedMessageMapper.toDomain(row) : null;
  }

  async findByLead(leadId: string, companyId: string): Promise<AiGeneratedMessageEntity | null> {
    const [row] = await this.databaseService.db
      .select()
      .from(aiGeneratedMessagesTable)
      .where(and(eq(aiGeneratedMessagesTable.leadId, leadId), eq(aiGeneratedMessagesTable.companyId, companyId)))
      .orderBy(desc(aiGeneratedMessagesTable.createdAt))
      .limit(1);

    return row ? AiGeneratedMessageMapper.toDomain(row) : null;
  }

  async update(entity: AiGeneratedMessageEntity): Promise<AiGeneratedMessageEntity> {
    const [row] = await this.databaseService.db
      .update(aiGeneratedMessagesTable)
      .set({ data: entity.data })
      .where(eq(aiGeneratedMessagesTable.id, entity.id))
      .returning();

    return AiGeneratedMessageMapper.toDomain(row);
  }
}
