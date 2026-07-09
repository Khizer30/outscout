import { HashModule } from "@modules/hash/hash.module";
import { UserRepository } from "@modules/user/domain/user.repository";
import { UserDrizzleRepository } from "@modules/user/infrastructure/userDrizzle.repository";
import { UserController } from "@modules/user/presentation/user.controller";
import { UserService } from "@modules/user/services/user.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [HashModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useClass: UserDrizzleRepository
    }
  ],
  exports: [UserService, UserRepository]
})
export class UserModule {}
