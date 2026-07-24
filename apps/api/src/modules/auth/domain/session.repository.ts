import { SessionEntity } from "@modules/auth/domain/session.entity";

export abstract class SessionRepository {
  abstract create(session: SessionEntity): Promise<SessionEntity>;
  abstract findByHash(hash: string): Promise<SessionEntity | null>;
  abstract update(session: SessionEntity): Promise<SessionEntity>;
  abstract delete(id: string): Promise<void>;
  abstract deleteByUserId(userId: string): Promise<void>;
  abstract deleteExpired(before: Date): Promise<void>;
}
