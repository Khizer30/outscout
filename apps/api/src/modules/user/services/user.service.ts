import { EncryptionService } from "@modules/encryption/services/encryption.service";
import { UserEntity } from "@modules/user/domain/user.entity";
import { UserAlreadyExistsError } from "@modules/user/domain/user.errors";
import { UserRepository } from "@modules/user/domain/user.repository";
import { Injectable } from "@nestjs/common";

interface CreateUser {
  name: string;
  email: string;
  password: string;
  timezone?: string;
}

interface UpdateUser {
  name?: string;
  password?: string;
  timezone?: string;
}

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly encryptionService: EncryptionService
  ) {}

  async createUser(data: CreateUser): Promise<UserEntity> {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      throw new UserAlreadyExistsError({ email: data.email });
    }

    const passwordHash = await this.encryptionService.hashPassword(data.password);

    const user = UserEntity.create({
      name: data.name,
      email: data.email,
      passwordHash,
      timezone: data.timezone
    });

    return this.userRepo.create(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepo.findByEmail(email);
  }

  async updateUser(user: UserEntity, data: UpdateUser): Promise<UserEntity> {
    let passwordHash = user.passwordHash;
    if (data.password) {
      passwordHash = await this.encryptionService.hashPassword(data.password);
    }

    const updatedUser = user.update({
      name: data.name,
      passwordHash,
      timezone: data.timezone
    });

    return this.userRepo.update(updatedUser);
  }
}
