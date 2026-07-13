import { CloudinaryService } from "@modules/cloudinary/services/cloudinary.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService]
})
export class CloudinaryModule {}
