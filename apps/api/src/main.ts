import { HttpExceptionFilter } from "@middleware/httpException.filter";
import { ResponseInterceptor } from "@middleware/response.interceptor";
import { RequestMethod } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { type NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "@src/app.module";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { Logger } from "nestjs-pino";
import { ZodValidationPipe } from "nestjs-zod";

// Bootstrap
(async (): Promise<undefined> => {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT", 5000);
  const corsOrigins = configService.get<string>("CORS_ORIGINS")?.split(" ");

  app.set("trust proxy", "loopback");
  app.setGlobalPrefix("api", {
    exclude: [{ path: "/", method: RequestMethod.GET }]
  });
  app.use(cookieParser());
  app.use(helmet());
  app.enableCors({
    origin: corsOrigins ? corsOrigins : "*",
    credentials: true
  });
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);
})();
