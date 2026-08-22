import type { IncomingMessage, ServerResponse } from "node:http";
import { DatabaseModule } from "@database/database.module";
import { PrometheusMetricsMiddleware } from "@middleware/prometheusMetrics.middleware";
import { AiModule } from "@modules/ai/ai.module";
import { AuthModule } from "@modules/auth/auth.module";
import { CompanyModule } from "@modules/company/company.module";
import { EncryptionModule } from "@modules/encryption/encryption.module";
import { JWTModule } from "@modules/jwt/jwt.module";
import { LeadModule } from "@modules/lead/lead.module";
import { MailModule } from "@modules/mail/mail.module";
import { MapModule } from "@modules/map/map.module";
import { MediaModule } from "@modules/media/media.module";
import { TeamModule } from "@modules/team/team.module";
import { UserModule } from "@modules/user/user.module";
import { WebScrapingModule } from "@modules/webScraping/webScraping.module";
import { BullModule } from "@nestjs/bullmq";
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "@src/app.controller";
import { makeCounterProvider, makeGaugeProvider, makeHistogramProvider } from "@willsoto/nestjs-prometheus";
import { LoggerModule } from "nestjs-pino";

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 100 }]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env"]
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const lokiHost = configService.get<string>("LOKI_HOST");

        const targets: Array<{ target: string; options?: Record<string, unknown>; level?: string }> = [
          { target: "pino-pretty", options: { singleLine: true, colorize: true } }
        ];

        if (lokiHost) {
          targets.push({
            target: "pino-loki",
            options: {
              host: lokiHost,
              labels: { app: "OutScout - API" },
              batching: true,
              interval: 5
            }
          });
        }

        return {
          forRoutes: ["*path"],
          pinoHttp: {
            level: configService.get<string>("LOG_LEVEL", "info"),
            transport: { targets },
            redact: ["req.headers.authorization", "req.headers.cookie"],
            autoLogging: true,
            customProps: () => ({ context: "HTTP" }),
            serializers: {
              req: (req: IncomingMessage) => ({ method: req.method, url: req.url }),
              res: (res: ServerResponse) => ({ statusCode: res.statusCode })
            }
          }
        };
      },
      inject: [ConfigService]
    }),
    ScheduleModule.forRoot({}),
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
    JWTModule,
    EncryptionModule,
    DatabaseModule,
    MailModule,
    MediaModule,
    AuthModule,
    UserModule,
    CompanyModule,
    TeamModule,
    MapModule,
    LeadModule,
    WebScrapingModule,
    AiModule
  ],
  controllers: [AppController],
  providers: [
    PrometheusMetricsMiddleware,
    makeCounterProvider({
      name: "http_requests_total",
      help: "Total number of HTTP requests",
      labelNames: ["method", "route", "status_code"]
    }),
    makeHistogramProvider({
      name: "http_request_duration_seconds",
      help: "HTTP request duration in seconds",
      labelNames: ["method", "route", "status_code"],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
    }),
    makeGaugeProvider({
      name: "http_requests_in_flight",
      help: "Number of HTTP requests currently being processed"
    }),
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrometheusMetricsMiddleware).forRoutes({
      path: "*path",
      method: RequestMethod.ALL
    });
  }
}
