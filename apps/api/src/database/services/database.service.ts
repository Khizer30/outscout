import { Injectable, OnApplicationBootstrap, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

@Injectable()
export class DatabaseService implements OnApplicationBootstrap, OnModuleDestroy {
  private pool: Pool;
  public db: ReturnType<typeof drizzle>;

  constructor(private readonly configService: ConfigService) {}

  async onApplicationBootstrap() {
    const databaseUrl = this.configService.get<string>("DATABASE_URL");
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not defined");
    }

    this.pool = new Pool({
      connectionString: databaseUrl
    });

    this.db = drizzle(this.pool);

    try {
      await this.db.execute(sql`SELECT 1`);
    } catch (error) {
      throw new Error(`Failed to connect to database: ${error.message}`);
    }
  }

  async onModuleDestroy() {
    if (this.pool) {
      await this.pool.end();
    }
  }
}
