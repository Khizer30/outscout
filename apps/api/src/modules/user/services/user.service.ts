import { EncryptionService } from "@modules/encryption/services/encryption.service";
import { MediaService } from "@modules/media/services/media.service";
import { UserEntity } from "@modules/user/domain/user.entity";
import { UserAlreadyExistsError, UserNotFoundError } from "@modules/user/domain/user.errors";
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
  profileImageURL?: string | null;
}

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly encryptionService: EncryptionService,
    private readonly mediaService: MediaService
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

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepo.findById(id);
  }

  async updateUserEntity(user: UserEntity, data: UpdateUser): Promise<UserEntity> {
    let passwordHash = user.passwordHash;
    if (data.password) {
      passwordHash = await this.encryptionService.hashPassword(data.password);
    }

    const profileImagePublicId =
      data.profileImageURL !== undefined ? (data.profileImageURL ? this.mediaService.urlToPublicId(data.profileImageURL) : null) : undefined;

    const updatedUser = user.update({
      name: data.name,
      passwordHash,
      timezone: data.timezone,
      profileImageURL: data.profileImageURL,
      profileImagePublicId
    });

    return this.userRepo.update(updatedUser);
  }

  async getUserById(userId: string): Promise<UserEntity> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundError({ userId });
    }

    return user;
  }

  async updateUserById(userId: string, data: UpdateUser): Promise<UserEntity> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundError({ userId });
    }

    const previousPublicId = user.profileImagePublicId;
    const updatedUser = await this.updateUserEntity(user, data);

    if (data.profileImageURL && previousPublicId && previousPublicId !== updatedUser.profileImagePublicId) {
      await this.mediaService.deleteImageByPublicId(previousPublicId);
    }

    return updatedUser;
  }

  async verifyUser(user: UserEntity): Promise<UserEntity> {
    const updatedUser = user.update({ isVerified: true });
    return this.userRepo.update(updatedUser);
  }

  async deleteUserById(userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UserNotFoundError({ userId });
    }

    await this.userRepo.update(user.delete());
  }
}
