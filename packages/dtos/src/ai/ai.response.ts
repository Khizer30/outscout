import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Extract Contact Info
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

export const ExtractContactInfoResponseSchema = z.object({
  data: ContactInfoSchema
});

export class ExtractContactInfoResponseDto extends createZodDto(ExtractContactInfoResponseSchema) {}
