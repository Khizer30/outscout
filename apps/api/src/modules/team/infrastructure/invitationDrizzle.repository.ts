import { DatabaseService } from "@database/services/database.service";
import { CompanyInvitationEntity } from "@modules/team/domain/invitation.entity";
import { InvitationRepository } from "@modules/team/domain/invitation.repository";
import { InvitationMapper } from "@modules/team/infrastructure/invitation.mapper";
import { Injectable } from "@nestjs/common";
import { companyInvitationTable, usersTable } from "@schema/index";
import { eq, and } from "drizzle-orm";

@Injectable()
export class InvitationDrizzleRepository extends InvitationRepository {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async create(invitation: CompanyInvitationEntity): Promise<CompanyInvitationEntity> {
    const [row] = await this.databaseService.db.insert(companyInvitationTable).values(InvitationMapper.toPersistence(invitation)).returning();

    const created = await this.findById(row.id);
    return created!;
  }

  async findById(id: string): Promise<CompanyInvitationEntity | null> {
    const [row] = await this.databaseService.db
      .select({
        invitation: companyInvitationTable,
        invitedBy: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          profileImage: usersTable.profileImageURL
        }
      })
      .from(companyInvitationTable)
      .leftJoin(usersTable, eq(companyInvitationTable.invitedBy, usersTable.id))
      .where(eq(companyInvitationTable.id, id))
      .limit(1);

    if (!row) {
      return null;
    }

    return InvitationMapper.toDomain({
      ...row.invitation,
      invitedBy: row.invitedBy && row.invitedBy.id ? row.invitedBy : null
    });
  }

  async findPendingByCompany(companyId: string, email?: string): Promise<CompanyInvitationEntity[]> {
    const rows = await this.databaseService.db
      .select({
        invitation: companyInvitationTable,
        invitedBy: {
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          profileImage: usersTable.profileImageURL
        }
      })
      .from(companyInvitationTable)
      .leftJoin(usersTable, eq(companyInvitationTable.invitedBy, usersTable.id))
      .where(
        and(
          eq(companyInvitationTable.companyId, companyId),
          eq(companyInvitationTable.status, "PENDING"),
          email ? eq(companyInvitationTable.email, email) : undefined
        )
      );

    return rows.map((row) =>
      InvitationMapper.toDomain({
        ...row.invitation,
        invitedBy: row.invitedBy && row.invitedBy.id ? row.invitedBy : null
      })
    );
  }

  async update(invitation: CompanyInvitationEntity): Promise<CompanyInvitationEntity | null> {
    const [row] = await this.databaseService.db
      .update(companyInvitationTable)
      .set(InvitationMapper.toPersistence(invitation))
      .where(eq(companyInvitationTable.id, invitation.id))
      .returning();

    return row ? this.findById(row.id) : null;
  }
}
