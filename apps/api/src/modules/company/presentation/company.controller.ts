import { AuthGuard } from "@middleware/auth.guard";
import Roles from "@middleware/roles.decorator";
import { User } from "@middleware/user.decorator";
import { CompanyMapper, CompanyMembershipMapper } from "@modules/company/infrastructure/company.mapper";
import { CompanyEmailSettingsMapper } from "@modules/company/infrastructure/companyEmailSettings.mapper";
import { CompanyMessageRulesMapper } from "@modules/company/infrastructure/companyMessageRules.mapper";
import { CompanyService } from "@modules/company/services/company.service";
import { CompanyEmailSettingsService } from "@modules/company/services/companyEmailSettings.service";
import { CompanyMessageRulesService } from "@modules/company/services/companyMessageRules.service";
import { Body, Controller, Delete, ForbiddenException, Get, Patch, Post, UseGuards } from "@nestjs/common";
import {
  CreateCompanyDto,
  CreateCompanyResponseDto,
  DeleteCompanyResponseDto,
  GetUserCompaniesResponseDto,
  UpdateCompanyDto,
  UpdateCompanyEmailSettingsDto,
  UpdateCompanyEmailSettingsResponseDto,
  UpdateCompanyMessageRulesDto,
  UpdateCompanyMessageRulesResponseDto,
  UpdateCompanyResponseDto
} from "@repo/dtos/company";

@Controller("company")
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly companyEmailSettingsService: CompanyEmailSettingsService,
    private readonly companyMessageRulesService: CompanyMessageRulesService
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getMyCompanies(@User() user: AuthenticatedUser): Promise<GetUserCompaniesResponseDto> {
    const list = await this.companyService.findActiveMembershipsByUserId(user.id);

    return {
      data: list.map((item) => ({
        company: CompanyMapper.toResponse(item.company),
        membership: CompanyMembershipMapper.toResponse(item.membership)
      }))
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@User() user: AuthenticatedUser, @Body() dto: CreateCompanyDto): Promise<CreateCompanyResponseDto> {
    const { company } = await this.companyService.createCompany(user.id, {
      name: dto.name,
      about: dto.about,
      companyImageURL: dto.companyImageURL
    });

    return { data: CompanyMapper.toResponse(company) };
  }

  @Patch()
  @UseGuards(AuthGuard)
  @Roles(["COMPANY_ADMIN"])
  async update(@User() user: AuthenticatedUser, @Body() dto: UpdateCompanyDto): Promise<UpdateCompanyResponseDto> {
    const id = user.companyId;
    if (!id) {
      throw new ForbiddenException("You do not belong to a company");
    }

    const updated = await this.companyService.updateCompany(id, {
      name: dto.name,
      about: dto.about,
      ...(dto.companyImageURL !== undefined ? { companyImageURL: dto.companyImageURL } : {})
    });

    return { data: CompanyMapper.toResponse(updated) };
  }

  @Delete()
  @UseGuards(AuthGuard)
  @Roles(["COMPANY_ADMIN"])
  async deleteCompany(@User() user: AuthenticatedUser): Promise<DeleteCompanyResponseDto> {
    const id = user.companyId;
    if (!id) {
      throw new ForbiddenException("You do not belong to a company");
    }

    await this.companyService.deleteCompany(id);

    return { message: "Company deleted successfully" };
  }

  @Patch("email-settings")
  @UseGuards(AuthGuard)
  @Roles(["COMPANY_ADMIN"])
  async updateEmailSettings(@User() user: AuthenticatedUser, @Body() dto: UpdateCompanyEmailSettingsDto): Promise<UpdateCompanyEmailSettingsResponseDto> {
    const id = user.companyId;
    if (!id) {
      throw new ForbiddenException("You do not belong to a company");
    }

    const updated = await this.companyEmailSettingsService.updateSettings(id, dto);

    return { data: CompanyEmailSettingsMapper.toResponse(updated) };
  }

  @Patch("message-rules")
  @UseGuards(AuthGuard)
  @Roles(["COMPANY_ADMIN"])
  async updateMessageRules(@User() user: AuthenticatedUser, @Body() dto: UpdateCompanyMessageRulesDto): Promise<UpdateCompanyMessageRulesResponseDto> {
    const id = user.companyId;
    if (!id) {
      throw new ForbiddenException("You do not belong to a company");
    }

    const { channel, ...data } = dto;
    const updated = await this.companyMessageRulesService.updateRules(id, channel, data, user.id);

    return { data: CompanyMessageRulesMapper.toResponse(updated) };
  }
}