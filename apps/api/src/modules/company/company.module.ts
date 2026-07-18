import { DatabaseModule } from "@database/database.module";
import { CompanyRepository } from "@modules/company/domain/company.repository";
import { CompanyDrizzleRepository } from "@modules/company/infrastructure/companyDrizzle.repository";
import { CompanyController } from "@modules/company/presentation/company.controller";
import { CompanyService } from "@modules/company/services/company.service";
import { JWTModule } from "@modules/jwt/jwt.module";
import { MediaModule } from "@modules/media/media.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [DatabaseModule, JWTModule, MediaModule],
  controllers: [CompanyController],
  providers: [
    CompanyService,
    {
      provide: CompanyRepository,
      useClass: CompanyDrizzleRepository
    }
  ],
  exports: [CompanyService, CompanyRepository]
})
export class CompanyModule {}
