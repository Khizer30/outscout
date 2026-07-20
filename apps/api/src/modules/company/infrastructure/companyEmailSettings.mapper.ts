import { CompanyEmailSettingsEntity, CompanyEmailSettingsRecord } from "@modules/company/domain/companyEmailSettings.entity";
import { CompanyEmailSettingsResponseDto } from "@repo/dtos/company";

export class CompanyEmailSettingsMapper {
  static toDomain(row: CompanyEmailSettingsRecord): CompanyEmailSettingsEntity {
    return new CompanyEmailSettingsEntity(
      row.companyId,
      row.brevoApiKeyCipher,
      row.fromEmail,
      row.emailSignature,
      row.primaryColor,
      row.secondaryColor,
      row.updatedAt
    );
  }

  static toPersistence(entity: CompanyEmailSettingsEntity): CompanyEmailSettingsRecord {
    return {
      companyId: entity.companyId,
      brevoApiKeyCipher: entity.brevoApiKeyCipher,
      fromEmail: entity.fromEmail,
      emailSignature: entity.emailSignature,
      primaryColor: entity.primaryColor,
      secondaryColor: entity.secondaryColor,
      updatedAt: entity.updatedAt
    };
  }

  static toResponse(entity: CompanyEmailSettingsEntity): CompanyEmailSettingsResponseDto {
    return {
      companyId: entity.companyId,
      fromEmail: entity.fromEmail,
      emailSignature: entity.emailSignature,
      primaryColor: entity.primaryColor,
      secondaryColor: entity.secondaryColor,
      hasBrevoApiKey: entity.brevoApiKeyCipher !== null,
      updatedAt: entity.updatedAt
    };
  }
}
