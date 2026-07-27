import { AuthGuard } from "@middleware/auth.guard";
import { User } from "@middleware/user.decorator";
import { AuthService } from "@modules/auth/services/auth.service";
import { JWTService } from "@modules/jwt/services/jwt.service";
import { Body, Controller, Post, Res, HttpCode, HttpStatus, Ip, Req, Get, Delete, UnauthorizedException, UseGuards } from "@nestjs/common";
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
  ResetPasswordResponseDto,
  RefreshResponseDto,
  LogoutResponseDto,
  MeResponseDto,
  SwitchCompanyDto,
  SwitchCompanyResponseDto,
  DeleteAccountResponseDto
} from "@repo/dtos/auth";
import type { Request, Response } from "express";

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
  async login(@Body() dto: LoginDto, @Ip() ip: string, @Res({ passthrough: true }) res: Response): Promise<LoginResponseDto> {
    const { user, accessToken, refreshToken } = await this.authService.login(dto, ip);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: this.isProduction,
      secure: this.isProduction,
      sameSite: "lax",
      maxAge: this.jwtService.refreshTokenMaxAge,
      path: "/"
    });

    return { data: { user, accessToken } };
  }

  @Get("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Ip() ip: string, @Res({ passthrough: true }) res: Response): Promise<RefreshResponseDto> {
    const token = req.cookies["refreshToken"];
    if (!token) {
      throw new UnauthorizedException("Session has expired");
    }

    try {
      const { user, accessToken, refreshToken: newRefreshToken } = await this.authService.refresh(token, ip);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: this.isProduction,
        secure: this.isProduction,
        sameSite: "lax",
        maxAge: this.jwtService.refreshTokenMaxAge,
        path: "/"
      });

      return { data: { user, accessToken } };
    } catch (err) {
      res.clearCookie("refreshToken", { path: "/" });
      throw err;
    }
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<LogoutResponseDto> {
    const token = req.cookies["refreshToken"];
    if (token) {
      await this.authService.logout(token);
    }

    res.clearCookie("refreshToken", { path: "/" });

    return { message: "Logged out successfully" };
  }

  @Get("me")
  @UseGuards(AuthGuard)
  async me(@User() user: AuthenticatedUser): Promise<MeResponseDto> {
    return { data: user };
  }

  @Post("switch-company")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async switchCompany(
    @User() user: AuthenticatedUser,
    @Body() dto: SwitchCompanyDto,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<SwitchCompanyResponseDto> {
    const { user: updatedUser, accessToken, refreshToken: newRefreshToken } = await this.authService.switchCompany(user.id, ip, dto);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: this.isProduction,
      secure: this.isProduction,
      sameSite: "lax",
      maxAge: this.jwtService.refreshTokenMaxAge,
      path: "/"
    });

    return { data: { user: updatedUser, accessToken } };
  }

  @Delete("me")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async deleteMe(@User() user: AuthenticatedUser, @Res({ passthrough: true }) res: Response): Promise<DeleteAccountResponseDto> {
    await this.authService.deleteAccount(user.id);

    res.clearCookie("refreshToken", { path: "/" });

    return { message: "Account deleted successfully" };
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
