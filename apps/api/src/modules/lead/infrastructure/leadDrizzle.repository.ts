import { DatabaseService } from "@database/services/database.service";
import { LeadEntity } from "@modules/lead/domain/lead.entity";
import { LeadRepository } from "@modules/lead/domain/lead.repository";
import { LeadStatus } from "@modules/lead/domain/lead.types";
import { LeadMapper } from "@modules/lead/infrastructure/lead.mapper";
import { Injectable } from "@nestjs/common";
import { leadsTable } from "@schema/index";
import { and, count, desc, eq, inArray } from "drizzle-orm";

@Injectable()
export class LeadDrizzleRepository extends LeadRepository {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async createMany(leads: LeadEntity[]): Promise<LeadEntity[]> {
    if (leads.length === 0) {
      return [];
    }

    const rows = await this.databaseService.db
      .insert(leadsTable)
      .values(leads.map(LeadMapper.toPersistence))
      .onConflictDoNothing({ target: leadsTable.id })
      .returning();

    return rows.map(LeadMapper.toDomain);
  }

  async findById(id: string): Promise<LeadEntity | null> {
    const [row] = await this.databaseService.db.select().from(leadsTable).where(eq(leadsTable.id, id)).limit(1);

    return row ? LeadMapper.toDomain(row) : null;
  }

  async findByCompany(
    companyId: string,
    filters?: { status?: LeadStatus[] },
    pagination?: { page: number; limit: number }
  ): Promise<{ leads: LeadEntity[]; total: number }> {
    const where = and(eq(leadsTable.companyId, companyId), filters?.status ? inArray(leadsTable.status, filters.status) : undefined);

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;

    const [rows, [{ total }]] = await Promise.all([
      this.databaseService.db
        .select()
        .from(leadsTable)
        .where(where)
        .orderBy(desc(leadsTable.createdAt))
        .limit(limit)
        .offset((page - 1) * limit),
      this.databaseService.db.select({ total: count() }).from(leadsTable).where(where)
    ]);

    return { leads: rows.map(LeadMapper.toDomain), total };
  }

  async update(lead: LeadEntity): Promise<LeadEntity | null> {
    const [row] = await this.databaseService.db.update(leadsTable).set(LeadMapper.toPersistence(lead)).where(eq(leadsTable.id, lead.id)).returning();

    return row ? LeadMapper.toDomain(row) : null;
  }
}
