import { AuthGuard } from "@middleware/auth.guard";
import { User } from "@middleware/user.decorator";
import { MediaService } from "@modules/media/services/media.service";
import { UserMapper } from "@modules/user/infrastructure/user.mapper";
import { UserService } from "@modules/user/services/user.service";
import { Body, Controller, Patch, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateUserDto, UpdateUserResponseDto } from "@repo/dtos/user";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mediaService: MediaService
  ) {}

  @Patch("me")
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("profileImage"))
  async updateMe(
    @User() user: AuthenticatedUser,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<UpdateUserResponseDto> {
    let profileImageURL: string | undefined;
    if (file) {
      profileImageURL = await this.mediaService.uploadImage(file, "users");
    }

    const updatedUser = await this.userService.updateUserById(user.id, {
      name: dto.name,
      password: dto.password,
      timezone: dto.timezone,
      profileImageURL
    });

    return { data: UserMapper.toResponse(updatedUser) };
  }
}
