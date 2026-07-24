import { AuthGuard } from "@middleware/auth.guard";
import { MediaService } from "@modules/media/services/media.service";
import { Body, Controller, Delete, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { DeleteImageDto, DeleteImageResponseDto, GenerateSignedUrlDto, GenerateSignedUrlResponseDto } from "@repo/dtos/media";

@Controller("media")
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("image/signed-url")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async generateImageSignedUrl(@Body() dto: GenerateSignedUrlDto): Promise<GenerateSignedUrlResponseDto> {
    const folder = dto.folder ?? "outscout/uploads";
    const data = this.mediaService.generateUploadImageSignature(folder, dto.width, dto.height);
    return { data };
  }

  @Delete("image")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async deleteImage(@Body() dto: DeleteImageDto): Promise<DeleteImageResponseDto> {
    await this.mediaService.deleteImage(dto.url, true);
    return { message: "Image deleted successfully" };
  }
}
