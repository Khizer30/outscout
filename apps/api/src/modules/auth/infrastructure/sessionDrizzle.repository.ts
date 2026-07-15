import { DatabaseService } from "@database/services/database.service";
import { SessionEntity } from "@modules/auth/domain/session.entity";
import { SessionRepository } from "@modules/auth/domain/session.repository";
import { SessionMapper } from "@modules/auth/infrastructure/session.mapper";
import { Injectable } from "@nestjs/common";
import { sessionsTable } from "@schema/sessions";
import { eq, lt } from "drizzle-orm";

@Injectable()
export class SessionDrizzleRepository extends SessionRepository {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async create(entity: SessionEntity): Promise<SessionEntity> {
    const [row] = await this.databaseService.db.insert(sessionsTable).values(SessionMapper.toPersistence(entity)).returning();
    return SessionMapper.toDomain(row);
  }

  async findByHash(hash: string): Promise<SessionEntity | null> {
    const [row] = await this.databaseService.db.select().from(sessionsTable).where(eq(sessionsTable.refreshTokenHash, hash)).limit(1);
    return row ? SessionMapper.toDomain(row) : null;
  }

  async update(entity: SessionEntity): Promise<SessionEntity> {
    const [row] = await this.databaseService.db
      .update(sessionsTable)
      .set(SessionMapper.toPersistence(entity))
      .where(eq(sessionsTable.id, entity.id))
      .returning();
    return SessionMapper.toDomain(row);
  }

  async delete(id: string): Promise<void> {
    await this.databaseService.db.delete(sessionsTable).where(eq(sessionsTable.id, id));
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.databaseService.db.delete(sessionsTable).where(eq(sessionsTable.userId, userId));
  }

  async deleteExpired(before: Date): Promise<void> {
    await this.databaseService.db.delete(sessionsTable).where(lt(sessionsTable.expiryTime, before));
  }
}
