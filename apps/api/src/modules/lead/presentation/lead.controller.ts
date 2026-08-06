import { AuthGuard } from "@middleware/auth.guard";
import { User } from "@middleware/user.decorator";
import { LeadMapper } from "@modules/lead/infrastructure/lead.mapper";
import { LeadService } from "@modules/lead/services/lead.service";
import { LeadCacheService } from "@modules/lead/services/leadCache.service";
import { Body, Controller, ForbiddenException, Get, HttpCode, MessageEvent, Param, Patch, Post, Query, Sse, UseGuards } from "@nestjs/common";
import { RedisService } from "@redis/services/redis.service";
import { IdDto } from "@repo/dtos/common";
import {
  GenerateOutreachMessageQueryDto,
  GenerateOutreachMessageResponseDto,
  GenerateLeadsDto,
  GenerateLeadsResponseDto,
  GenerateWhatsAppLinkQueryDto,
  GenerateWhatsAppLinkResponseDto,
  GetLeadResponseDto,
  GetLeadsDto,
  GetLeadsResponseDto,
  ProcessLeadResponseDto,
  SendOutreachEmailResponseDto,
  UpdateLeadDto,
  UpdateLeadResponseDto
} from "@repo/dtos/lead";
import { Observable } from "rxjs";

@Controller("lead")
export class LeadController {
  constructor(
    private readonly leadService: LeadService,
    private readonly redisService: RedisService,
    private readonly leadCacheService: LeadCacheService
  ) {}

  @Sse("stream")
  @UseGuards(AuthGuard)
  stream(@User() user: AuthenticatedUser): Observable<MessageEvent> {
    const companyId = user.companyId;
    if (!companyId) {
      throw new ForbiddenException("You do not belong to a company");
    }

    return new Observable<MessageEvent>((subscriber) => {
      const client = this.redisService.subscribe(`leads:${companyId}`, (message) => {
        subscriber.next({ data: JSON.parse(message) });
      });

      return () => {
        client.disconnect();
      };
    });
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

    await this.leadCacheService.invalidate(companyId);

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

    const cached = await this.leadCacheService.getSearch(companyId, dto);
    if (cached) {
      return cached;
    }

    const { leads, total } = await this.leadService.findByCompany(companyId, { status: dto.status }, { page: dto.page, limit: dto.limit });

    const totalPages = Math.ceil(total / dto.limit);

    const response: GetLeadsResponseDto = {
      data: leads.map(LeadMapper.toResponse),
      meta: {
        page: dto.page,
        limit: dto.limit,
        total,
        totalPages,
        hasNext: dto.page < totalPages,
        hasPrevious: dto.page > 1
      }
    };

    await this.leadCacheService.setSearch(companyId, dto, response);

    return response;
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

    await this.leadCacheService.invalidate(companyId);

    return { data: LeadMapper.toResponse(updated) };
  }

  @Post("outreach-message/:id")
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

    const generated = await this.leadService.generateOutreachMessage(id, companyId, query.channel, user.id);
    const { channel, ...data } = generated.data;

    return { data: { id: generated.id, leadId: generated.leadId, channel, data } };
  }

  @Get("whatsapp-link/:id")
  @UseGuards(AuthGuard)
  async generateWhatsAppLink(
    @User() user: AuthenticatedUser,
    @Param() { id }: IdDto,
    @Query() query: GenerateWhatsAppLinkQueryDto
  ): Promise<GenerateWhatsAppLinkResponseDto> {
    const companyId = user.companyId;
    if (!companyId) {
      throw new ForbiddenException("You do not belong to a company");
    }

    const link = await this.leadService.generateWhatsAppLink(id, companyId, query.messagePart);

    return { data: { link } };
  }

  @Post("email/:id")
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async sendOutreachEmail(@User() user: AuthenticatedUser, @Param() { id }: IdDto): Promise<SendOutreachEmailResponseDto> {
    const companyId = user.companyId;
    if (!companyId) {
      throw new ForbiddenException("You do not belong to a company");
    }

    const { to } = await this.leadService.sendOutreachEmail(id, companyId);

    return { data: { sent: true, to } };
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

    await this.leadCacheService.invalidate(companyId);

    return { data: LeadMapper.toResponse(lead) };
  }
}
