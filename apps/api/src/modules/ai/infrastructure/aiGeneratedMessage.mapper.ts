import { GeneratedMessage } from "@modules/ai/domain/ai.types";
import { AiGeneratedMessageEntity } from "@modules/ai/domain/aiGeneratedMessage.entity";
import { AiGeneratedMessage, AiGeneratedMessageInsert } from "@schema/index";

export class AiGeneratedMessageMapper {
  static toDomain(row: AiGeneratedMessage): AiGeneratedMessageEntity {
    return new AiGeneratedMessageEntity(
      row.id,
      row.leadId,
      row.companyId,
      row.companyMessageRulesId,
      row.companyMessageRulesVersion,
      row.data as GeneratedMessage,
      row.createdBy,
      row.createdAt
    );
  }

  static toPersistence(entity: AiGeneratedMessageEntity): AiGeneratedMessageInsert {
    return {
      id: entity.id,
      leadId: entity.leadId,
      companyId: entity.companyId,
      companyMessageRulesId: entity.companyMessageRulesId,
      companyMessageRulesVersion: entity.companyMessageRulesVersion,
      data: entity.data,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt
    };
  }
}
