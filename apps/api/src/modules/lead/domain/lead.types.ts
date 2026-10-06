export const LEAD_TYPES = [
  "RESTAURANT",
  "HOTEL",
  "HOSPITAL",
  "DENTAL_CLINIC",
  "REAL_ESTATE_AGENCY",
  "ACCOUNTING",
  "GYM",
  "BEAUTY_SALON",
  "DENTIST",
  "LAWYER",
  "SPA",
  "CAFE",
  "CLOTHING_STORE",
  "SCHOOL",
  "UNIVERSITY",
  "CAR_DEALER",
  "CAR_RENTAL",
  "COWORKING_SPACE",
  "HOSTEL",
  "WEDDING_VENUE",
  "PRESCHOOL",
  "PRIMARY_SCHOOL",
  "SECONDARY_SCHOOL"
] as const;
export type LeadType = (typeof LEAD_TYPES)[number];

export type LeadStatus = "ENRICHING" | "READY" | "CONTACTED" | "INTERESTED" | "UNRESPONSIVE" | "REJECTED" | "COMPLETED" | "ARCHIVED";

export interface LeadSocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
  youtube?: string;
  whatsapp?: string;
  otherLinks: string[];
}

export interface CreateLeadProps {
  id?: string;
  companyId: string;
  status?: LeadStatus;
  name?: string | null;
  description?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  website?: string | null;
  businessStatus?: string | null;
  rating?: number | null;
  userRatingCount?: number | null;
  primaryType?: LeadType | null;
  types?: LeadType[];
  emails?: string[];
  otherPhones?: string[];
  socialLinks?: LeadSocialLinks;
  completedBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateLeadProps {
  status?: LeadStatus;
  name?: string | null;
  description?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  website?: string | null;
  businessStatus?: string | null;
  rating?: number | null;
  userRatingCount?: number | null;
  primaryType?: LeadType | null;
  types?: LeadType[];
  emails?: string[];
  otherPhones?: string[];
  socialLinks?: LeadSocialLinks;
  completedBy?: string | null;
}
