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

// Autocomplete Leads
export const AutocompleteLeadsSchema = z.object({
  query: z.string().min(1, { error: "Query is required" }),
  latitude: z.number().min(-90, { error: "Latitude must be between -90 and 90" }).max(90, { error: "Latitude must be between -90 and 90" }).optional(),
  longitude: z.number().min(-180, { error: "Longitude must be between -180 and 180" }).max(180, { error: "Longitude must be between -180 and 180" }).optional(),
  radius: z.number().int().min(1, { error: "Radius must be at least 1 meter" }).max(50000, { error: "Radius must be at most 50000 meters" }).optional(),
  types: z.array(LeadTypeSchema).optional()
});

export class AutocompleteLeadsDto extends createZodDto(AutocompleteLeadsSchema) {}

// Generate Leads
export const GenerateLeadsSchema = z.object({
  latitude: z.number().min(-90, { error: "Latitude must be between -90 and 90" }).max(90, { error: "Latitude must be between -90 and 90" }),
  longitude: z.number().min(-180, { error: "Longitude must be between -180 and 180" }).max(180, { error: "Longitude must be between -180 and 180" }),
  radius: z.number().int().min(1, { error: "Radius must be at least 1 meter" }).max(50000, { error: "Radius must be at most 50000 meters" }),
  serviceType: LeadTypeSchema,
  limit: z.number().int().min(1, { error: "Limit must be at least 1" }).max(20, { error: "Limit must be at most 20" }).default(20)
});

export class GenerateLeadsDto extends createZodDto(GenerateLeadsSchema) {}

// Get Leads
export const GetLeadsSchema = z.object({
  status: z.array(LeadStatusSchema).optional(),
  page: z.number().int().min(1, { error: "Page must be at least 1" }).default(1),
  limit: z.number().int().min(1, { error: "Limit must be at least 1" }).max(100, { error: "Limit must be at most 100" }).default(20)
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
