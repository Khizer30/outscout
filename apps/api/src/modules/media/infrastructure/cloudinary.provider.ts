import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";

export const CloudinaryProvider = {
  provide: "CLOUDINARY",
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return cloudinary.config({
      cloud_name: configService.getOrThrow<string>("CLOUDINARY_CLOUD"),
      api_key: configService.getOrThrow<string>("CLOUDINARY_API_KEY"),
      api_secret: configService.getOrThrow<string>("CLOUDINARY_API_SECRET"),
      secure: true
    });
  }
};
