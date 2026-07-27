import { WorkerModule } from "@modules/worker/worker.module";
import { NestFactory } from "@nestjs/core";

// Bootstrap
(async (): Promise<undefined> => {
  const app = await NestFactory.createApplicationContext(WorkerModule);
  app.enableShutdownHooks();
})();
