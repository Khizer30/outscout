import { JWTModule } from "@modules/jwt/jwt.module";
import { MediaRepository } from "@modules/media/domain/media.repository";
import { CloudinaryProvider } from "@modules/media/infrastructure/cloudinary.provider";
import { MediaCloudinaryRepository } from "@modules/media/infrastructure/mediaCloudinary.repository";
import { MediaController } from "@modules/media/presentation/media.controller";
import { MediaService } from "@modules/media/services/media.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [JWTModule],
  controllers: [MediaController],
  providers: [
    CloudinaryProvider,
    MediaService,
    {
      provide: MediaRepository,
      useClass: MediaCloudinaryRepository
    }
  ],
  exports: [MediaService]
})
export class MediaModule {}
