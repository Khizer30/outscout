import { AuthGuard } from "@middleware/auth.guard";
import { User } from "@middleware/user.decorator";
import { UserMapper } from "@modules/user/infrastructure/user.mapper";
import { UserService } from "@modules/user/services/user.service";
import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { GetUserResponseDto, UpdateUserDto, UpdateUserResponseDto } from "@repo/dtos/user";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  @UseGuards(AuthGuard)
  async getMe(@User() user: AuthenticatedUser): Promise<GetUserResponseDto> {
    const existing = await this.userService.getUserById(user.id);
    return { data: UserMapper.toResponse(existing) };
  }

  @Patch("me")
  @UseGuards(AuthGuard)
  async updateMe(@User() user: AuthenticatedUser, @Body() dto: UpdateUserDto): Promise<UpdateUserResponseDto> {
    const updatedUser = await this.userService.updateUserById(user.id, {
      name: dto.name,
      password: dto.password,
      timezone: dto.timezone,
      profileImageURL: dto.profileImageURL
    });

    return { data: UserMapper.toResponse(updatedUser) };
  }
}
