import { CreateLeadProps, LeadSocialLinks, LeadStatus, LeadType } from "@modules/lead/domain/lead.types";
import { createId } from "@paralleldrive/cuid2";

export class LeadEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly status: LeadStatus,
    public readonly name: string | null,
    public readonly description: string | null,
    public readonly address: string | null,
    public readonly latitude: number | null,
    public readonly longitude: number | null,
    public readonly phone: string | null,
    public readonly website: string | null,
    public readonly businessStatus: string | null,
    public readonly rating: number | null,
    public readonly userRatingCount: number | null,
    public readonly primaryType: LeadType | null,
    public readonly types: LeadType[],
    public readonly emails: string[],
    public readonly otherPhones: string[],
    public readonly socialLinks: LeadSocialLinks,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(props: CreateLeadProps): LeadEntity {
    return new LeadEntity(
      props.id ?? createId(),
      props.companyId,
      props.status ?? "ENRICHING",
      props.name ?? null,
      props.description ?? null,
      props.address ?? null,
      props.latitude ?? null,
      props.longitude ?? null,
      props.phone ?? null,
      props.website ?? null,
      props.businessStatus ?? null,
      props.rating ?? null,
      props.userRatingCount ?? null,
      props.primaryType ?? null,
      props.types ?? [],
      props.emails ?? [],
      props.otherPhones ?? [],
      props.socialLinks ?? { otherLinks: [] },
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date()
    );
  }

  updateStatus(status: LeadStatus): LeadEntity {
    return new LeadEntity(
      this.id,
      this.companyId,
      status,
      this.name,
      this.description,
      this.address,
      this.latitude,
      this.longitude,
      this.phone,
      this.website,
      this.businessStatus,
      this.rating,
      this.userRatingCount,
      this.primaryType,
      this.types,
      this.emails,
      this.otherPhones,
      this.socialLinks,
      this.createdAt,
      new Date()
    );
  }
}
