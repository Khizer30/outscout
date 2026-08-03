import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;

  constructor(private readonly configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.getOrThrow<string>("REDIS_HOST"),
      port: +this.configService.getOrThrow<string>("REDIS_PORT"),
      username: this.configService.getOrThrow<string>("REDIS_USERNAME"),
      password: this.configService.getOrThrow<string>("REDIS_PASSWORD")
    });
  }

  publish(channel: string, message: string): Promise<number> {
    return this.client.publish(channel, message);
  }

  subscribe(channel: string, onMessage: (message: string) => void): Redis {
    const subscriber = this.client.duplicate();

    subscriber.subscribe(channel).catch((error: Error) => this.logger.error(`Failed to subscribe to ${channel}`, error.stack));
    subscriber.on("message", (receivedChannel, message) => {
      if (receivedChannel === channel) {
        onMessage(message);
      }
    });

    return subscriber;
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  set(key: string, value: unknown, ttlSeconds?: number): Promise<"OK"> {
    const serialized = JSON.stringify(value);
    return ttlSeconds ? this.client.set(key, serialized, "EX", ttlSeconds) : this.client.set(key, serialized);
  }

  async deleteByPattern(pattern: string): Promise<void> {
    const keys: string[] = [];
    let cursor = "0";

    do {
      const [nextCursor, found] = await this.client.scan(cursor, "MATCH", pattern, "COUNT", 100);
      cursor = nextCursor;
      keys.push(...found);
    } while (cursor !== "0");

    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  onModuleDestroy(): void {
    this.client.disconnect();
  }
}
