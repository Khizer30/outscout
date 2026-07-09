import Roles from "@middleware/roles.decorator";
import { JWTService } from "@modules/jwt/jwt.service";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { type Role } from "@schema/index";
import { type Request } from "express";
import { type JwtPayload } from "jsonwebtoken";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JWTService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: Role[] = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
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
    if (!request.user || !request.user.role) {
      throw new UnauthorizedException("Invalid token payload");
    }

    if (!roles.includes(request.user.role as Role)) {
      throw new ForbiddenException("Insufficient permissions to access this resource");
    }

    return true;
  }
}
