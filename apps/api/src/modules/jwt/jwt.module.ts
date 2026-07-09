import { JWTService } from "@modules/jwt/jwt.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [JWTService],
  exports: [JWTService]
})
export class JWTModule {}
