import { UserEntity } from "@modules/user/domain/user.entity";

export abstract class UserRepository {
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract create(user: UserEntity): Promise<UserEntity>;
  abstract update(id: string, data: Partial<UserEntity>): Promise<UserEntity>;
  abstract softDelete(id: string): Promise<void>;
}
