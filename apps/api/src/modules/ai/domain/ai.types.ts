import { MessageChannel } from "@modules/company/domain/companyMessageRules.types";
import { LeadSocialLinks } from "@modules/lead/domain/lead.types";
import { z } from "zod";

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

export const WHATSAPP_MESSAGE_PARTS = ["greetings", "opening", "body", "callToAction"] as const;
export const EMAIL_MESSAGE_PARTS = ["subject", "opening", "body", "callToAction", "signOff"] as const;

export type MessagePart = (typeof WHATSAPP_MESSAGE_PARTS)[number] | (typeof EMAIL_MESSAGE_PARTS)[number];

export interface RewriteOutreachMessageInput {
  data: GeneratedMessage;
  prompt: string;
  messagePart?: MessagePart;
  company: OutreachCompanyInfo;
  messageRules: OutreachMessageRules;
}

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

export const ContactInfoSchema = z.object({
  description: z.string().nullable(),
  emails: z.array(z.string()),
  phones: z.array(z.string()),
  location: z.string().nullable(),
  instagram: z.string().nullable(),
  facebook: z.string().nullable(),
  twitter: z.string().nullable(),
  linkedin: z.string().nullable(),
  tiktok: z.string().nullable(),
  youtube: z.string().nullable(),
  whatsapp: z.string().nullable(),
  other: z.array(z.string())
});

export const WhatsAppMessageSchema = z.object({
  greetings: z.string().describe("The opening greeting line, e.g. 'Hello, <BUSINESS_NAME>'"),
  opening: z.string().describe("A short, observant piece of small talk personalised to this specific business"),
  body: z.string().describe("The core pitch: one specific benefit relevant to this business type"),
  callToAction: z.string().describe("A soft closing call-to-action inviting a quick chat")
});

export const EmailMessageSchema = z.object({
  subject: z.string().describe("Concise, curiosity-driven subject line relevant to their business type"),
  opening: z.string().describe("A genuine, specific observation about their business used as the opening line"),
  body: z.string().describe("The core pitch: 1-2 services most relevant to this business type"),
  callToAction: z.string().describe("A single soft call-to-action inviting a reply or a quick call"),
  signOff: z.string().describe("A short professional sign-off")
});
