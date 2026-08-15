import { WorkerModule } from "@modules/worker/worker.module";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";

// Bootstrap
(async (): Promise<undefined> => {
  const app = await NestFactory.createApplicationContext(WorkerModule, {
    bufferLogs: true
  });

  app.useLogger(app.get(Logger));
  app.enableShutdownHooks();
})();
