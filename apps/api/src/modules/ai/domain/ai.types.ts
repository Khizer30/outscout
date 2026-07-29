import { MessageChannel } from "@modules/company/domain/companyMessageRules.types";
import { LeadSocialLinks } from "@modules/lead/domain/lead.types";

export type { MessageChannel };

export interface OutreachLeadInfo {
  name: string | null;
  description: string | null;
  primaryType: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  businessStatus: string | null;
  rating: number | null;
  userRatingCount: number | null;
  emails: string[];
  socialLinks: LeadSocialLinks;
}

export interface OutreachCompanyInfo {
  about: string | null;
}

export interface OutreachMessageRules {
  rules: string | null;
  greeting: string | null;
}

export interface GenerateOutreachMessageInput {
  channel: MessageChannel;
  lead: OutreachLeadInfo;
  company: OutreachCompanyInfo;
  messageRules: OutreachMessageRules;
}

export interface GeneratedWhatsAppMessage {
  channel: "WHATSAPP";
  greetings: string;
  opening: string;
  body: string;
  callToAction: string;
}

export interface GeneratedEmailMessage {
  channel: "EMAIL";
  subject: string;
  opening: string;
  body: string;
  callToAction: string;
  signOff: string;
}

export type GeneratedMessage = GeneratedWhatsAppMessage | GeneratedEmailMessage;

export interface ContactInfo {
  description: string | null;
  emails: string[];
  phones: string[];
  location: string | null;
  instagram: string | null;
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  tiktok: string | null;
  youtube: string | null;
  whatsapp: string | null;
  other: string[];
}
