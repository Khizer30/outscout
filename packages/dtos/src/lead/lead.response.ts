import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { LeadSocialLinksSchema, LeadStatusSchema, LeadTypeSchema } from "./lead.request.js";

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

// Generate Leads
export const GenerateLeadsResponseSchema = z.object({
  data: z.array(LeadResponseSchema)
});

export class GenerateLeadsResponseDto extends createZodDto(GenerateLeadsResponseSchema) {}

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

// Update Lead
export const UpdateLeadResponseSchema = z.object({
  data: LeadResponseSchema
});

export class UpdateLeadResponseDto extends createZodDto(UpdateLeadResponseSchema) {}

// Process Lead
export const ProcessLeadResponseSchema = z.object({
  data: LeadResponseSchema
});

export class ProcessLeadResponseDto extends createZodDto(ProcessLeadResponseSchema) {}
