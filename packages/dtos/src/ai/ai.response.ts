import { createZodDto } from "nestjs-zod";
import { z } from "zod";

// Generate Outreach Message
export const GeneratedWhatsAppMessageSchema = z.object({
  leadId: z.string(),
  channel: z.literal("WHATSAPP"),
  greetings: z.string(),
  opening: z.string(),
  body: z.string(),
  callToAction: z.string()
});

export const GeneratedEmailMessageSchema = z.object({
  leadId: z.string(),
  channel: z.literal("EMAIL"),
  subject: z.string(),
  opening: z.string(),
  body: z.string(),
  callToAction: z.string(),
  signOff: z.string()
});

export const GenerateOutreachMessageResponseSchema = z.object({
  data: z.discriminatedUnion("channel", [GeneratedWhatsAppMessageSchema, GeneratedEmailMessageSchema])
});

export class GenerateOutreachMessageResponseDto extends createZodDto(GenerateOutreachMessageResponseSchema) {}
