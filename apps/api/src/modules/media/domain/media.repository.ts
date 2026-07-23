import type { UploadImageSignature } from "@modules/media/domain/media.types";

export abstract class MediaRepository {
  abstract uploadImage(file: Express.Multer.File, folder: string): Promise<string>;
  abstract generateUploadImageSignature(folder: string, width?: number, height?: number): UploadImageSignature;
  abstract deleteImage(url: string): Promise<void>;
}
