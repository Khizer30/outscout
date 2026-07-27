import { LeadEntity } from "@modules/lead/domain/lead.entity";
import { LeadSocialLinks, LeadStatus, LeadType } from "@modules/lead/domain/lead.types";
import { LeadResponseDto } from "@repo/dtos/lead";
import { Lead, LeadInsert } from "@schema/index";

export class LeadMapper {
  static toDomain(row: Lead): LeadEntity {
    return new LeadEntity(
      row.id,
      row.companyId,
      row.status as LeadStatus,
      row.name,
      row.description,
      row.address,
      row.latitude,
      row.longitude,
      row.phone,
      row.website,
      row.businessStatus,
      row.rating,
      row.userRatingCount,
      row.primaryType as LeadType | null,
      row.types as LeadType[],
      row.emails,
      row.otherPhones,
      row.socialLinks as LeadSocialLinks,
      row.createdAt,
      row.updatedAt
    );
  }

  static toPersistence(entity: LeadEntity): LeadInsert {
    return {
      id: entity.id,
      companyId: entity.companyId,
      status: entity.status,
      name: entity.name,
      description: entity.description,
      address: entity.address,
      latitude: entity.latitude,
      longitude: entity.longitude,
      phone: entity.phone,
      website: entity.website,
      businessStatus: entity.businessStatus,
      rating: entity.rating,
      userRatingCount: entity.userRatingCount,
      primaryType: entity.primaryType,
      types: entity.types,
      emails: entity.emails,
      otherPhones: entity.otherPhones,
      socialLinks: entity.socialLinks,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  static toResponse(entity: LeadEntity): LeadResponseDto {
    return {
      id: entity.id,
      companyId: entity.companyId,
      status: entity.status,
      name: entity.name,
      description: entity.description,
      address: entity.address,
      latitude: entity.latitude,
      longitude: entity.longitude,
      phone: entity.phone,
      website: entity.website,
      businessStatus: entity.businessStatus,
      rating: entity.rating,
      userRatingCount: entity.userRatingCount,
      primaryType: entity.primaryType,
      types: entity.types,
      emails: entity.emails,
      otherPhones: entity.otherPhones,
      socialLinks: entity.socialLinks,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }
}
