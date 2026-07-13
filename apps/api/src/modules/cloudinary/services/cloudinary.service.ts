import { Readable } from "stream";
import { Injectable } from "@nestjs/common";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import sharp from "sharp";

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File, folder: string): Promise<UploadApiResponse> {
    const webpBuffer = await sharp(file.buffer).webp({ quality: 100 }).toBuffer();

    return new Promise((resolve, reject) => {
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
  }

  urlToPublicId(url: string): string {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    if (!match) {
      throw new Error(`Invalid Cloudinary URL: ${url}`);
    }

    return match[1];
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
