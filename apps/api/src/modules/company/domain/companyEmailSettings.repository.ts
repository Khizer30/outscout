import { CompanyEmailSettingsEntity } from "@modules/company/domain/companyEmailSettings.entity";

export abstract class CompanyEmailSettingsRepository {
  abstract findByCompanyId(companyId: string): Promise<CompanyEmailSettingsEntity | null>;
  abstract upsert(settings: CompanyEmailSettingsEntity): Promise<CompanyEmailSettingsEntity>;
}
