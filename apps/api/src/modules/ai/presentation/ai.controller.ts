import { AuthGuard } from "@middleware/auth.guard";
import { User } from "@middleware/user.decorator";
import { AiService } from "@modules/ai/services/ai.service";
import { Controller, ForbiddenException, Get, Param, Query, UseGuards } from "@nestjs/common";
import { GenerateOutreachMessageQueryDto, GenerateOutreachMessageResponseDto } from "@repo/dtos/ai";
import { IdDto } from "@repo/dtos/common";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get("outreach-message/:id")
  @UseGuards(AuthGuard)
  async generateOutreachMessage(
    @User() user: AuthenticatedUser,
    @Param() { id }: IdDto,
    @Query() query: GenerateOutreachMessageQueryDto
  ): Promise<GenerateOutreachMessageResponseDto> {
    const companyId = user.companyId;
    if (!companyId) {
      throw new ForbiddenException("You do not belong to a company");
    }

    const generated = await this.aiService.generateOutreachMessage(id, companyId, query.channel);

    return { data: { leadId: id, ...generated } };
  }
}
