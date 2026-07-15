import { UserEntity } from "@modules/user/domain/user.entity";

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract create(user: UserEntity): Promise<UserEntity>;
  abstract update(user: UserEntity): Promise<UserEntity>;
}
