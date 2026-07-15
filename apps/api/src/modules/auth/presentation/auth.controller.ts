import { AuthService } from "@modules/auth/services/auth.service";
import { JWTService } from "@modules/jwt/services/jwt.service";
import { Body, Controller, Post, Res, HttpCode, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  SignupDto,
  SignupResponseDto,
  VerifyUserDto,
  VerifyUserResponseDto,
  LoginDto,
  LoginResponseDto,
  ForgotPasswordDto,
  ForgotPasswordResponseDto,
  ResetPasswordDto,
  ResetPasswordResponseDto
} from "@repo/dtos/auth";
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

  @Post("verify-user")
  @HttpCode(HttpStatus.OK)
  async verifyUser(@Body() dto: VerifyUserDto): Promise<VerifyUserResponseDto> {
    await this.authService.verifyUser(dto);
    return { message: "Email verified successfully" };
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
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

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<ForgotPasswordResponseDto> {
    await this.authService.forgotPassword(dto);
    return { message: "A password reset OTP has been sent to your email" };
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<ResetPasswordResponseDto> {
    await this.authService.resetPassword(dto);
    return { message: "Password has been reset successfully" };
  }
}
