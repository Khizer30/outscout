import { DatabaseService } from "@database/services/database.service";
import { LeadEntity } from "@modules/lead/domain/lead.entity";
import { LeadRepository } from "@modules/lead/domain/lead.repository";
import { LeadStatus } from "@modules/lead/domain/lead.types";
import { LeadMapper } from "@modules/lead/infrastructure/lead.mapper";
import { Injectable } from "@nestjs/common";
import { leadsTable } from "@schema/index";
import { and, eq, inArray } from "drizzle-orm";

@Injectable()
export class LeadDrizzleRepository extends LeadRepository {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async create(lead: LeadEntity): Promise<LeadEntity> {
    const [row] = await this.databaseService.db.insert(leadsTable).values(LeadMapper.toPersistence(lead)).returning();

    return LeadMapper.toDomain(row);
  }

  async findById(id: string): Promise<LeadEntity | null> {
    const [row] = await this.databaseService.db.select().from(leadsTable).where(eq(leadsTable.id, id)).limit(1);

    return row ? LeadMapper.toDomain(row) : null;
  }

  async findByCompany(companyId: string, filters?: { status?: LeadStatus[] }): Promise<LeadEntity[]> {
    const rows = await this.databaseService.db
      .select()
      .from(leadsTable)
      .where(and(eq(leadsTable.companyId, companyId), filters?.status ? inArray(leadsTable.status, filters.status) : undefined));

    return rows.map(LeadMapper.toDomain);
  }

  async update(lead: LeadEntity): Promise<LeadEntity | null> {
    const [row] = await this.databaseService.db.update(leadsTable).set(LeadMapper.toPersistence(lead)).where(eq(leadsTable.id, lead.id)).returning();

    return row ? LeadMapper.toDomain(row) : null;
  }
}
