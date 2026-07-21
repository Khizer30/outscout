import { DatabaseService } from "@database/services/database.service";
import { CompanyMessageRulesEntity, MessageChannel } from "@modules/company/domain/companyMessageRules.entity";
import { CompanyMessageRulesRepository } from "@modules/company/domain/companyMessageRules.repository";
import { CompanyMessageRulesMapper } from "@modules/company/infrastructure/companyMessageRules.mapper";
import { Injectable } from "@nestjs/common";
import { companyMessageRulesHistoryTable, companyMessageRulesTable } from "@schema/index";
import { and, eq } from "drizzle-orm";

@Injectable()
export class CompanyMessageRulesDrizzleRepository extends CompanyMessageRulesRepository {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async findByCompanyAndChannel(companyId: string, channel: MessageChannel): Promise<CompanyMessageRulesEntity | null> {
    const [row] = await this.databaseService.db
      .select()
      .from(companyMessageRulesTable)
      .where(and(eq(companyMessageRulesTable.companyId, companyId), eq(companyMessageRulesTable.channel, channel)))
      .limit(1);

    return row ? CompanyMessageRulesMapper.toDomain(row) : null;
  }

  async upsert(entity: CompanyMessageRulesEntity, previous: CompanyMessageRulesEntity | null): Promise<CompanyMessageRulesEntity> {
    return this.databaseService.db.transaction(async (tx) => {
      if (previous) {
        await tx.insert(companyMessageRulesHistoryTable).values({
          companyMessageRulesId: previous.id,
          companyId: previous.companyId,
          channel: previous.channel,
          version: previous.version,
          rules: previous.rules,
          greeting: previous.greeting,
          changedAt: previous.updatedAt
        });
      }

      const values = CompanyMessageRulesMapper.toPersistence(entity);

      const [row] = await tx
        .insert(companyMessageRulesTable)
        .values(values)
        .onConflictDoUpdate({
          target: [companyMessageRulesTable.companyId, companyMessageRulesTable.channel],
          set: values
        })
        .returning();

      return CompanyMessageRulesMapper.toDomain(row);
    });
  }
}
