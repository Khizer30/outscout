import { HttpExceptionFilter } from "@middleware/httpException.filter";
import { ResponseInterceptor } from "@middleware/response.interceptor";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { type NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "@src/app.module";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { ZodValidationPipe } from "nestjs-zod";

// Bootstrap
(async (): Promise<undefined> => {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT", 5000);
  const isProduction = configService.get<string>("NODE_ENV") === "production";
  const corsOrigins = configService.get<string>("CORS_ORIGINS")?.split(", ");

  app.set("trust proxy", "loopback");
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  app.use(helmet());
  app.enableCors({
    origin: isProduction && corsOrigins ? corsOrigins : "*",
    credentials: true
  });
  app.useLogger(isProduction ? ["error", "warn"] : ["log", "error", "warn", "debug", "verbose"]);
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);
})();
