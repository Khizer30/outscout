import { AuthGuard } from "@middleware/auth.guard";
import { User } from "@middleware/user.decorator";
import { LeadMapper } from "@modules/lead/infrastructure/lead.mapper";
import { LeadService } from "@modules/lead/services/lead.service";
import { Body, Controller, ForbiddenException, Get, HttpCode, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { IdDto } from "@repo/dtos/common";
import {
  AutocompleteLeadsDto,
  AutocompleteLeadsResponseDto,
  GenerateLeadsDto,
  GenerateLeadsResponseDto,
  GetLeadResponseDto,
  GetLeadsDto,
  GetLeadsResponseDto,
  ProcessLeadResponseDto,
  UpdateLeadDto,
  UpdateLeadResponseDto
} from "@repo/dtos/lead";

@Controller("lead")
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post("autocomplete")
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async autocomplete(@Body() dto: AutocompleteLeadsDto): Promise<AutocompleteLeadsResponseDto> {
    const results = await this.leadService.autocomplete({
      query: dto.query,
      latitude: dto.latitude,
      longitude: dto.longitude,
      radiusMeters: dto.radius,
      types: dto.types
    });

    return { data: results };
  }

  @Post("generate")
  @UseGuards(AuthGuard)
  async generateLeads(@User() user: AuthenticatedUser, @Body() dto: GenerateLeadsDto): Promise<GenerateLeadsResponseDto> {
    const companyId = user.companyId;
    if (!companyId) {
      throw new ForbiddenException("You do not belong to a company");
    }

    const leads = await this.leadService.generate(companyId, {
      latitude: dto.latitude,
      longitude: dto.longitude,
      radiusMeters: dto.radius,
      serviceType: dto.serviceType,
      limit: dto.limit
    });

    return { data: leads.map(LeadMapper.toResponse) };
  }

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
  async getLead(@User() user: AuthenticatedUser, @Param() { id }: IdDto): Promise<GetLeadResponseDto> {
    const companyId = user.companyId;
    if (!companyId) {
      throw new ForbiddenException("You do not belong to a company");
    }

    const lead = await this.leadService.findById(id, companyId);

    return { data: LeadMapper.toResponse(lead) };
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  async update(@User() user: AuthenticatedUser, @Param() { id }: IdDto, @Body() dto: UpdateLeadDto): Promise<UpdateLeadResponseDto> {
    const companyId = user.companyId;
    if (!companyId) {
      throw new ForbiddenException("You do not belong to a company");
    }

    const updated = await this.leadService.update(id, companyId, dto);

    return { data: LeadMapper.toResponse(updated) };
  }

  @Post("process-lead/:id")
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async processLead(@User() user: AuthenticatedUser, @Param() { id }: IdDto): Promise<ProcessLeadResponseDto> {
    const companyId = user.companyId;
    if (!companyId) {
      throw new ForbiddenException("You do not belong to a company");
    }

    const lead = await this.leadService.processLead(id, companyId);

    return { data: LeadMapper.toResponse(lead) };
  }
}
