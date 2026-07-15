import { createId } from "@paralleldrive/cuid2";

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly isVerified: boolean,
    public readonly isSuperAdmin: boolean,
    public readonly profileImageURL: string | null,
    public readonly timezone: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null
  ) {}

  static create(props: {
    id?: string;
    name: string;
    email: string;
    passwordHash: string;
    isVerified?: boolean;
    isSuperAdmin?: boolean;
    profileImageURL?: string | null;
    timezone?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
  }): UserEntity {
    return new UserEntity(
      props.id ?? createId(),
      props.name,
      props.email,
      props.passwordHash,
      props.isVerified ?? false,
      props.isSuperAdmin ?? false,
      props.profileImageURL ?? null,
      props.timezone ?? "UTC",
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
      props.deletedAt ?? null
    );
  }

  update(props: {
    name?: string;
    email?: string;
    passwordHash?: string;
    isVerified?: boolean;
    profileImageURL?: string | null;
    timezone?: string;
  }): UserEntity {
    return new UserEntity(
      this.id,
      props.name ?? this.name,
      props.email ?? this.email,
      props.passwordHash ?? this.passwordHash,
      props.isVerified ?? this.isVerified,
      this.isSuperAdmin,
      props.profileImageURL !== undefined ? props.profileImageURL : this.profileImageURL,
      props.timezone ?? this.timezone,
      this.createdAt,
      new Date(),
      this.deletedAt
    );
  }

  isAdmin(): boolean {
    return this.isSuperAdmin;
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  toSafe(): Omit<UserEntity, "passwordHash"> {
    const { passwordHash: _, ...safe } = this;
    return safe as Omit<UserEntity, "passwordHash">;
  }
}
