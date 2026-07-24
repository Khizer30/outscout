import type { UploadImageSignature } from "@modules/media/domain/media.types";

export abstract class MediaRepository {
  abstract generateUploadImageSignature(folder: string, width?: number, height?: number): UploadImageSignature;
  abstract deleteImage(url: string, checkTimestamp?: boolean): Promise<void>;
  abstract deleteImageByPublicId(publicId: string): Promise<void>;
  abstract urlToPublicId(url: string): string;
}
