import { MediaRepository } from "@modules/media/domain/media.repository";
import type { UploadImageSignature } from "@modules/media/domain/media.types";
import { MediaConfig } from "@modules/media/domain/media.value-objects";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";

@Injectable()
export class MediaCloudinaryRepository implements MediaRepository {
  async deleteImage(url: string, checkTimestamp = false): Promise<void> {
    const publicId = this.urlToPublicId(url);

    if (checkTimestamp) {
      let resource: { created_at?: string } | undefined;
      try {
        resource = await cloudinary.api.resource(publicId);
      } catch {
        throw new NotFoundException("Image not found");
      }

      if (resource?.created_at) {
        const createdAtMs = new Date(resource.created_at).getTime();
        const ageInMs = Date.now() - createdAtMs;

        if (ageInMs > MediaConfig.TIME_TO_DELETE || ageInMs < 0) {
          throw new BadRequestException("Image can only be deleted within few minutes of creation");
        }
      }
    }

    await cloudinary.uploader.destroy(publicId);
  }

  async deleteImageByPublicId(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  generateUploadImageSignature(folder: string, width = 250, height = 250): UploadImageSignature {
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

  urlToPublicId(url: string): string {
    const match = url.match(/\/upload\/(?:(?:[^/]+\/)*v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    if (!match) {
      throw new Error(`Invalid Cloudinary URL: ${url}`);
    }

    return match[1];
  }
}
