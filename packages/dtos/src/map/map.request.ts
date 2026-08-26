import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { LeadTypeSchema } from "../lead/lead.request.js";

// Autocomplete
export const AutocompleteSchema = z.object({
  query: z.string().min(1, { error: "VALIDATION_QUERY_REQUIRED" }),
  latitude: z.number().min(-90, { error: "VALIDATION_LATITUDE_RANGE" }).max(90, { error: "VALIDATION_LATITUDE_RANGE" }).optional(),
  longitude: z.number().min(-180, { error: "VALIDATION_LONGITUDE_RANGE" }).max(180, { error: "VALIDATION_LONGITUDE_RANGE" }).optional(),
  radius: z.number().int().min(1, { error: "VALIDATION_RADIUS_MIN" }).max(50000, { error: "VALIDATION_RADIUS_MAX" }).optional(),
  types: z.array(LeadTypeSchema).optional()
});

export class AutocompleteDto extends createZodDto(AutocompleteSchema) {}
