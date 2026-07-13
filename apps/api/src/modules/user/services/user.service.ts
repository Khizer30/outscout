import { EncryptionService } from "@modules/encryption/services/encryption.service";
import { UserEntity } from "@modules/user/domain/user.entity";
import { UserAlreadyExistsError, UserNotFoundError } from "@modules/user/domain/user.errors";
import { UserRepository } from "@modules/user/domain/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly encryptionService: EncryptionService
  ) {}
}
