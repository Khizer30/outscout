import { CompanyMessageRulesEntity, CompanyMessageRulesRecord } from "@modules/company/domain/companyMessageRules.entity";
import { CompanyMessageRulesResponseDto } from "@repo/dtos/company";

export class CompanyMessageRulesMapper {
  static toDomain(row: CompanyMessageRulesRecord): CompanyMessageRulesEntity {
    return new CompanyMessageRulesEntity(row.id, row.companyId, row.channel, row.rules, row.greeting, row.version, row.updatedBy, row.createdAt, row.updatedAt);
  }

  static toPersistence(entity: CompanyMessageRulesEntity): CompanyMessageRulesRecord {
    return {
      id: entity.id,
      companyId: entity.companyId,
      channel: entity.channel,
      rules: entity.rules,
      greeting: entity.greeting,
      version: entity.version,
      updatedBy: entity.updatedBy,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  static toResponse(entity: CompanyMessageRulesEntity): CompanyMessageRulesResponseDto {
    return {
      id: entity.id,
      companyId: entity.companyId,
      channel: entity.channel,
      rules: entity.rules,
      greeting: entity.greeting,
      version: entity.version,
      updatedAt: entity.updatedAt
    };
  }
}
