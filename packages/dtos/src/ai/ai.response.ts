import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { GeneratedEmailMessageSchema, GeneratedWhatsAppMessageSchema } from "../lead/lead.response.js";
import { MessageChannelSchema } from "../lead/lead.request.js";

export const RewriteOutreachMessageResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    leadId: z.string(),
    channel: MessageChannelSchema,
    data: z.union([GeneratedWhatsAppMessageSchema, GeneratedEmailMessageSchema])
  })
});

export class RewriteOutreachMessageResponseDto extends createZodDto(RewriteOutreachMessageResponseSchema) {}
