import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { MessageChannelSchema } from "./ai.request.js";

// Generate Outreach Message
export const GeneratedWhatsAppMessageSchema = z.object({
  greetings: z.string(),
  opening: z.string(),
  body: z.string(),
  callToAction: z.string()
});

export const GeneratedEmailMessageSchema = z.object({
  subject: z.string(),
  opening: z.string(),
  body: z.string(),
  callToAction: z.string(),
  signOff: z.string()
});

export const GenerateOutreachMessageResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    leadId: z.string(),
    channel: MessageChannelSchema,
    data: z.union([GeneratedWhatsAppMessageSchema, GeneratedEmailMessageSchema])
  })
});

export class GenerateOutreachMessageResponseDto extends createZodDto(GenerateOutreachMessageResponseSchema) {}
