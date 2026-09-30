import { DatabaseService } from "@database/services/database.service";
import { UserEntity } from "@modules/user/domain/user.entity";
import { UserRepository } from "@modules/user/domain/user.repository";
import { UserMapper } from "@modules/user/infrastructure/user.mapper";
import { Injectable } from "@nestjs/common";
import { usersTable } from "@schema/users";
import { eq, isNull, and, inArray } from "drizzle-orm";

@Injectable()
export class UserDrizzleRepository extends UserRepository {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const [row] = await this.databaseService.db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.email, email), isNull(usersTable.deletedAt)))
      .limit(1);
    return row ? UserMapper.toDomain(row) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const [row] = await this.databaseService.db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.id, id), isNull(usersTable.deletedAt)))
      .limit(1);
    return row ? UserMapper.toDomain(row) : null;
  }

  async findByIds(ids: string[]): Promise<UserEntity[]> {
    if (ids.length === 0) {
      return [];
    }

    const rows = await this.databaseService.db
      .select()
      .from(usersTable)
      .where(and(inArray(usersTable.id, ids), isNull(usersTable.deletedAt)));
    return rows.map(UserMapper.toDomain);
  }

  async create(entity: UserEntity): Promise<UserEntity> {
    const [row] = await this.databaseService.db.insert(usersTable).values(UserMapper.toPersistence(entity)).returning();
    return UserMapper.toDomain(row);
  }

  async update(entity: UserEntity): Promise<UserEntity> {
    const [row] = await this.databaseService.db.update(usersTable).set(UserMapper.toPersistence(entity)).where(eq(usersTable.id, entity.id)).returning();
    return UserMapper.toDomain(row);
  }
}
