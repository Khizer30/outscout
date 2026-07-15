import SuperAdmin from "@middleware/superAdmin.decorator";
import { JWTService } from "@modules/jwt/services/jwt.service";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { type Request } from "express";
import { type JwtPayload } from "jsonwebtoken";

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JWTService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isSuperAdminRequired = this.reflector.get(SuperAdmin, context.getHandler());
    if (!isSuperAdminRequired) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();

    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    const accessToken = type === "Bearer" ? token : undefined;
    if (!accessToken) {
      throw new UnauthorizedException("Access token not found");
    }

    const payload = this.jwtService.verifyToken(accessToken) as JwtPayload;
    if (!payload.data) {
      throw new UnauthorizedException("Invalid token payload");
    }

    request.user = payload.data;
    if (!request.user) {
      throw new UnauthorizedException("Invalid token payload");
    }

    if (!request.user.isSuperAdmin) {
      throw new ForbiddenException("Insufficient permissions to access this resource");
    }

    return true;
  }
}
