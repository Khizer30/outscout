import { AuthGuard } from "@middleware/auth.guard";
import { User } from "@middleware/user.decorator";
import { CompanyService } from "@modules/company/services/company.service";
import { MediaService } from "@modules/media/services/media.service";
import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateCompanyDto, CreateCompanyResponseDto } from "@repo/dtos/company";

@Controller("company")
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly mediaService: MediaService
  ) {}

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

    return { data: company };
  }
}
