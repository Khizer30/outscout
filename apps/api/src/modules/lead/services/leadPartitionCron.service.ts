import { DatabaseService } from "@database/services/database.service";
import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { sql } from "drizzle-orm";

@Injectable()
export class LeadPartitionCronService implements OnApplicationBootstrap {
  private readonly logger = new Logger(LeadPartitionCronService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async onApplicationBootstrap(): Promise<void> {
    const currentYear = new Date().getFullYear();
    await this.ensurePartition(currentYear);
    await this.ensurePartition(currentYear + 1);
  }

  // Runs at midnight on December 1st each year to prep next year's partition
  @Cron("0 0 1 12 *")
  async createNextYearPartition(): Promise<void> {
    const nextYear = new Date().getFullYear() + 1;
    await this.ensurePartition(nextYear);
  }

  private async ensurePartition(year: number): Promise<void> {
    const tableName = `leads_${year}`;
    const from = `${year}-01-01`;
    const to = `${year + 1}-01-01`;

    try {
      await this.databaseService.db.execute(
        sql.raw(`CREATE TABLE IF NOT EXISTS ${tableName} PARTITION OF leads FOR VALUES FROM ('${from}') TO ('${to}')`)
      );
      this.logger.log(`Partition ${tableName} is ready.`);
    } catch (error) {
      this.logger.error(`Failed to create partition ${tableName}:`, error);
    }
  }
}
