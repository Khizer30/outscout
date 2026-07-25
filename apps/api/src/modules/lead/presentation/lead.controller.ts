import { AuthGuard } from "@middleware/auth.guard";
import { User } from "@middleware/user.decorator";
import { LeadMapper } from "@modules/lead/infrastructure/lead.mapper";
import { LeadService } from "@modules/lead/services/lead.service";
import { Body, Controller, ForbiddenException, Get, HttpCode, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { GetLeadResponseDto, GetLeadsDto, GetLeadsResponseDto, UpdateLeadStatusDto, UpdateLeadStatusResponseDto } from "@repo/dtos/lead";

@Controller("lead")
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post("search")
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async getLeads(@User() user: AuthenticatedUser, @Body() dto: GetLeadsDto): Promise<GetLeadsResponseDto> {
    const companyId = user.companyId;
    if (!companyId) {
      throw new ForbiddenException("You do not belong to a company");
    }

    const { leads, total } = await this.leadService.findByCompany(companyId, { status: dto.status }, { page: dto.page, limit: dto.limit });

    return {
      data: leads.map(LeadMapper.toResponse),
      meta: { page: dto.page, limit: dto.limit, total, totalPages: Math.ceil(total / dto.limit) }
    };
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  async getLead(@User() user: AuthenticatedUser, @Param("id") id: string): Promise<GetLeadResponseDto> {
    const companyId = user.companyId;
    if (!companyId) {
      throw new ForbiddenException("You do not belong to a company");
    }

    const lead = await this.leadService.findById(id, companyId);

    return { data: LeadMapper.toResponse(lead) };
  }

  @Patch(":id/status")
  @UseGuards(AuthGuard)
  async updateStatus(@User() user: AuthenticatedUser, @Param("id") id: string, @Body() dto: UpdateLeadStatusDto): Promise<UpdateLeadStatusResponseDto> {
    const companyId = user.companyId;
    if (!companyId) {
      throw new ForbiddenException("You do not belong to a company");
    }

    const updated = await this.leadService.updateStatus(id, companyId, dto.status);

    return { data: LeadMapper.toResponse(updated) };
  }
}
