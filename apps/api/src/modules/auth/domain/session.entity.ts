import { createId } from "@paralleldrive/cuid2";

export class SessionEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly refreshTokenHash: string,
    public readonly ipAddress: string,
    public readonly expiryTime: Date,
    public readonly createdAt: Date
  ) {}

  static create(props: { id?: string; userId: string; refreshTokenHash: string; ipAddress: string; expiryTime: Date; createdAt?: Date }): SessionEntity {
    return new SessionEntity(props.id ?? createId(), props.userId, props.refreshTokenHash, props.ipAddress, props.expiryTime, props.createdAt ?? new Date());
  }
}
