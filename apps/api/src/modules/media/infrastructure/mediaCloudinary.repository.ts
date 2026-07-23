import { Readable } from "stream";
import { MediaRepository } from "@modules/media/domain/media.repository";
import type { UploadImageSignature } from "@modules/media/domain/media.types";
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

  generateUploadImageSignature(folder: string, width = 256, height = 256): UploadImageSignature {
    const config = cloudinary.config();
    const timestamp = Math.round(Date.now() / 1000);
    const eager = `c_fill,w_${width},h_${height}/f_png`;

    const signature = cloudinary.utils.api_sign_request({ eager, folder, timestamp }, config.api_secret as string);

    return {
      signature,
      timestamp,
      apiKey: config.api_key as string,
      cloudName: config.cloud_name as string,
      eager,
      folder
    };
  }

  private urlToPublicId(url: string): string {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    if (!match) {
      throw new Error(`Invalid Cloudinary URL: ${url}`);
    }

    return match[1];
  }
}
