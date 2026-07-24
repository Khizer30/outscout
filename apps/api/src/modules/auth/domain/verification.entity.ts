import { createId } from "@paralleldrive/cuid2";

export type VerificationType = "VERIFY" | "RESET";

export class VerificationEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly type: VerificationType,
    public readonly otp: string,
    public readonly expiresAt: Date,
    public readonly used: boolean,
    public readonly createdAt: Date
  ) {}

  static create(props: {
    id?: string;
    userId: string;
    type: VerificationType;
    otp: string;
    expiresAt: Date;
    used?: boolean;
    createdAt?: Date;
  }): VerificationEntity {
    return new VerificationEntity(
      props.id ?? createId(),
      props.userId,
      props.type,
      props.otp,
      props.expiresAt,
      props.used ?? false,
      props.createdAt ?? new Date()
    );
  }

  markAsUsed(): VerificationEntity {
    return new VerificationEntity(this.id, this.userId, this.type, this.otp, this.expiresAt, true, this.createdAt);
  }
}
