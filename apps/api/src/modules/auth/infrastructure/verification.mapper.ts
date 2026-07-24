import { VerificationEntity } from "@modules/auth/domain/verification.entity";
import { Verification, VerificationInsert } from "@schema/index";

export class VerificationMapper {
  static toDomain(row: Verification): VerificationEntity {
    return new VerificationEntity(row.id, row.userId, row.type, row.otp, row.expiresAt, row.used, row.createdAt);
  }

  static toPersistence(entity: VerificationEntity): VerificationInsert {
    return {
      id: entity.id,
      userId: entity.userId,
      type: entity.type,
      otp: entity.otp,
      expiresAt: entity.expiresAt,
      used: entity.used,
      createdAt: entity.createdAt
    };
  }
}
