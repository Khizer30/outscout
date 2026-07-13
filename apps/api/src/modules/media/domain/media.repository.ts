export abstract class MediaRepository {
  abstract uploadImage(file: Express.Multer.File, folder: string): Promise<string>;
  abstract deleteImage(url: string): Promise<void>;
}
