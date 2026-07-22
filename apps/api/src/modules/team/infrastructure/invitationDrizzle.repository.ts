import { DatabaseService } from "@database/services/database.service";
import { CompanyInvitationEntity } from "@modules/team/domain/invitation.entity";
import { InvitationRepository } from "@modules/team/domain/invitation.repository";
import { InvitationMapper } from "@modules/team/infrastructure/invitation.mapper";
import { Injectable } from "@nestjs/common";
import { companyInvitationTable } from "@schema/index";
import { eq, and } from "drizzle-orm";

@Injectable()
export class InvitationDrizzleRepository extends InvitationRepository {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async create(invitation: CompanyInvitationEntity): Promise<CompanyInvitationEntity> {
    const [row] = await this.databaseService.db.insert(companyInvitationTable).values(InvitationMapper.toPersistence(invitation)).returning();

    return InvitationMapper.toDomain(row);
  }

  async findById(id: string): Promise<CompanyInvitationEntity | null> {
    const [row] = await this.databaseService.db.select().from(companyInvitationTable).where(eq(companyInvitationTable.id, id)).limit(1);

    return row ? InvitationMapper.toDomain(row) : null;
  }

  async findPendingByCompany(companyId: string, email?: string): Promise<CompanyInvitationEntity[]> {
    const rows = await this.databaseService.db
      .select()
      .from(companyInvitationTable)
      .where(
        and(
          eq(companyInvitationTable.companyId, companyId),
          eq(companyInvitationTable.status, "PENDING"),
          email ? eq(companyInvitationTable.email, email) : undefined
        )
      );

    return rows.map(InvitationMapper.toDomain);
  }

  async update(invitation: CompanyInvitationEntity): Promise<CompanyInvitationEntity | null> {
    const [row] = await this.databaseService.db
      .update(companyInvitationTable)
      .set(InvitationMapper.toPersistence(invitation))
      .where(eq(companyInvitationTable.id, invitation.id))
      .returning();

    return row ? InvitationMapper.toDomain(row) : null;
  }
}
