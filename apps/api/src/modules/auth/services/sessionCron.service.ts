import { SessionRepository } from "@modules/auth/domain/session.repository";
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class SessionCronService {
  private readonly logger = new Logger(SessionCronService.name);

  constructor(private readonly sessionRepo: SessionRepository) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clearExpiredSessions(): Promise<void> {
    this.logger.log("Starting cleanup of expired session records...");
    try {
      const now = new Date();
      await this.sessionRepo.deleteExpired(now);
      this.logger.log("Successfully cleared expired session records.");
    } catch (error) {
      this.logger.error("Failed to clear expired session records:", error);
    }
  }
}
