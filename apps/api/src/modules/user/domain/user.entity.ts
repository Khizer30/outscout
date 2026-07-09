import { createId } from "@paralleldrive/cuid2";

export type Role = "USER" | "ADMIN";

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: Role,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null
  ) {}

  static create(props: {
    id?: string;
    name: string;
    email: string;
    password: string;
    role?: Role;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
  }): UserEntity {
    return new UserEntity(
      props.id ?? createId(),
      props.name,
      props.email,
      props.password,
      props.role ?? "USER",
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
      props.deletedAt ?? null
    );
  }

  isAdmin(): boolean {
    return this.role === "ADMIN";
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  toSafe(): Omit<UserEntity, "password"> {
    const { password: _, ...safe } = this;
    return safe as Omit<UserEntity, "password">;
  }
}
