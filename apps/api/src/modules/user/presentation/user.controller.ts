import { UserMapper } from "@modules/user/infrastructure/user.mapper";
import { UserService } from "@modules/user/services/user.service";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto, UserResponseDto } from "@repo/dtos/user";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  async findById(@Param("id") id: string): Promise<{ user: UserResponseDto }> {
    const user = await this.userService.findById(id);
    return { user: UserMapper.toResponse(user) };
  }

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<{ user: UserResponseDto }> {
    const user = await this.userService.create(dto);
    return { user: UserMapper.toResponse(user) };
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateUserDto): Promise<{ user: UserResponseDto }> {
    const user = await this.userService.update(id, dto);
    return { user: UserMapper.toResponse(user) };
  }

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<void> {
    await this.userService.delete(id);
  }
}
