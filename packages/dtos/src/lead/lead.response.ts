import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { LeadStatusSchema } from "./lead.request.js";

export const LeadTypeSchema = z.enum([
  "SOFTWARE_COMPANY",
  "ADVERTISING_AGENCY",
  "MARKETING_AGENCY",
  "RESTAURANT",
  "HOTEL",
  "HOSPITAL",
  "DENTAL_CLINIC",
  "REAL_ESTATE_AGENCY",
  "LAW_FIRM",
  "ACCOUNTING",
  "GYM",
  "BEAUTY_SALON"
]);

export const LeadSocialLinksSchema = z.object({
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  whatsapp: z.string().optional(),
  otherLinks: z.array(z.string())
});

// Lead
export const LeadResponseSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  status: LeadStatusSchema,
  name: z.string().nullable(),
  description: z.string().nullable(),
  address: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  phone: z.string().nullable(),
  website: z.string().nullable(),
  businessStatus: z.string().nullable(),
  rating: z.number().nullable(),
  userRatingCount: z.number().nullable(),
  primaryType: LeadTypeSchema.nullable(),
  types: z.array(LeadTypeSchema),
  emails: z.array(z.string()),
  otherPhones: z.array(z.string()),
  socialLinks: LeadSocialLinksSchema,
  createdAt: z.date(),
  updatedAt: z.date()
});

export class LeadResponseDto extends createZodDto(LeadResponseSchema) {}

// Get Leads
export const GetLeadsResponseSchema = z.object({
  data: z.array(LeadResponseSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number()
  })
});

export class GetLeadsResponseDto extends createZodDto(GetLeadsResponseSchema) {}

// Get Lead
export const GetLeadResponseSchema = z.object({
  data: LeadResponseSchema
});

export class GetLeadResponseDto extends createZodDto(GetLeadResponseSchema) {}

// Update Lead Status
export const UpdateLeadStatusResponseSchema = z.object({
  data: LeadResponseSchema
});

export class UpdateLeadStatusResponseDto extends createZodDto(UpdateLeadStatusResponseSchema) {}
