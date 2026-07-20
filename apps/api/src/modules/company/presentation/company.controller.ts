import { AuthGuard } from "@middleware/auth.guard";
import Roles from "@middleware/roles.decorator";
import { User } from "@middleware/user.decorator";
import { CompanyMapper, CompanyMembershipMapper } from "@modules/company/infrastructure/company.mapper";
import { CompanyEmailSettingsMapper } from "@modules/company/infrastructure/companyEmailSettings.mapper";
import { CompanyService } from "@modules/company/services/company.service";
import { CompanyEmailSettingsService } from "@modules/company/services/companyEmailSettings.service";
import { MediaService } from "@modules/media/services/media.service";
import { Body, Controller, ForbiddenException, Get, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  CreateCompanyDto,
  CreateCompanyResponseDto,
  GetUserCompaniesResponseDto,
  UpdateCompanyDto,
  UpdateCompanyEmailSettingsDto,
  UpdateCompanyEmailSettingsResponseDto,
  UpdateCompanyResponseDto
} from "@repo/dtos/company";

@Controller("company")
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly companyEmailSettingsService: CompanyEmailSettingsService,
    private readonly mediaService: MediaService
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
  @UseInterceptors(FileInterceptor("companyImage"))
  async create(@User() user: AuthenticatedUser, @Body() dto: CreateCompanyDto, @UploadedFile() file?: Express.Multer.File): Promise<CreateCompanyResponseDto> {
    let companyImageURL: string | null = null;
    if (file) {
      companyImageURL = await this.mediaService.uploadImage(file, "outscout/companies");
    }

    const { company } = await this.companyService.createCompany(user.id, {
      ...dto,
      companyImageURL
    });

    return { data: CompanyMapper.toResponse(company) };
  }

  @Patch()
  @UseGuards(AuthGuard)
  @Roles(["COMPANY_ADMIN"])
  @UseInterceptors(FileInterceptor("companyImage"))
  async update(@User() user: AuthenticatedUser, @Body() dto: UpdateCompanyDto, @UploadedFile() file?: Express.Multer.File): Promise<UpdateCompanyResponseDto> {
    const id = user.companyId;
    if (!id) {
      throw new ForbiddenException("You do not belong to a company");
    }

    let companyImageURL: string | undefined = undefined;

    if (file) {
      companyImageURL = await this.mediaService.uploadImage(file, "outscout/companies");
    }

    const updated = await this.companyService.updateCompany(id, {
      name: dto.name,
      about: dto.about,
      ...(companyImageURL !== undefined ? { companyImageURL } : {})
    });

    return { data: CompanyMapper.toResponse(updated) };
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
}
