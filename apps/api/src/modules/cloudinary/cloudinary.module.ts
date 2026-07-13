import { CloudinaryProvider } from "@modules/cloudinary/infrastructure/cloudinary.provider";
import { CloudinaryService } from "@modules/cloudinary/services/cloudinary.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryService]
})
export class CloudinaryModule {}
