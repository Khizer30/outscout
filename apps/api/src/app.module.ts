import { DatabaseModule } from "@database/database.module";
import { LoggerMiddleware } from "@middleware/logger.middleware";
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
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "@src/app.controller";

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 100 }]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    ScheduleModule.forRoot({}),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow<string>("REDIS_HOST"),
          port: +configService.getOrThrow<string>("REDIS_PORT"),
          username: configService.getOrThrow<string>("REDIS_USERNAME"),
          password: configService.getOrThrow<string>("REDIS_PASSWORD")
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*path");
  }
}
