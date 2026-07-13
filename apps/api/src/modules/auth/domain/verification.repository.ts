import { VerificationEntity } from "@modules/auth/domain/verification.entity";

export abstract class VerificationRepository {
  abstract create(verification: VerificationEntity): Promise<VerificationEntity>;
}
