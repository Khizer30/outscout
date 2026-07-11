import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { sign, verify, decode, TokenExpiredError, type Jwt, type JwtPayload, type SignOptions } from "jsonwebtoken";

@Injectable()
export class JWTService {
  private readonly secret: string;
  private readonly refreshSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;
  readonly accessTokenMaxAge: number;
  readonly refreshTokenMaxAge: number;

  constructor(private readonly configService: ConfigService) {
    const secret = this.configService.get<string>("JWT_SECRET");
    if (!secret) {
      throw new InternalServerErrorException("JWT_SECRET environment variable is required");
    }

    const refreshSecret = this.configService.get<string>("JWT_REFRESH_SECRET");
    if (!refreshSecret) {
      throw new InternalServerErrorException("JWT_REFRESH_SECRET environment variable is required");
    }

    this.secret = secret;
    this.refreshSecret = refreshSecret;
    this.accessTokenExpiry = this.configService.get<string>("JWT_EXPIRE_TIME", "15m");
    this.refreshTokenExpiry = this.configService.get<string>("JWT_REFRESH_EXPIRE_TIME", "7d");

    this.accessTokenMaxAge = this.parseExpiryToMilliseconds(this.accessTokenExpiry);
    this.refreshTokenMaxAge = this.parseExpiryToMilliseconds(this.refreshTokenExpiry);
  }

  private parseExpiryToMilliseconds(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new InternalServerErrorException(`Invalid expiry format: ${expiry}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case "s":
        return value * 1000;
      case "m":
        return value * 60 * 1000;
      case "h":
        return value * 60 * 60 * 1000;
      case "d":
        return value * 24 * 60 * 60 * 1000;
      default:
        throw new InternalServerErrorException(`Invalid expiry unit: ${unit}`);
    }
  }

  generateAccessToken(data: object): string {
    return sign({ data }, this.secret, {
      expiresIn: this.accessTokenExpiry
    } as SignOptions);
  }

  generateRefreshToken(data: object): string {
    return sign({ data }, this.refreshSecret, {
      expiresIn: this.refreshTokenExpiry
    } as SignOptions);
  }

  verifyToken(token: string): JwtPayload | string {
    try {
      return verify(token, this.secret);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException("Token has expired");
      }
      throw new UnauthorizedException("Invalid token");
    }
  }

  verifyRefreshToken(token: string): JwtPayload | string {
    try {
      return verify(token, this.refreshSecret);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException("Token has expired");
      }
      throw new UnauthorizedException("Invalid token");
    }
  }

  decodeToken(token: string): Jwt | null {
    return decode(token, { complete: true });
  }
}
