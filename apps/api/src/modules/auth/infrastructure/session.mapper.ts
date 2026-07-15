import { SessionEntity } from "@modules/auth/domain/session.entity";
import { Session, SessionInsert } from "@schema/index";

export class SessionMapper {
  static toDomain(row: Session): SessionEntity {
    return new SessionEntity(
      row.id,
      row.userId,
      row.refreshTokenHash,
      row.ipAddress,
      row.expiryTime,
      row.createdAt
    );
  }

  static toPersistence(entity: SessionEntity): SessionInsert {
    return {
      id: entity.id,
      userId: entity.userId,
      refreshTokenHash: entity.refreshTokenHash,
      ipAddress: entity.ipAddress,
      expiryTime: entity.expiryTime,
      createdAt: entity.createdAt
    };
  }
}
