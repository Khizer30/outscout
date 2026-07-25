export type LeadType =
  | "SOFTWARE_COMPANY"
  | "ADVERTISING_AGENCY"
  | "MARKETING_AGENCY"
  | "RESTAURANT"
  | "HOTEL"
  | "HOSPITAL"
  | "DENTAL_CLINIC"
  | "REAL_ESTATE_AGENCY"
  | "LAW_FIRM"
  | "ACCOUNTING"
  | "GYM"
  | "BEAUTY_SALON";

export type LeadStatus = "ENRICHING" | "READY" | "CONTACTED" | "INTERESTED" | "UNRESPONSIVE" | "REJECTED";

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
