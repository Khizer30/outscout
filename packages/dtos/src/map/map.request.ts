import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { LeadTypeSchema } from "../lead/lead.request.js";

// Autocomplete
export const AutocompleteSchema = z.object({
  query: z.string().min(1, { error: "Query is required" }),
  latitude: z.number().min(-90, { error: "Latitude must be between -90 and 90" }).max(90, { error: "Latitude must be between -90 and 90" }).optional(),
  longitude: z.number().min(-180, { error: "Longitude must be between -180 and 180" }).max(180, { error: "Longitude must be between -180 and 180" }).optional(),
  radius: z.number().int().min(1, { error: "Radius must be at least 1 meter" }).max(50000, { error: "Radius must be at most 50000 meters" }).optional(),
  types: z.array(LeadTypeSchema).optional()
});

export class AutocompleteDto extends createZodDto(AutocompleteSchema) {}
