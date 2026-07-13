import { MediaRepository } from "@modules/media/domain/media.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MediaService {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async uploadImage(file: Express.Multer.File, folder: string): Promise<string> {
    return this.mediaRepository.uploadImage(file, folder);
  }

  async deleteImage(url: string): Promise<void> {
    return this.mediaRepository.deleteImage(url);
  }
}
