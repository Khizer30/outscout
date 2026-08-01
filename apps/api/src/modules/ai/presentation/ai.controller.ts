import { AuthGuard } from "@middleware/auth.guard";
import { User } from "@middleware/user.decorator";
import { AiService } from "@modules/ai/services/ai.service";
import { Body, Controller, ForbiddenException, Get, HttpCode, Param, Post, UseGuards } from "@nestjs/common";
import { GetOutreachMessageResponseDto, RewriteOutreachMessageDto, RewriteOutreachMessageResponseDto } from "@repo/dtos/ai";
import { IdDto } from "@repo/dtos/common";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get("lead/:id")
  @UseGuards(AuthGuard)
  async getOutreachMessageByLead(@User() user: AuthenticatedUser, @Param() { id }: IdDto): Promise<GetOutreachMessageResponseDto> {
    const companyId = user.companyId;
    if (!companyId) {
      throw new ForbiddenException("You do not belong to a company");
    }

    const message = await this.aiService.getByLead(id, companyId);
    const { channel, ...data } = message.data;

    return { data: { id: message.id, leadId: message.leadId, channel, data, createdAt: message.createdAt, updatedAt: message.updatedAt } };
  }

  @Post("rewrite/:id")
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async rewriteOutreachMessage(
    @User() user: AuthenticatedUser,
    @Param() { id }: IdDto,
    @Body() dto: RewriteOutreachMessageDto
  ): Promise<RewriteOutreachMessageResponseDto> {
    const companyId = user.companyId;
    if (!companyId) {
      throw new ForbiddenException("You do not belong to a company");
    }

    const rewritten = await this.aiService.rewriteOutreachMessage(id, companyId, dto.prompt, dto.messagePart);
    const { channel, ...data } = rewritten.data;

    return { data: { id: rewritten.id, leadId: rewritten.leadId, channel, data } };
  }
}
