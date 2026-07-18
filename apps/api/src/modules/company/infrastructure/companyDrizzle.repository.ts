import { DatabaseService } from "@database/services/database.service";
import { CompanyEntity } from "@modules/company/domain/company.entity";
import { CompanyRepository } from "@modules/company/domain/company.repository";
import { CompanyMembershipEntity } from "@modules/company/domain/companyMembership.entity";
import { CompanyMapper, CompanyMembershipMapper } from "@modules/company/infrastructure/company.mapper";
import { Injectable } from "@nestjs/common";
import { companyTable, companyMembershipTable } from "@schema/index";
import { eq, and, isNull } from "drizzle-orm";

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

  async findActiveMembershipByUserId(userId: string): Promise<CompanyMembershipEntity | null> {
    const [row] = await this.databaseService.db
      .select()
      .from(companyMembershipTable)
      .where(and(eq(companyMembershipTable.userId, userId), eq(companyMembershipTable.status, "ACTIVE")))
      .limit(1);

    return row ? CompanyMembershipMapper.toDomain(row) : null;
  }
}
