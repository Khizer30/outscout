import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const LeadStatusSchema = z.enum(["ENRICHING", "READY", "CONTACTED", "INTERESTED", "UNRESPONSIVE", "REJECTED"]);

export const LeadTypeSchema = z.enum(["RESTAURANT", "HOTEL", "HOSPITAL", "DENTAL_CLINIC", "REAL_ESTATE_AGENCY", "ACCOUNTING", "GYM", "BEAUTY_SALON"]);

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

// Generate Leads
export const GenerateLeadsSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().int().min(1).max(50000),
  serviceType: LeadTypeSchema,
  limit: z.number().int().min(1).max(20).default(20)
});

export class GenerateLeadsDto extends createZodDto(GenerateLeadsSchema) {}

// Get Leads
export const GetLeadsSchema = z.object({
  status: z.array(LeadStatusSchema).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
});

export class GetLeadsDto extends createZodDto(GetLeadsSchema) {}

// Update Lead
export const UpdateLeadSchema = z.object({
  status: LeadStatusSchema.optional(),
  name: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  emails: z.array(z.string()).optional(),
  otherPhones: z.array(z.string()).optional(),
  socialLinks: LeadSocialLinksSchema.optional()
});

export class UpdateLeadDto extends createZodDto(UpdateLeadSchema) {}
