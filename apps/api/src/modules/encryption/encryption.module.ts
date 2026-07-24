import { EncryptionService } from "@modules/encryption/services/encryption.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [EncryptionService],
  exports: [EncryptionService]
})
export class EncryptionModule {}
