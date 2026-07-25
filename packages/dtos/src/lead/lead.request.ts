import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const LeadStatusSchema = z.enum(["ENRICHING", "READY", "CONTACTED", "INTERESTED", "UNRESPONSIVE", "REJECTED"]);

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
