import { AuthGuard } from "@middleware/auth.guard";
import { AiService } from "@modules/ai/services/ai.service";
import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { ExtractContactInfoDto, ExtractContactInfoResponseDto } from "@repo/dtos/ai";

@Controller("ai")
@UseGuards(AuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("extract-contact-info")
  @HttpCode(200)
  async extractContactInfo(@Body() dto: ExtractContactInfoDto): Promise<ExtractContactInfoResponseDto> {
    const data = await this.aiService.extractContactInfo(dto.websiteUrl);

    return { data };
  }
}
