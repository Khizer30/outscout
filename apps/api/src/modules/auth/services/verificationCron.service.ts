import { VerificationRepository } from "@modules/auth/domain/verification.repository";
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class VerificationCronService {
  private readonly logger = new Logger(VerificationCronService.name);

  constructor(private readonly verificationRepo: VerificationRepository) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clearExpiredVerifications(): Promise<void> {
    this.logger.log("Starting cleanup of expired verification records...");
    try {
      const now = new Date();
      await this.verificationRepo.deleteExpired(now);
      this.logger.log("Successfully cleared expired verification records.");
    } catch (error) {
      this.logger.error("Failed to clear expired verification records:", error);
    }
  }
}
