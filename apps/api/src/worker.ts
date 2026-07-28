import { WorkerModule } from "@modules/worker/worker.module";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

// Bootstrap
(async (): Promise<undefined> => {
  const app = await NestFactory.createApplicationContext(WorkerModule);

  const configService = app.get(ConfigService);
  const isProduction = configService.get<string>("NODE_ENV") === "production";

  app.useLogger(isProduction ? ["error", "warn"] : ["log", "error", "warn", "debug", "verbose"]);
  app.enableShutdownHooks();
})();
