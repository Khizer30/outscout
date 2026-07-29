import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const MessageChannelSchema = z.enum(["WHATSAPP", "EMAIL"]);

// Generate Outreach Message
export const GenerateOutreachMessageQuerySchema = z.object({
  channel: MessageChannelSchema
});

export class GenerateOutreachMessageQueryDto extends createZodDto(GenerateOutreachMessageQuerySchema) {}
