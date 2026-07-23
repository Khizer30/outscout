import { MediaRepository } from "@modules/media/domain/media.repository";
import type { UploadImageSignature } from "@modules/media/domain/media.types";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MediaService {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async uploadImage(file: Express.Multer.File, folder: string): Promise<string> {
    return this.mediaRepository.uploadImage(file, folder);
  }

  async deleteImage(url: string, checkTimestamp = false): Promise<void> {
    return this.mediaRepository.deleteImage(url, checkTimestamp);
  }

  generateUploadImageSignature(folder: string, width?: number, height?: number): UploadImageSignature {
    return this.mediaRepository.generateUploadImageSignature(folder, width, height);
  }
}
