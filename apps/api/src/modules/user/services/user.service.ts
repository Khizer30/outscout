import { HashService } from "@modules/hash/hash.service";
import { UserEntity } from "@modules/user/domain/user.entity";
import { UserAlreadyExistsError, UserNotFoundError } from "@modules/user/domain/user.errors";
import { UserRepository } from "@modules/user/domain/user.repository";
import { Injectable } from "@nestjs/common";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  age: number;
}

export interface UpdateUserInput {
  name?: string;
  age?: number;
}

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly hashService: HashService
  ) {}

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new UserNotFoundError({ userId: id });
    }

    return user;
  }

  async create(input: CreateUserInput): Promise<UserEntity> {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new UserAlreadyExistsError({ email: input.email });
    }

    const hashed = await this.hashService.hashPassword(input.password);

    const user = UserEntity.create({
      name: input.name,
      email: input.email,
      password: hashed
    });

    return this.userRepo.create(user);
  }

  async update(id: string, input: UpdateUserInput): Promise<UserEntity> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new UserNotFoundError({ userId: id });
    }

    return this.userRepo.update(id, input);
  }

  async delete(id: string): Promise<void> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new UserNotFoundError({ userId: id });
    }

    return this.userRepo.softDelete(id);
  }
}
