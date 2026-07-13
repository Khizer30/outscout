import { Readable } from "stream";
import { MediaRepository } from "@modules/media/domain/media.repository";
import { Injectable } from "@nestjs/common";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import sharp from "sharp";

@Injectable()
export class MediaCloudinaryRepository implements MediaRepository {
  async uploadImage(file: Express.Multer.File, folder: string): Promise<string> {
    const webpBuffer = await sharp(file.buffer).webp({ quality: 85 }).toBuffer();

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream({ resource_type: "image", access_mode: "public", folder, format: "webp" }, (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error("Upload failed: result is undefined"));
        }

        resolve(result);
      });

      Readable.from(webpBuffer).pipe(upload);
    });

    return result.secure_url;
  }

  async deleteImage(url: string): Promise<void> {
    const publicId = this.urlToPublicId(url);
    await cloudinary.uploader.destroy(publicId);
  }

  private urlToPublicId(url: string): string {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    if (!match) {
      throw new Error(`Invalid Cloudinary URL: ${url}`);
    }

    return match[1];
  }
}
