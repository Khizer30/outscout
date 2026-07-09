import { DatabaseService } from "@database/database.service";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService]
})
export class DatabaseModule {}
