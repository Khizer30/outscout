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
      row.isVerified,
      row.isSuperAdmin,
      row.profileImageURL,
      row.timezone,
      row.language,
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
      passwordHash: entity.passwordHash,
      isVerified: entity.isVerified,
      isSuperAdmin: entity.isSuperAdmin,
      profileImageURL: entity.profileImageURL,
      timezone: entity.timezone,
      language: entity.language,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt
    };
  }

  static toResponse(entity: UserEntity): UserResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      isVerified: entity.isVerified,
      isSuperAdmin: entity.isSuperAdmin,
      profileImageURL: entity.profileImageURL,
      timezone: entity.timezone,
      language: entity.language,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt
    };
  }
}
