import { AuthGuard } from "@middleware/auth.guard";
import { User } from "@middleware/user.decorator";
import { CompanyMapper, CompanyMembershipMapper } from "@modules/company/infrastructure/company.mapper";
import { CompanyService } from "@modules/company/services/company.service";
import { MediaService } from "@modules/media/services/media.service";
import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateCompanyDto, CreateCompanyResponseDto, GetUserCompaniesResponseDto } from "@repo/dtos/company";

@Controller("company")
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
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
      companyImageURL = await this.mediaService.uploadImage(file, "companies");
    }

    const { company } = await this.companyService.createCompany(user.id, {
      ...dto,
      companyImageURL
    });

    return { data: CompanyMapper.toResponse(company) };
  }
}
