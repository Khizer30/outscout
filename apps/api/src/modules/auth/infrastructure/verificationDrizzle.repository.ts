import { DatabaseService } from "@database/services/database.service";
import { VerificationEntity, VerificationType } from "@modules/auth/domain/verification.entity";
import { VerificationRepository } from "@modules/auth/domain/verification.repository";
import { VerificationMapper } from "@modules/auth/infrastructure/verification.mapper";
import { Injectable } from "@nestjs/common";
import { verificationsTable } from "@schema/verifications";
import { eq, and } from "drizzle-orm";

@Injectable()
export class VerificationDrizzleRepository extends VerificationRepository {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async create(entity: VerificationEntity): Promise<VerificationEntity> {
    const [row] = await this.databaseService.db.insert(verificationsTable).values(VerificationMapper.toPersistence(entity)).returning();
    return VerificationMapper.toDomain(row);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.databaseService.db.delete(verificationsTable).where(eq(verificationsTable.userId, userId));
  }

  async findActive(userId: string, otp: string, type: VerificationType): Promise<VerificationEntity | null> {
    const [row] = await this.databaseService.db
      .select()
      .from(verificationsTable)
      .where(and(eq(verificationsTable.userId, userId), eq(verificationsTable.otp, otp), eq(verificationsTable.type, type), eq(verificationsTable.used, false)))
      .limit(1);

    return row ? VerificationMapper.toDomain(row) : null;
  }

  async update(entity: VerificationEntity): Promise<VerificationEntity> {
    const [row] = await this.databaseService.db
      .update(verificationsTable)
      .set(VerificationMapper.toPersistence(entity))
      .where(eq(verificationsTable.id, entity.id))
      .returning();

    return VerificationMapper.toDomain(row);
  }
}
