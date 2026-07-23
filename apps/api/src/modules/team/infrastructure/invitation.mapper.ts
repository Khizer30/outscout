import { CompanyInvitationEntity } from "@modules/team/domain/invitation.entity";
import { CompanyInvitationPersistenceRecord, CompanyInvitationRecord } from "@modules/team/domain/invitation.types";
import { CompanyInvitationResponseDto } from "@repo/dtos/team";

export class InvitationMapper {
  static toDomain(row: CompanyInvitationRecord): CompanyInvitationEntity {
    return new CompanyInvitationEntity(
      row.id,
      row.companyId,
      row.email,
      row.role,
      row.status,
      row.token,
      row.invitedBy,
      row.expiresAt,
      row.acceptedAt,
      row.createdAt
    );
  }

  static toPersistence(entity: CompanyInvitationEntity): CompanyInvitationPersistenceRecord {
    return {
      id: entity.id,
      companyId: entity.companyId,
      email: entity.email,
      role: entity.role,
      status: entity.status,
      token: entity.token,
      invitedBy: entity.invitedBy?.id ?? null,
      expiresAt: entity.expiresAt,
      acceptedAt: entity.acceptedAt,
      createdAt: entity.createdAt
    };
  }

  static toResponse(entity: CompanyInvitationEntity): CompanyInvitationResponseDto {
    return {
      id: entity.id,
      companyId: entity.companyId,
      email: entity.email,
      role: entity.role,
      status: entity.status,
      invitedBy: entity.invitedBy,
      expiresAt: entity.expiresAt,
      acceptedAt: entity.acceptedAt,
      createdAt: entity.createdAt
    };
  }
}
