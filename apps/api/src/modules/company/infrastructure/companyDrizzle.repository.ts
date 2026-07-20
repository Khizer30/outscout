import { DatabaseService } from "@database/services/database.service";
import { CompanyEntity } from "@modules/company/domain/company.entity";
import { CompanyRepository } from "@modules/company/domain/company.repository";
import { CompanyMembershipEntity } from "@modules/company/domain/companyMembership.entity";
import { CompanyMapper, CompanyMembershipMapper } from "@modules/company/infrastructure/company.mapper";
import { Injectable } from "@nestjs/common";
import { companyTable, companyMembershipTable } from "@schema/index";
import { eq, and, isNull, asc } from "drizzle-orm";

@Injectable()
export class CompanyDrizzleRepository extends CompanyRepository {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async create(company: CompanyEntity, membership: CompanyMembershipEntity): Promise<{ company: CompanyEntity; membership: CompanyMembershipEntity }> {
    return await this.databaseService.db.transaction(async (tx) => {
      const [companyRow] = await tx.insert(companyTable).values(CompanyMapper.toPersistence(company)).returning();

      const [membershipRow] = await tx.insert(companyMembershipTable).values(CompanyMembershipMapper.toPersistence(membership)).returning();

      return {
        company: CompanyMapper.toDomain(companyRow),
        membership: CompanyMembershipMapper.toDomain(membershipRow)
      };
    });
  }

  async findById(id: string): Promise<CompanyEntity | null> {
    const [row] = await this.databaseService.db
      .select()
      .from(companyTable)
      .where(and(eq(companyTable.id, id), isNull(companyTable.deletedAt)))
      .limit(1);

    return row ? CompanyMapper.toDomain(row) : null;
  }

  async findActiveMembershipsByUserId(userId: string, membershipId?: string): Promise<{ company: CompanyEntity; membership: CompanyMembershipEntity }[]> {
    const rows = await this.databaseService.db
      .select({
        company: companyTable,
        membership: companyMembershipTable
      })
      .from(companyTable)
      .innerJoin(companyMembershipTable, eq(companyTable.id, companyMembershipTable.companyId))
      .where(
        and(
          eq(companyMembershipTable.userId, userId),
          eq(companyMembershipTable.status, "ACTIVE"),
          isNull(companyTable.deletedAt),
          membershipId ? eq(companyMembershipTable.id, membershipId) : undefined
        )
      )
      .orderBy(asc(companyMembershipTable.joinedAt));

    return rows.map((row) => ({
      company: CompanyMapper.toDomain(row.company),
      membership: CompanyMembershipMapper.toDomain(row.membership)
    }));
  }

  async update(company: CompanyEntity): Promise<CompanyEntity | null> {
    const [row] = await this.databaseService.db
      .update(companyTable)
      .set(CompanyMapper.toPersistence(company))
      .where(eq(companyTable.id, company.id))
      .returning();

    return row ? CompanyMapper.toDomain(row) : null;
  }
}
