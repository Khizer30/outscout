import { AuthService } from "@modules/auth/services/auth.service";
import { Body, Controller, Post } from "@nestjs/common";
import { SignupDto, SignupResponseDto } from "@repo/dtos/auth";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(@Body() dto: SignupDto): Promise<SignupResponseDto> {
    await this.authService.signup(dto);
    return { message: "An OTP has been sent to your email" };
  }
}
