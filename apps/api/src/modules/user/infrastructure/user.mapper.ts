import { UserEntity } from "@modules/user/domain/user.entity";
import { UserResponseDto } from "@repo/dtos/user";
import { User, UserInsert } from "@schema/index";

export class UserMapper {
  static toDomain(row: User): UserEntity {
    return new UserEntity(
      row.id,
      row.name,
      row.email,
      row.passwordHash,
      row.isSuperAdmin ? "ADMIN" : "USER",
      row.createdAt,
      row.updatedAt,
      row.deletedAt
    );
  }

  static toPersistence(entity: UserEntity): UserInsert {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      passwordHash: entity.password,
      isSuperAdmin: entity.role === "ADMIN"
    };
  }

  static toResponse(entity: UserEntity): UserResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      role: entity.role,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }
}

