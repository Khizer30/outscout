import { LeadModule } from "@modules/lead/lead.module";
import { LeadProcessor } from "@modules/lead/presentation/lead.processor";
import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule } from "@redis/redis.module";
import { LoggerModule } from "nestjs-pino";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env"]
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dataset = configService.getOrThrow<string>("AXIOM_DATASET");
        const token = configService.getOrThrow<string>("AXIOM_TOKEN");

        const targets: Array<{ target: string; options?: Record<string, unknown>; level?: string }> = [
          { target: "pino-pretty", options: { singleLine: true, colorize: true } }
        ];

        if (configService.get<string>("NODE_ENV") === "production") {
          targets.push({
            target: "@axiomhq/pino",
            options: { dataset, token },
            level: "info"
          });
        }

        return {
          pinoHttp: {
            level: configService.get<string>("LOG_LEVEL", "info"),
            transport: { targets },
            customProps: () => ({ context: "Worker" })
          }
        };
      },
      inject: [ConfigService]
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow<string>("REDIS_HOST"),
          port: +configService.getOrThrow<string>("REDIS_PORT"),
          username: configService.getOrThrow<string>("REDIS_USERNAME"),
          password: configService.getOrThrow<string>("REDIS_PASSWORD"),
          tls: configService.get<string>("REDIS_TLS") === "true" ? {} : undefined,
          maxRetriesPerRequest: null
        }
      }),
      inject: [ConfigService]
    }),
    BullModule.registerQueue({
      name: "webScraper"
    }),
    RedisModule,
    LeadModule
  ],
  providers: [LeadProcessor]
})
export class WorkerModule {}
