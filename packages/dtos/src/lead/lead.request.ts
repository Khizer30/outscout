import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const LeadStatusSchema = z.enum(["ENRICHING", "READY", "CONTACTED", "INTERESTED", "UNRESPONSIVE", "REJECTED"]);

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

// Update Lead Status
export const UpdateLeadStatusSchema = z.object({
  status: LeadStatusSchema
});

export class UpdateLeadStatusDto extends createZodDto(UpdateLeadStatusSchema) {}
