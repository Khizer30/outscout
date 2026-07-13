import { MediaRepository } from "@modules/media/domain/media.repository";
import { CloudinaryProvider } from "@modules/media/infrastructure/cloudinary.provider";
import { MediaCloudinaryRepository } from "@modules/media/infrastructure/mediaCloudinary.repository";
import { MediaService } from "@modules/media/services/media.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [CloudinaryProvider, { provide: MediaRepository, useClass: MediaCloudinaryRepository }, MediaService],
  exports: [MediaService]
})
export class MediaModule {}
