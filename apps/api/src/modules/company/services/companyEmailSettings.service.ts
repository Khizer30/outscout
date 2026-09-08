import { AuditService } from "@modules/audit/services/audit.service";
import { CompanyEmailNotConfiguredError } from "@modules/company/domain/company.errors";
import { CompanyEmailSettingsEntity } from "@modules/company/domain/companyEmailSettings.entity";
import { CompanyEmailSettingsRepository } from "@modules/company/domain/companyEmailSettings.repository";
import { EncryptionService } from "@modules/encryption/services/encryption.service";
import { Injectable } from "@nestjs/common";

interface UpdateCompanyEmailSettingsData {
  brevoApiKey?: string;
  fromEmail?: string | null;
  emailSignature?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
}

@Injectable()
export class CompanyEmailSettingsService {
  constructor(
    private readonly companyEmailSettingsRepo: CompanyEmailSettingsRepository,
    private readonly encryptionService: EncryptionService,
    private readonly auditService: AuditService
  ) {}

  async getSettings(companyId: string): Promise<CompanyEmailSettingsEntity> {
    const existing = await this.companyEmailSettingsRepo.findByCompanyId(companyId);
    return existing ?? CompanyEmailSettingsEntity.create({ companyId });
  }

  async updateSettings(companyId: string, data: UpdateCompanyEmailSettingsData, actorId: string): Promise<CompanyEmailSettingsEntity> {
    const existing = await this.companyEmailSettingsRepo.findByCompanyId(companyId);

    const brevoApiKeyCipher = data.brevoApiKey !== undefined ? this.encryptionService.encrypt(data.brevoApiKey) : undefined;

    const settings = existing ? existing.update({ ...data, brevoApiKeyCipher }) : CompanyEmailSettingsEntity.create({ companyId, ...data, brevoApiKeyCipher });

    const saved = await this.companyEmailSettingsRepo.upsert(settings);

    await this.auditService.log({ action: "EMAIL_SETTINGS_UPDATED", actorId, companyId });

    return saved;
  }

  async getDecryptedSettings(companyId: string): Promise<{
    apiKey: string;
    fromEmail: string;
    emailSignature: string | null;
    primaryColor: string | null;
    secondaryColor: string | null;
  }> {
    const settings = await this.companyEmailSettingsRepo.findByCompanyId(companyId);

    if (!settings?.brevoApiKeyCipher || !settings.fromEmail) {
      throw new CompanyEmailNotConfiguredError({ companyId });
    }

    return {
      apiKey: this.encryptionService.decrypt(settings.brevoApiKeyCipher),
      fromEmail: settings.fromEmail,
      emailSignature: settings.emailSignature,
      primaryColor: settings.primaryColor,
      secondaryColor: settings.secondaryColor
    };
  }
}
