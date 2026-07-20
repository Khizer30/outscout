import { DatabaseModule } from "@database/database.module";
import { CompanyRepository } from "@modules/company/domain/company.repository";
import { CompanyEmailSettingsRepository } from "@modules/company/domain/companyEmailSettings.repository";
import { CompanyDrizzleRepository } from "@modules/company/infrastructure/companyDrizzle.repository";
import { CompanyEmailSettingsDrizzleRepository } from "@modules/company/infrastructure/companyEmailSettingsDrizzle.repository";
import { CompanyController } from "@modules/company/presentation/company.controller";
import { CompanyService } from "@modules/company/services/company.service";
import { CompanyEmailSettingsService } from "@modules/company/services/companyEmailSettings.service";
import { EncryptionModule } from "@modules/encryption/encryption.module";
import { JWTModule } from "@modules/jwt/jwt.module";
import { MediaModule } from "@modules/media/media.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [DatabaseModule, JWTModule, MediaModule, EncryptionModule],
  controllers: [CompanyController],
  providers: [
    CompanyService,
    CompanyEmailSettingsService,
    {
      provide: CompanyRepository,
      useClass: CompanyDrizzleRepository
    },
    {
      provide: CompanyEmailSettingsRepository,
      useClass: CompanyEmailSettingsDrizzleRepository
    }
  ],
  exports: [CompanyService, CompanyRepository, CompanyEmailSettingsService, CompanyEmailSettingsRepository]
})
export class CompanyModule {}
