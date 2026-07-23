import { DatabaseService } from "@database/services/database.service";
import { CompanyEntity } from "@modules/company/domain/company.entity";
import { CompanyRepository } from "@modules/company/domain/company.repository";
import { CompanyMembershipEntity, CompanyMembershipStatus } from "@modules/company/domain/companyMembership.entity";
import { CompanyMapper, CompanyMembershipMapper } from "@modules/company/infrastructure/company.mapper";
import { Injectable } from "@nestjs/common";
import { companyTable, companyMembershipTable } from "@schema/index";
import { eq, and, isNull, asc, inArray } from "drizzle-orm";

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

  async findMembershipsByUserId(
    userId: string,
    filters?: { membershipId?: string; companyId?: string; status?: CompanyMembershipStatus[] }
  ): Promise<{ company: CompanyEntity; membership: CompanyMembershipEntity }[]> {
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
          inArray(companyMembershipTable.status, filters?.status ?? ["ACTIVE"]),
          isNull(companyTable.deletedAt),
          filters?.membershipId ? eq(companyMembershipTable.id, filters.membershipId) : undefined,
          filters?.companyId ? eq(companyMembershipTable.companyId, filters.companyId) : undefined
        )
      )
      .orderBy(asc(companyMembershipTable.joinedAt));

    return rows.map((row) => ({
      company: CompanyMapper.toDomain(row.company),
      membership: CompanyMembershipMapper.toDomain(row.membership)
    }));
  }

  async addMembership(membership: CompanyMembershipEntity): Promise<CompanyMembershipEntity> {
    const [row] = await this.databaseService.db.insert(companyMembershipTable).values(CompanyMembershipMapper.toPersistence(membership)).returning();

    return CompanyMembershipMapper.toDomain(row);
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
