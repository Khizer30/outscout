import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Extract Contact Info
export const ExtractContactInfoSchema = z.object({
  websiteUrl: z.string().min(1)
});

export class ExtractContactInfoDto extends createZodDto(ExtractContactInfoSchema) {}
