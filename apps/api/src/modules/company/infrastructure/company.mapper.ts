import { CompanyEntity } from "@modules/company/domain/company.entity";
import { CompanyMembershipEntity, CompanyMembershipRole, CompanyMembershipStatus } from "@modules/company/domain/companyMembership.entity";
import { CompanyResponseDto } from "@repo/dtos/company";
import { Company, CompanyInsert, CompanyMembership, CompanyMembershipInsert } from "@schema/index";

export class CompanyMapper {
  static toDomain(row: Company): CompanyEntity {
    return new CompanyEntity(row.id, row.name, row.about, row.companyImageURL, row.createdAt, row.updatedAt, row.deletedAt);
  }

  static toPersistence(entity: CompanyEntity): CompanyInsert {
    return {
      id: entity.id,
      name: entity.name,
      about: entity.about,
      companyImageURL: entity.companyImageURL,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt
    };
  }

  static toResponse(entity: CompanyEntity): CompanyResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      about: entity.about,
      companyImageURL: entity.companyImageURL,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt
    };
  }
}

export class CompanyMembershipMapper {
  static toDomain(row: CompanyMembership): CompanyMembershipEntity {
    return new CompanyMembershipEntity(
      row.id,
      row.companyId,
      row.userId,
      row.role as CompanyMembershipRole,
      row.status as CompanyMembershipStatus,
      row.joinedAt
    );
  }

  static toPersistence(entity: CompanyMembershipEntity): CompanyMembershipInsert {
    return {
      id: entity.id,
      companyId: entity.companyId,
      userId: entity.userId,
      role: entity.role,
      status: entity.status,
      joinedAt: entity.joinedAt
    };
  }
}
