import { VerificationEntity, VerificationType } from "@modules/auth/domain/verification.entity";

export abstract class VerificationRepository {
  abstract create(verification: VerificationEntity): Promise<VerificationEntity>;
  abstract deleteByUserId(userId: string): Promise<void>;
  abstract findActive(userId: string, otp: string, type: VerificationType): Promise<VerificationEntity | null>;
  abstract update(verification: VerificationEntity): Promise<VerificationEntity>;
  abstract deleteExpired(before: Date): Promise<void>;
}
