import type { IncomingMessage, ServerResponse } from "node:http";
import { DatabaseModule } from "@database/database.module";
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
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "@src/app.controller";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { LoggerModule } from "nestjs-pino";

@Module({
  imports: [
    PrometheusModule.register(),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 100 }]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        forRoutes: ["*path"],
        pinoHttp: {
          level: configService.get<string>("LOG_LEVEL", "info"),
          transport:
            configService.get<string>("NODE_ENV") === "production"
              ? {
                  target: "@axiomhq/pino",
                  options: {
                    dataset: configService.getOrThrow<string>("AXIOM_DATASET"),
                    token: configService.getOrThrow<string>("AXIOM_TOKEN")
                  },
                  level: "info"
                }
              : { target: "pino-pretty", options: { singleLine: true, colorize: true } },
          redact: ["req.headers.authorization", "req.headers.cookie"],
          autoLogging: true,
          customProps: () => ({ context: "HTTP" }),
          serializers: {
            req: (req: IncomingMessage) => ({ method: req.method, url: req.url }),
            res: (res: ServerResponse) => ({ statusCode: res.statusCode })
          }
        }
      }),
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
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
