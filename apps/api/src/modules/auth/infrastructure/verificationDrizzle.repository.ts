import { DatabaseService } from "@database/services/database.service";
import { VerificationEntity } from "@modules/auth/domain/verification.entity";
import { VerificationRepository } from "@modules/auth/domain/verification.repository";
import { VerificationMapper } from "@modules/auth/infrastructure/verification.mapper";
import { Injectable } from "@nestjs/common";
import { verificationsTable } from "@schema/verifications";

@Injectable()
export class VerificationDrizzleRepository extends VerificationRepository {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async create(entity: VerificationEntity): Promise<VerificationEntity> {
    const [row] = await this.databaseService.db.insert(verificationsTable).values(VerificationMapper.toPersistence(entity)).returning();
    return VerificationMapper.toDomain(row);
  }
}
