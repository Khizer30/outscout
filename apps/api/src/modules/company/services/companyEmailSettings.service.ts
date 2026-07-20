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
    private readonly encryptionService: EncryptionService
  ) {}

  async updateSettings(companyId: string, data: UpdateCompanyEmailSettingsData): Promise<CompanyEmailSettingsEntity> {
    const existing = await this.companyEmailSettingsRepo.findByCompanyId(companyId);

    const brevoApiKeyCipher = data.brevoApiKey !== undefined ? this.encryptionService.encrypt(data.brevoApiKey) : undefined;

    const settings = existing ? existing.update({ ...data, brevoApiKeyCipher }) : CompanyEmailSettingsEntity.create({ companyId, ...data, brevoApiKeyCipher });

    return this.companyEmailSettingsRepo.upsert(settings);
  }
}
