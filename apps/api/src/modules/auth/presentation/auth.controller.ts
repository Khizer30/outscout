import { AuthService } from "@modules/auth/services/auth.service";
import { JWTService } from "@modules/jwt/services/jwt.service";
import { Body, Controller, Post, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SignupDto, SignupResponseDto, VerifyOtpDto, VerifyOtpResponseDto, LoginDto, LoginResponseDto } from "@repo/dtos/auth";
import type { Response } from "express";

@Controller("auth")
export class AuthController {
  private readonly isProduction: boolean;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly jwtService: JWTService
  ) {
    this.isProduction = this.configService.get<string>("NODE_ENV") === "production";
  }

  @Post("signup")
  async signup(@Body() dto: SignupDto): Promise<SignupResponseDto> {
    await this.authService.signup(dto);
    return { message: "An OTP has been sent to your email" };
  }

  @Post("verify-otp")
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<VerifyOtpResponseDto> {
    await this.authService.verifyOtp(dto);
    return { message: "Email verified successfully" };
  }

  @Post("login")
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<LoginResponseDto> {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: this.isProduction,
      secure: this.isProduction,
      sameSite: "lax",
      maxAge: this.jwtService.refreshTokenMaxAge,
      path: "/"
    });

    return { data: { accessToken } };
  }
}
