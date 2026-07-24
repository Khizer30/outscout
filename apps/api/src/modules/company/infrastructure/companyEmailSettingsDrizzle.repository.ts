import { DatabaseService } from "@database/services/database.service";
import { CompanyEmailSettingsEntity } from "@modules/company/domain/companyEmailSettings.entity";
import { CompanyEmailSettingsRepository } from "@modules/company/domain/companyEmailSettings.repository";
import { CompanyEmailSettingsMapper } from "@modules/company/infrastructure/companyEmailSettings.mapper";
import { Injectable } from "@nestjs/common";
import { companyEmailSettingsTable } from "@schema/index";
import { eq } from "drizzle-orm";

@Injectable()
export class CompanyEmailSettingsDrizzleRepository extends CompanyEmailSettingsRepository {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async findByCompanyId(companyId: string): Promise<CompanyEmailSettingsEntity | null> {
    const [row] = await this.databaseService.db.select().from(companyEmailSettingsTable).where(eq(companyEmailSettingsTable.companyId, companyId)).limit(1);

    return row ? CompanyEmailSettingsMapper.toDomain(row) : null;
  }

  async upsert(settings: CompanyEmailSettingsEntity): Promise<CompanyEmailSettingsEntity> {
    const values = CompanyEmailSettingsMapper.toPersistence(settings);

    const [row] = await this.databaseService.db
      .insert(companyEmailSettingsTable)
      .values(values)
      .onConflictDoUpdate({
        target: companyEmailSettingsTable.companyId,
        set: values
      })
      .returning();

    return CompanyEmailSettingsMapper.toDomain(row);
  }
}
